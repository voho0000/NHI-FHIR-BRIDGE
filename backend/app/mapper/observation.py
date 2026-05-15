import hashlib
import re
from collections import OrderedDict

from app.fhir import systems
from app.mapper._loinc_tables import (
    _DISPLAY_FIRST_CODES,
    _LOINC_DISPLAY,
    _LOINC_MAP,
    _NHI_TO_LOINC,
    _PANEL_LOINC_MAP,
)
from app.mapper._parsers import (
    _parse_range,
    _parse_range_multi,
    _to_ucum,
    _try_parse_quantity,
)

# Keywords that mean "this is imaging, ECG, or other non-lab study —
# belongs in DiagnosticReport, not Observation".
# Match is substring + case-insensitive against display + code.
_IMAGING_KEYWORDS = (
    "ultrasound",
    "sonogram",
    "sonography",
    "echo",
    "ct ",
    "ct/",
    "ct-",
    "computed tomography",
    "mri",
    "magnetic resonance",
    "x-ray",
    "xray",
    "x ray",
    "mammography",
    "mammo",
    "ekg",
    "ecg",
    "electrocardiogram",
    "endoscop",
    "colonoscop",
    "gastroscop",
    "bronchoscop",
    "pet/ct",
    "pet ",
    "spect",
    "影像",
    "超音波",
    "電腦斷層",
    "核磁共振",
    "心電圖",
    "內視鏡",
    "乳房攝影",
)


def map_observation(raw: dict, patient_id: str) -> dict | None:
    """Convert a scraped lab result dict → FHIR R4 Observation resource.

    Returns None when the row is not a valid lab Observation:
      - imaging / ECG / endoscopy studies (those belong in DiagnosticReport)
      - rows from a HIS list page that carry only metadata (no value)

    The caller is expected to filter out Nones from the result list.
    """
    display = raw.get("display") or raw.get("code") or ""
    code = raw.get("code") or ""
    if _looks_like_imaging(display, code):
        return None

    value = raw.get("value")
    interp = (raw.get("interpretation") or "").lower()
    has_value = value is not None and str(value).strip() not in ("", "—", "-", "N/A", "null")
    has_meaningful_interp = interp in (
        "normal",
        "abnormal",
        "high",
        "low",
        "critical",
        "positive",
        "negative",
    )
    if not has_value and not has_meaningful_interp:
        # List-page row (no result data) — skip; the corresponding
        # detail-page capture will produce a real Observation later.
        return None

    obs_id = _stable_id(patient_id, code, raw.get("date", ""))
    loinc = _find_loinc(code, display)

    resource: dict = {
        "resourceType": "Observation",
        "id": obs_id,
        "meta": {"versionId": "1", "source": "nhi-fhir-bridge/scraper"},
        "status": "final",
        "category": [
            {
                "coding": [
                    {
                        "system": "http://terminology.hl7.org/CodeSystem/observation-category",
                        "code": "laboratory",
                        "display": "Laboratory",
                    }
                ]
            }
        ],
        "code": {
            "coding": _build_codings(code, display, loinc),
            "text": display or "Unknown Lab",
        },
        "subject": {"reference": f"Patient/{patient_id}"},
    }

    if raw.get("date"):
        resource["effectiveDateTime"] = raw["date"] + "T00:00:00+08:00"

    if has_value:
        qty = _try_parse_quantity(str(value), raw.get("unit") or "")
        if qty is not None:
            resource["valueQuantity"] = qty
        else:
            resource["valueString"] = str(value)

    if raw.get("reference_range"):
        rr = _parse_range(str(raw["reference_range"]), raw.get("unit") or "")
        if rr:
            resource["referenceRange"] = [rr]

    # Explicit upstream hint wins (e.g. LLM-extracted "high" / "abnormal").
    # Otherwise derive from value + structured referenceRange — handles
    # both numeric (H/L/N) AND qualitative (POS/NEG/A) on the same path,
    # so urinalysis "4+ (2000)" vs ref "[Negative]" gets flagged Abnormal.
    interp_coding = _map_interpretation(interp) or _derive_interpretation(
        str(value) if value is not None else "",
        resource.get("valueQuantity"),
        (resource.get("referenceRange") or [None])[0],
    )
    if interp_coding:
        resource["interpretation"] = [{"coding": [interp_coding]}]

    return resource


def _looks_like_imaging(display: str, code: str) -> bool:
    """Return True when the test name suggests imaging / ECG / endoscopy."""
    haystack = f"{display} {code}".lower()
    return any(kw in haystack for kw in _IMAGING_KEYWORDS)


def _find_loinc(code: str, display: str) -> str | None:
    """Return primary LOINC for this lab.

    Lookup strategy is *panel-aware* — NHI 醫令代碼 maps 1:1 for most
    single-test orders, but a handful of panel codes (CBC 08011C, ABG
    09041B, urinalysis 06013C, …) reuse the same code across many
    item-specific displays. The dispatch:

      A. If `code` is a known *single-test* NHI code → use the NHI
         dict directly. This wins over generic display keywords so
         09005C "Glu-AC" → 1558-6 (fasting) instead of being shadowed
         by the "glucose" keyword → 2345-7 (random).
      B. Otherwise (panel code OR unknown code) → walk _LOINC_MAP by
         display keyword so each item under the panel gets its own
         LOINC. WBC under CBC 08011C → 6690-2, pO2 under ABG → 2703-7.
      C. Final fallback: if display matched nothing but the code is a
         panel/unknown code that happens to live in _NHI_TO_LOINC,
         return the panel LOINC (degrades gracefully for naked panel
         rows that lack an item label).
    """
    # A. Single-test NHI code wins outright.
    if code and code in _NHI_TO_LOINC and code not in _DISPLAY_FIRST_CODES:
        return _NHI_TO_LOINC[code]

    combined = (code + " " + display).lower()

    # B1. Panel-specific keyword map runs BEFORE the global one so
    # that urinalysis 'protein' (06013C) gets the urine-specimen LOINC
    # instead of the global serum default. Same match semantics as
    # _LOINC_MAP (leading word boundary for ASCII, substring for CJK).
    if code in _PANEL_LOINC_MAP:
        for key, loinc in _PANEL_LOINC_MAP[code].items():
            if all(c.isascii() for c in key):
                if re.search(rf"\b{re.escape(key.lower())}", combined):
                    return loinc
            else:
                if key.lower() in combined:
                    return loinc

    # B. Display-keyword search (handles panel-item rows + unknown codes).
    for key, loinc in _LOINC_MAP.items():
        # Word-boundary on the leading side prevents "AST" inside
        # "Diastolic" from matching. No trailing boundary so "saturat"
        # still hits "Saturation" and "hba1c" still hits "HbA1c%".
        is_ascii_key = all(c.isascii() for c in key)
        if is_ascii_key:
            if re.search(rf"\b{re.escape(key.lower())}", combined):
                return loinc
        else:
            if key.lower() in combined:
                return loinc

    # C. Panel code with no recognised item display — fall back to the
    # panel-level LOINC so the row is still coded (not coded > unmatched).
    if code and code in _NHI_TO_LOINC:
        return _NHI_TO_LOINC[code]
    return None


# NHI 醫令代碼 (健保署訂定) follows a tight format: 4-6 digits + a
# single trailing letter (usually C for clinical, e.g. 09006C HbA1c,
# 08011C CBC, 13007C 細菌培養鑑定檢查). Same panel = same code at every
# 院所 nationwide — that's the whole point of 健保 billing codes and
# the basis for our cross-hospital dedup story.
_NHI_LAB_CODE_RE = re.compile(r"^\d{4,6}[A-Z]$")


def _build_codings(code: str | None, display: str, loinc: str | None) -> list[dict]:
    """Build the Observation.code.coding[] list.

    Priority order (FHIR clients should prefer earlier codings):
      1. LOINC — interoperable across systems, when we recognise it.
      2. NHI 醫令代碼 (canonical URL system) — when the code format
         matches \\d{4,6}[A-Z], it's the 健保 standard code and
         cross-hospital consistent.
      3. Local HIS fallback — for non-NHI HIS data where the code is
         an院內碼.

    LOINC coding gets the canonical English name from _LOINC_DISPLAY
    when known. This protects downstream SMART apps from confusing
    bilingual NHI labels — e.g. 'PH 尿酸鹼度' (urine pH, NHI's text)
    is correctly LOINC 5803-2 and the consumer sees 'pH of Urine'
    in coding[0].display even if their UI does naive substring
    matching on Chinese ('尿酸' inside '尿酸鹼度' is not Uric Acid).
    The original NHI text is preserved in code.text and on the NHI
    coding, so traceability isn't lost.
    """
    codings: list[dict] = []
    if loinc:
        codings.append(
            {
                "system": "http://loinc.org",
                "code": loinc,
                "display": _LOINC_DISPLAY.get(loinc, display),
            }
        )
    code_str = (code or "").strip()
    if code_str and _NHI_LAB_CODE_RE.match(code_str):
        codings.append(
            {
                "system": systems.NHI_MEDICAL_ORDER_CODE,
                "code": code_str,
                "display": display,
            }
        )
    else:
        codings.append(
            {
                "system": systems.HIS_LOCAL_LAB_CODE,
                "code": code_str or display,
                "display": display,
            }
        )
    return codings


_INTERP_SYS = "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation"


def _interp_coding(code: str, display: str) -> dict:
    return {"system": _INTERP_SYS, "code": code, "display": display}


def _map_interpretation(interp: str) -> dict | None:
    """Map an explicit interpretation hint (already a known label) to a
    v3-ObservationInterpretation coding. Returns None for unknown / empty.
    """
    table = {
        "high": ("H", "High"),
        "low": ("L", "Low"),
        "normal": ("N", "Normal"),
        "critical": ("AA", "Critical abnormal"),
        "abnormal": ("A", "Abnormal"),
        "positive": ("POS", "Positive"),
        "negative": ("NEG", "Negative"),
    }
    entry = table.get((interp or "").lower())
    if not entry:
        return None
    return _interp_coding(*entry)


# ── Qualitative value / ref detection ─────────────────────────────────
# NHI lab API gives us the value as plain text and the reference range as
# something like "[Negative]" for qualitative tests. With no upstream
# interpretation we need to recognise these and mark abnormal results so
# the SMART app's filters work without per-row hardcoding.
#
# Positive markers — anything that means "this is detected / abnormal":
#   "positive", "reactive", "detected", or a count with "+" (Trace, 1+,
#   ... 4+, ++, +++, +-). Most NHI urinalysis 異常 looks like "4+ (2000)".
_POS_MARKERS = re.compile(
    r"(?ix)^\s*(?:"
    r"  positive|pos|reactive|detected|abnormal|present"
    r"  |trace"
    r"  |[1-4]?\s*\+(?:\s*[\+\-])*"  # +, ++, +++, 4+, +/-
    r")\s*(?:\(.*\))?\s*$"
)
# Negative markers — anything explicitly normal/absent.
_NEG_MARKERS = re.compile(
    r"(?ix)^\s*(?:"
    r"  negative|neg|nonreactive|non[-\s]?reactive"
    r"  |not[-\s]?detected|nd|absent|none|normal"
    r"  |0|[-—–]+"
    r")\s*(?:\(.*\))?\s*$"
)


def _classify_qualitative(text: str) -> str | None:
    """Return 'pos' / 'neg' / None for a qualitative value or ref string.

    Strips NHI's surrounding `[...]` brackets so e.g. "[Negative]"
    matches the same as bare "Negative".
    """
    if text is None:
        return None
    s = str(text).strip()
    # Peel one matching pair of [] (NHI's reference-range wrapper).
    if s.startswith("[") and s.endswith("]"):
        s = s[1:-1].strip()
    if not s:
        return None
    if _NEG_MARKERS.match(s):
        return "neg"
    if _POS_MARKERS.match(s):
        return "pos"
    return None


def _derive_interpretation(value_raw: str, qty: dict | None, rr: dict | None) -> dict | None:
    """Pick an interpretation coding when the source didn't supply one.

    Priority:
      1. Numeric value + structured referenceRange.low/high → H / L / N
      2. Qualitative value + qualitative reference → POS / NEG / A / N
      3. Otherwise None (let downstream stay quiet rather than guess).
    """
    # ── 1. Numeric path ────────────────────────────────────────────
    if qty is not None and isinstance(qty.get("value"), (int, float)) and rr is not None:
        v = qty["value"]
        lo = (rr.get("low") or {}).get("value")
        hi = (rr.get("high") or {}).get("value")
        if isinstance(hi, (int, float)) and v > hi:
            return _interp_coding("H", "High")
        if isinstance(lo, (int, float)) and v < lo:
            return _interp_coding("L", "Low")
        if isinstance(lo, (int, float)) or isinstance(hi, (int, float)):
            return _interp_coding("N", "Normal")
        return None

    # ── 2. Qualitative path ────────────────────────────────────────
    val_kind = _classify_qualitative(value_raw)
    ref_text = (rr or {}).get("text") or ""
    ref_kind = _classify_qualitative(ref_text)
    if val_kind is None:
        return None
    if ref_kind == "neg":
        if val_kind == "pos":
            return _interp_coding("A", "Abnormal")  # POS when ref says NEG = abnormal
        if val_kind == "neg":
            return _interp_coding("N", "Normal")
    # Standalone qualitative value, no qualitative ref — still record
    # POS/NEG so downstream can show ⊕/⊖ glyphs even without flagging
    # normal/abnormal.
    return (
        _interp_coding("POS", "Positive")
        if val_kind == "pos"
        else _interp_coding("NEG", "Negative")
    )


def _stable_id(patient_id: str, *parts: str) -> str:
    key = "|".join([patient_id, *parts])
    return hashlib.sha1(key.encode()).hexdigest()[:32]


# ── Canonical lab key (cross-page dedup) ─────────────────────────────────────
#
# Same lab item appears on multiple NHI pages — e.g. HbA1c is on the 血糖
# page (IHKE3406S01) AND on 其他檢驗 (IHKE3409S01) — and each page produces
# a separate /sync/upload-html POST with its own LLM extraction that may
# label it differently ("醣化血紅素" vs "HbA1c" vs "A1C (HbA1C)"). Without
# a canonical key, each variant gets its own stable_id and we end up with
# multiple FHIR resources for one measurement.
#
# Strategy: map common synonyms to a single canonical token. If a display
# name matches a known synonym (substring match, case-insensitive), use
# the canonical token; otherwise extract the longest English fragment;
# otherwise fall back to the display string.
#
# This list grows as we encounter more dup cases — adding a synonym is
# safer than algorithmic guessing.

_LAB_SYNONYMS: dict[str, str] = {
    # Each key is matched (case-insensitive substring) against display.
    # Ordering matters: longer / more specific keys first.
    # ── Diabetes ────────────────────────────────────────────
    "醣化血紅素": "HBA1C",
    "糖化血色素": "HBA1C",
    "糖化血紅素": "HBA1C",
    "GLYCATED HEMOGLOBIN": "HBA1C",
    "HBA1C": "HBA1C",
    "HBA1c": "HBA1C",
    "HbA1C": "HBA1C",
    "HbA1c": "HBA1C",
    "A1C": "HBA1C",
    "A1c": "HBA1C",
    "空腹血糖": "GLUCOSE_FASTING",
    "FASTING GLUCOSE": "GLUCOSE_FASTING",
    "葡萄糖": "GLUCOSE",
    "血糖": "GLUCOSE",
    "GLUCOSE": "GLUCOSE",
    # ── CBC ─────────────────────────────────────────────────
    "白血球計數": "WBC",
    "白血球": "WBC",
    "WBC": "WBC",
    "紅血球計數": "RBC",
    "紅血球": "RBC",
    "RBC": "RBC",
    "血紅素": "HEMOGLOBIN",
    "HEMOGLOBIN": "HEMOGLOBIN",
    "HGB": "HEMOGLOBIN",
    "血容積比": "HEMATOCRIT",
    "HEMATOCRIT": "HEMATOCRIT",
    "HCT": "HEMATOCRIT",
    "血小板": "PLATELET",
    "PLATELET": "PLATELET",
    "PLT": "PLATELET",
    # CRITICAL: full CJK forms MUST precede the bare 3-char 紅血球
    # synonym above. NHI's assaY_ITEM_NAME for MCH = '平均紅血球血色素'
    # contains '紅血球' as a substring — without these explicit
    # long-form entries, sorted-by-length iteration (stable on
    # ties) picks 紅血球 first and the row mis-canonicalises to
    # RBC, collapsing the stable_id with the actual RBC count
    # Observation.
    "平均紅血球血色素濃度": "MCHC",  # 10 chars — must beat MCH's 7-char form
    "平均紅血球血色素": "MCH",
    "平均紅血球濃度": "MCHC",
    "平均紅血球體積": "MCV",
    "紅血球分布寬度": "RDW",
    "MCV": "MCV",
    "MCH": "MCH",  # Mean Corpuscular Hemoglobin
    "MCHC": "MCHC",  # Concentration — distinct from MCH
    "RDW": "RDW",
    # CBC differential — every variant must exist as its own synonym
    # so the row doesn't collapse to the bare '白血球' (WBC) key.
    # NHI / Taiwan labs use multiple Chinese spellings for the same
    # cell type (e.g. 嗜酸性白血球 vs 嗜伊紅性白血球, both Eosinophil);
    # without explicit entries, '白血球' substring-matches and the
    # Observation upserts under the WBC stable_id, overwriting the
    # actual WBC count for that visit.
    "嗜中性白血球": "NEUTROPHIL",
    "嗜伊紅性白血球": "EOSINOPHIL",
    "嗜酸性白血球": "EOSINOPHIL",  # Taiwan variant — same cell as 嗜伊紅性
    "嗜鹼性白血球": "BASOPHIL",
    "淋巴球": "LYMPHOCYTE",
    "單核球": "MONOCYTE",
    "EOSINOPHILS": "EOSINOPHIL",
    "EOSINOPHIL": "EOSINOPHIL",
    "NEUTROPHILS": "NEUTROPHIL",
    "NEUTROPHIL": "NEUTROPHIL",
    "BASOPHILS": "BASOPHIL",
    "BASOPHIL": "BASOPHIL",
    "LYMPHOCYTES": "LYMPHOCYTE",
    "LYMPHOCYTE": "LYMPHOCYTE",
    "MONOCYTES": "MONOCYTE",
    "MONOCYTE": "MONOCYTE",
    # ── Lipid ───────────────────────────────────────────────
    # Keep abbreviations ≥ 4 chars only. "TC" / "TG" / "UA" are too
    # short and false-match longer lab names ("TCO2", "Urine UA"…).
    #
    # CRITICAL ORDERING: 'LDL CHOLESTEROL' / 'HDL CHOLESTEROL' (15 chars
    # ASCII) and the CJK '低密度膽固醇' / '高密度膽固醇' (6 chars CJK)
    # MUST exist as their own synonym entries so the longest-key-first
    # iteration picks them up BEFORE the bare 11-char 'CHOLESTEROL' key
    # below. Without this, 'LDL CHOLESTEROL 低密度膽固醇' substring-matches
    # 'CHOLESTEROL' and collapses to TOTAL_CHOLESTEROL — a clinically
    # different test with a different LOINC (2093-3 total vs 13457-7
    # LDL calculated). Found in production data: 3 distinct LDL displays
    # were silently turning into Total Cholesterol Observations.
    "LDL CHOLESTEROL": "LDL_C",
    "LDL-CHOLESTEROL": "LDL_C",
    "HDL CHOLESTEROL": "HDL_C",
    "HDL-CHOLESTEROL": "HDL_C",
    "低密度膽固醇": "LDL_C",
    "高密度膽固醇": "HDL_C",
    "低密度脂蛋白膽固醇": "LDL_C",
    "高密度脂蛋白膽固醇": "HDL_C",
    # ── Total cholesterol ───────────────────────────────────
    "血清總膽固醇": "TOTAL_CHOLESTEROL",
    "總膽固醇": "TOTAL_CHOLESTEROL",
    "T-CHOLESTEROL": "TOTAL_CHOLESTEROL",
    "T-CHOL": "TOTAL_CHOLESTEROL",
    "TOTAL CHOLESTEROL": "TOTAL_CHOLESTEROL",
    "CHOLESTEROL": "TOTAL_CHOLESTEROL",
    "CHOL": "TOTAL_CHOLESTEROL",
    # ── Triglyceride ────────────────────────────────────────
    "三酸甘油酯": "TRIGLYCERIDE",
    "TRIGLYCERIDE": "TRIGLYCERIDE",
    # ── HDL / LDL short forms ───────────────────────────────
    "HDL-C": "HDL_C",
    "HDL": "HDL_C",
    "高密度脂蛋白": "HDL_C",
    "LDL-C(DIRECT)": "LDL_C",
    "LDL-C": "LDL_C",
    "LDL": "LDL_C",
    "低密度脂蛋白": "LDL_C",
    # ── Renal ───────────────────────────────────────────────
    # ── Urine creatinine variants — MUST exist so 'U-CRE 尿液肌酸酐'
    # and 'Creatinine(U)' don't substring-match 肌酸酐/CREATININE
    # and collapse with serum Cr (different LOINC: 2161-8 vs 2160-0).
    # synonym dict iterated longest-key-first, so these win over the
    # 3-char '肌酸酐' / 10-char 'CREATININE' below.
    "尿液肌酸酐": "URINE_CREATININE",
    "URINE CREATININE": "URINE_CREATININE",
    "CREATININE(U)": "URINE_CREATININE",
    "CREATININE-U": "URINE_CREATININE",
    "CREA(U)": "URINE_CREATININE",
    "CREA-U": "URINE_CREATININE",
    "U-CRE": "URINE_CREATININE",
    "U-CREA": "URINE_CREATININE",
    # ── Serum/plasma creatinine ──────────────────────────
    "肌酸酐": "CREATININE",
    "肌酐酸": "CREATININE",  # Taiwan variant spelling
    "CREATININE(B)": "CREATININE",  # explicit serum marker
    "CREATININE": "CREATININE",
    "CREA": "CREATININE",
    "CRTN": "CREATININE",
    "EGFR": "EGFR",
    "尿素氮": "BUN",
    "BUN": "BUN",
    # CRITICAL: longer-prefix synonyms must come BEFORE '尿酸' so the
    # CJK substring-match path (canonical_lab_key uses `key in display`
    # for CJK keys without word boundaries — Chinese has no whitespace)
    # doesn't collapse '尿酸鹼度' (urine pH) → URIC_ACID. The dict is
    # iterated sorted-by-length-desc so the order here is reference
    # only, but keeping them adjacent in the source helps future
    # readers see the relationship.
    "尿酸鹼度": "URINE_PH",  # urine acidity = pH (NOT uric acid)
    "尿液酸鹼度": "URINE_PH",
    "酸鹼度": "PH",  # generic pH (urine or blood — disambiguated by specimen)
    "尿酸": "URIC_ACID",  # serum uric acid (2-char compound)
    "URIC ACID": "URIC_ACID",
    "URIC_ACID": "URIC_ACID",
    # ── Liver ───────────────────────────────────────────────
    "AST": "AST",
    "ALT": "ALT",
    "GOT": "AST",  # GOT = AST (older naming)
    "GPT": "ALT",  # GPT = ALT (older naming)
    "膽紅素": "BILIRUBIN",
    "BILIRUBIN": "BILIRUBIN",
    "白蛋白": "ALBUMIN",
    "ALBUMIN": "ALBUMIN",
    # ── Cardiac ─────────────────────────────────────────────
    "心肌旋轉蛋白": "TROPONIN",
    "TROPONIN": "TROPONIN",
    "BNP": "BNP",
    "心臟": "TROPONIN",
    # ── Thyroid ─────────────────────────────────────────────
    "甲狀腺刺激素": "TSH",
    "TSH": "TSH",
    "游離甲狀腺素": "FREE_T4",
    "FREE T4": "FREE_T4",
    "FT4": "FREE_T4",
    # ── Misc common ─────────────────────────────────────────
    "C反應性蛋白": "CRP",
    "C-REACTIVE PROTEIN": "CRP",
    "CRP": "CRP",
    "HS-CRP": "HS_CRP",
    "攝護腺特異抗原": "PSA",
    "PSA": "PSA",
    "鐵蛋白": "FERRITIN",
    "FERRITIN": "FERRITIN",
    "葉酸": "FOLATE",
    "FOLATE": "FOLATE",
    "維生素B12": "VITAMIN_B12",
    "VIT B12": "VITAMIN_B12",
    "VITAMIN B12": "VITAMIN_B12",
    "皮質素": "CORTISOL",
    "CORTISOL": "CORTISOL",
    "梅毒": "RPR",
    "RPR": "RPR",
    "隱球菌抗原": "CRYPTOCOCCAL_AG",
    "CRYPAG": "CRYPTOCOCCAL_AG",
    "血氨": "AMMONIA",
    "AMMONIA": "AMMONIA",
    "凝血酶原時間": "PT",
    "APTT": "APTT",
    "INR": "INR",
}


def canonical_lab_key(display: str | None) -> str:
    """Map a lab display name to a canonical token used in stable IDs.

    Order:
    1. Exact / substring match against _LAB_SYNONYMS (case-insensitive).
       Longer keys first so "HBA1C" matches before "A1C".
    2. Fallback: the full display, lowercased + whitespace-collapsed.

    Why no "longest English chunk" fallback: lab names often have the
    pattern "<antibiotic> (<organism>)" e.g. "Flomoxef (Escherichia coli)"
    — different antibiotics with the same organism are SEPARATE tests, not
    duplicates. Picking the longer English chunk would collapse them all
    to "ESCHERICHIA COLI" and silently destroy data. The synonym map
    handles known equivalences (e.g. 醣化血紅素 ↔ HbA1c); for everything
    else, treating the full display as the canonical preserves identity.
    """
    if not display:
        return ""
    s = display.strip()
    if not s:
        return ""
    s_upper = s.upper()
    # Try synonyms (longer keys first to prefer more-specific matches).
    # CRITICAL: use word-boundary matching for ASCII tokens — otherwise
    # short codes like "AST" false-match inside "DIASTOLIC Blood Pressure"
    # (the IAST sub-string), collapsing two clinically distinct measures
    # to one stable id. CJK keys don't need word boundaries — Chinese
    # has no whitespace and the strings used here are highly specific.
    for key in sorted(_LAB_SYNONYMS, key=len, reverse=True):
        ku = key.upper()
        # Anchor word-boundary on the LEADING side only — prevents
        # "AST" matching inside "DIASTOLIC", but still lets "HBA1C"
        # match "HBA1C%" or "saturat" match "Saturation".
        is_ascii_key = all(c.isascii() for c in ku)
        if is_ascii_key:
            if re.search(rf"\b{re.escape(ku)}", s_upper):
                return _LAB_SYNONYMS[key]
        else:
            if ku in s_upper:
                return _LAB_SYNONYMS[key]
    # Fallback: full display normalized
    return re.sub(r"\s+", " ", s.lower()).strip()


# ── Panel grouping (NHI 健康存摺) ─────────────────────────────────────────────


def _cjk_chars(s: str) -> int:
    return sum(1 for c in s if "一" <= c <= "鿿")


def _is_english_dominant(s: str) -> bool:
    latin = sum(1 for c in s if c.isascii() and c.isalpha())
    return latin >= 2 and _cjk_chars(s) == 0


def _normalize_value_for_dedup(v) -> str:
    """Normalize a result string so A/B language pairs collide on the same key.

    Strips whitespace, lowercases, removes parenthetical content like "(2000)"
    and trailing units that NHI sometimes includes inline.
    """
    s = str(v or "").strip().lower()
    s = re.sub(r"\([^)]*\)", "", s).strip()
    s = re.sub(r"\s+", " ", s)
    return s


def _dedupe_panel_items(items: list[dict]) -> list[dict]:
    """Collapse A/B (中英雙語) duplicates within one panel group.

    NHI 健康存摺 often reports the same urinalysis / CBC twice — once with
    Chinese item names (資料來源 B), once with English (資料來源 A) — same
    values. Group by normalized value; if a value-group contains both a
    CJK-named item and an English-named item, keep only the English one
    (clinicians read labs in English abbreviations: ALT, HbA1c, WBC).
    Otherwise keep all (don't risk false dedup on coincidental same values).
    """
    by_value: OrderedDict[str, list[dict]] = OrderedDict()
    for it in items:
        by_value.setdefault(_normalize_value_for_dedup(it.get("value")), []).append(it)

    out: list[dict] = []
    for group in by_value.values():
        if len(group) == 1:
            out.append(group[0])
            continue
        cjk_items = [g for g in group if _cjk_chars(str(g.get("display", ""))) >= 2]
        en_items = [g for g in group if _is_english_dominant(str(g.get("display", "")))]
        if cjk_items and en_items:
            out.append(en_items[0])  # prefer English display (clinical convention)
        else:
            out.extend(group)
    return out


def map_observations_grouped(raw_items: list[dict], patient_id: str) -> list[dict]:
    """Convert a list of NHI lab rows → grouped DR + Observation list.

    Groups by NHI 醫令代碼 (medical order code) → each group becomes one
    DiagnosticReport with N child Observations. Rows without an order_code
    fall back to one-item panels keyed by display name + date.
    """
    cleaned = _filter_lab_rows(raw_items)
    return _group_by_order_code(cleaned, patient_id)


def _filter_lab_rows(raw_items: list[dict]) -> list[dict]:
    out: list[dict] = []
    for raw in raw_items:
        if not isinstance(raw, dict):
            continue
        display = raw.get("display") or raw.get("code") or ""
        if _looks_like_imaging(display, raw.get("code") or ""):
            continue
        value = raw.get("value")
        interp = (raw.get("interpretation") or "").lower()
        has_value = value is not None and str(value).strip() not in ("", "—", "-", "N/A", "null")
        has_meaningful_interp = interp in (
            "normal",
            "abnormal",
            "high",
            "low",
            "critical",
            "positive",
            "negative",
        )
        if not has_value and not has_meaningful_interp:
            continue
        out.append(raw)
    return out


def _dedupe_cross_format(items: list[dict]) -> list[dict]:
    """Collapse rows that are the same lab item in different language formats.

    Same observation often appears 2-3 times within one NHI page — the LLM
    extracts it under the Chinese name (醣化血紅素), the English name (HbA1c),
    and sometimes a 中文 (English) combined name — each row sometimes carries
    a different `order_code` so the panel-level grouping by order_code can't
    merge them.

    Heuristic: rows with the SAME (date, value, unit) within a single
    extraction batch are almost certainly the same lab in different format.
    Within a real panel (CBC, lipid …) different items have different values,
    so collisions are rare. When a collision happens we keep the row with
    the FEWEST CJK characters in display — clinicians read labs in English
    abbreviations (ALT, HbA1c, WBC) and the verbose Chinese names (血清麩
    胺酸丙酮酸轉氨基脢) are unhelpful. We still inherit any non-empty
    fields from the dropped row (order_code, hospital) so panel context
    isn't lost.
    """

    # IMPORTANT: include order_code in the key so we never merge across
    # different NHI 醫令代碼. Real example caught in production: on the
    # same day 長庚嘉義 uploaded BOTH a 09005C (空腹血糖) AC reading and a
    # 09140C (餐後血糖) PC reading with coincidentally identical value
    # 124 mg/dL. Without this guard the dedup folds them into one row
    # and the (now-wrong) order_code surfaces in the FHIR resource.
    # The 雙語複製 case we still want to merge is "same item, same panel,
    # 2-3 transliterations" — same order_code by definition. Empty
    # order_code (LLM-extracted rows with no panel info) is treated as a
    # wildcard so the original behaviour still works for non-NHI hosts.
    def _ocode(it: dict) -> str:
        return (it.get("order_code") or "").strip().upper()

    by_key: OrderedDict[tuple, dict] = OrderedDict()
    for idx, item in enumerate(items):
        v = str(item.get("value", "")).strip()
        unit = (item.get("unit") or "").strip()
        if not v:
            # No value to compare — keep the row, don't dedup.
            by_key[("__no_dedup__", idx)] = item
            continue
        key = (item.get("date", ""), v.lower(), unit.lower(), _ocode(item))
        existing = by_key.get(key)
        if existing is None:
            by_key[key] = item
            continue
        # Choose which row to keep — prefer English (fewer CJK) for labs.
        if _cjk_chars(item.get("display", "")) < _cjk_chars(existing.get("display", "")):
            primary, secondary = item, existing
        else:
            primary, secondary = existing, item
        merged = dict(primary)
        # Inherit order_code/order_name/hospital from secondary if primary
        # is missing them (likely the panel-context row got dropped).
        for f in ("order_code", "order_name", "hospital", "code"):
            if not merged.get(f) and secondary.get(f):
                merged[f] = secondary[f]
        by_key[key] = merged
    return list(by_key.values())


def _combine_bp_items(items: list[dict]) -> list[dict]:
    """Combine separate SBP+DBP raw items into one FHIR-standard BP item.

    FHIR R4 convention (LOINC 85354-9 Blood pressure panel):
      - ONE Observation with category=vital-signs
      - component[0] = systolic   (LOINC 8480-6)
      - component[1] = diastolic  (LOINC 8462-4)
      - no parent valueQuantity, no DR wrapper

    NHI's 成人預防保健 endpoint reports SBP and DBP as separate fields,
    so the extension adapter emits two items. We merge them here by
    (date, hospital). If only one side exists (rare) we still wrap it
    as a single-component BP Observation rather than a bare reading.
    """
    by_key: dict[tuple[str, str], dict[str, dict]] = {}
    pass_through: list[dict] = []
    for it in items:
        disp = (it.get("display") or "").lower()
        key = (it.get("date", ""), it.get("hospital", ""))
        if "systolic blood pressure" in disp:
            by_key.setdefault(key, {})["systolic"] = it
        elif "diastolic blood pressure" in disp:
            by_key.setdefault(key, {})["diastolic"] = it
        else:
            pass_through.append(it)

    for _key, parts in by_key.items():
        s, d = parts.get("systolic"), parts.get("diastolic")
        primary = s or d  # at least one is non-None
        if primary is None:
            continue
        components: list[dict] = []
        if s and s.get("value") not in (None, "", "-", "—"):
            try:
                components.append(
                    {
                        "loinc": "8480-6",
                        "display": "Systolic blood pressure",
                        "value": float(str(s["value"]).replace(",", "")),
                        "unit": s.get("unit") or "mmHg",
                        "interpretation_text": s.get("reference_range") or "",
                    }
                )
            except (ValueError, TypeError):
                pass
        if d and d.get("value") not in (None, "", "-", "—"):
            try:
                components.append(
                    {
                        "loinc": "8462-4",
                        "display": "Diastolic blood pressure",
                        "value": float(str(d["value"]).replace(",", "")),
                        "unit": d.get("unit") or "mmHg",
                        "interpretation_text": d.get("reference_range") or "",
                    }
                )
            except (ValueError, TypeError):
                pass
        if not components:
            continue
        combined = dict(primary)
        # Make the composite item identifiable to downstream code: it
        # has its own LOINC panel code, no scalar value, components[].
        combined["display"] = "Blood Pressure"
        combined["code"] = ""  # NHI doesn't have a BP-panel order_code
        combined["order_code"] = ""
        combined["order_name"] = "Blood Pressure"
        combined["category"] = "vital-signs"
        combined["bp_components"] = components
        combined["bp_panel_loinc"] = "85354-9"
        combined.pop("value", None)
        combined.pop("unit", None)
        pass_through.append(combined)
    return pass_through


def _group_by_order_code(cleaned: list[dict], patient_id: str) -> list[dict]:
    """Group by (order_code, date, hospital) → DR + Observations.

    Pre-pass: cross-format dedup so the same lab in 中/英 doesn't end up
    in two separate panels.

    A/B 雙語 dedup applied within each group. Uses NHI 醫令代碼 as the
    canonical panel id. Items without an order_code each get their own
    single-item DR keyed by display+date.
    """
    cleaned = _dedupe_cross_format(cleaned)
    # Merge separate SBP+DBP into FHIR-spec BP panel Observations with
    # component[]. Must run AFTER dedup so we see only one of each.
    cleaned = _combine_bp_items(cleaned)

    groups: OrderedDict[tuple, list[dict]] = OrderedDict()
    for raw in cleaned:
        key = (
            raw.get("order_code") or raw.get("code") or raw.get("display", ""),
            raw.get("date", ""),
            raw.get("hospital", ""),
        )
        groups.setdefault(key, []).append(raw)

    out: list[dict] = []
    for (group_key_code, date, hospital), items in groups.items():
        items = _dedupe_panel_items(items)

        # Build per-item Observations. Multiple raw items can collapse to
        # the same stable Observation id (same canonical lab + date +
        # hospital) — e.g. when an inpatient lab is uploaded multiple
        # times during a stay or when upstream dedup let near-identical
        # rows through. Upsert handles the storage side, but we must
        # also dedup `obs_resources` here so the parent DR.result array
        # doesn't end up with N copies of the same reference.
        obs_resources: list[dict] = []
        seen_obs_ids: set[str] = set()
        for it in items:
            obs = _build_observation(it, patient_id, group_key_code)
            if obs is None:
                continue
            if obs["id"] in seen_obs_ids:
                continue
            seen_obs_ids.add(obs["id"])
            obs_resources.append(obs)
        if not obs_resources:
            continue

        # BP panel Observations are a single, self-contained vital-signs
        # resource per FHIR R4 spec — they don't get a DR wrapper. Emit
        # the Observation directly and skip the DR-build path.
        is_bp_panel = all(
            (it.get("bp_components") or it.get("display") == "Blood Pressure") for it in items
        )
        if is_bp_panel:
            out.extend(obs_resources)
            continue

        # Build the parent DiagnosticReport
        order_name = next(
            (it.get("order_name") for it in items if it.get("order_name")),
            None,
        )
        # Stable id uses the SET of canonical lab keys among the panel's
        # members (sorted), so the "same panel content on same date+hospital"
        # produces the same DR id regardless of which NHI page it came from
        # or how the LLM happened to label the panel itself.
        member_keys = sorted(
            {canonical_lab_key(it.get("display", "")) for it in items if it.get("display")}
        )
        panel_signature = ",".join(member_keys) or str(group_key_code)
        dr_id = _stable_id(patient_id, "DR", panel_signature, date, hospital)

        # Choose panel title (DR.code.text + display).
        # NHI's 醫囑名稱 is often the verbose Chinese form (血清麩胺酸丙酮酸
        # 轉氨基脢) while the actual item's display is the English abbreviation
        # clinicians prefer (ALT). When the panel has only ONE item, the item
        # display is more clinically readable than the order_name. For
        # multi-item panels (CBC, lipid panel) the order_name describes the
        # panel as a whole and is more informative.
        if len(items) == 1:
            single_display = items[0].get("display") or ""
            panel_title = single_display or order_name or str(group_key_code)
        else:
            panel_title = order_name or str(group_key_code)

        dr = {
            "resourceType": "DiagnosticReport",
            "id": dr_id,
            "meta": {"versionId": "1", "source": "nhi-fhir-bridge/scraper"},
            "status": "final",
            "category": [
                {
                    "coding": [
                        {
                            "system": "http://terminology.hl7.org/CodeSystem/v2-0074",
                            "code": "LAB",
                            "display": "Laboratory",
                        }
                    ],
                }
            ],
            "code": {
                "coding": [
                    {
                        # Panel-level NHI 醫令代碼 — same canonical CodeSystem
                        # as the individual lab items use for their NHI coding.
                        "system": (
                            systems.NHI_MEDICAL_ORDER_CODE
                            if _NHI_LAB_CODE_RE.match(str(group_key_code) or "")
                            else systems.HIS_LOCAL_LAB_CODE
                        ),
                        "code": str(group_key_code) or "UNKNOWN",
                        "display": panel_title,
                    }
                ],
                "text": panel_title,
            },
            "subject": {"reference": f"Patient/{patient_id}"},
            "result": [{"reference": f"Observation/{o['id']}"} for o in obs_resources],
        }
        if date:
            dr["effectiveDateTime"] = date + "T00:00:00+08:00"
        if hospital:
            dr["performer"] = [{"display": hospital}]

        out.append(dr)
        out.extend(obs_resources)

    return out


# Specimen inference from order/test names. NHI's lab API doesn't expose a
# dedicated specimen field, but the order_name almost always encodes it —
# e.g. "尿生化檢查（包括蛋白、糖、…）" → Urine. We pattern-match on Chinese
# AND English so this also helps non-NHI hosts. Returned display goes into
# Observation.specimen.display (FHIR Reference allows display-only when
# we don't have a Specimen resource to point at).
_SPECIMEN_RULES: list[tuple[str, str]] = [
    # urine first because 尿 is a very specific Chinese radical
    (r"尿|urine|urinaly", "Urine"),
    (r"糞|便潛血|stool|fecal|faecal|occult\s*blood", "Stool"),
    (r"痰|sputum", "Sputum"),
    (r"腦脊液|csf|cerebrospinal", "Cerebrospinal fluid"),
    (r"胸水|pleural", "Pleural fluid"),
    (r"腹水|ascites|peritoneal", "Peritoneal fluid"),
    (r"陰道|抹片|cervical|pap\s*smear|vaginal", "Cervical/Vaginal"),
    (r"關節液|synovial|joint\s*fluid", "Synovial fluid"),
    (r"羊水|amniotic", "Amniotic fluid"),
    (r"骨髓|bone\s*marrow", "Bone marrow"),
]


def _infer_specimen(*hints: str | None) -> str | None:
    """Return the FHIR-friendly specimen display for the first matching hint.

    Pass any number of strings that might mention the specimen (order_name,
    display, code). Most NHI rows only specify it on the panel-level
    order_name, so check that first when calling. Returns None when no
    rule matches — caller should leave Observation.specimen unset
    (clients can default-assume blood, but we don't claim that here).
    """
    blob = " ".join(h for h in hints if h).lower()
    if not blob:
        return None
    for pattern, label in _SPECIMEN_RULES:
        if re.search(pattern, blob, re.IGNORECASE):
            return label
    return None


def _build_observation(raw: dict, patient_id: str, panel_code: str) -> dict | None:
    """Build a single Observation.

    Stable id uses the canonical lab key (HBA1C, WBC, …) instead of the
    raw display so the same lab arriving from different NHI pages
    (with different labels like "醣化血紅素" vs "HbA1c" vs "A1C (HbA1C)")
    collapses to one Observation across all syncs.
    """
    # ── Blood Pressure: FHIR-standard panel with component[] ────────
    # raw arrives from _combine_bp_items with bp_components prebuilt.
    # Per FHIR R4 spec (LOINC 85354-9), BP is a single Observation —
    # NEVER two separate Observations for systolic/diastolic.
    if raw.get("bp_components"):
        date = raw.get("date", "")
        hospital = raw.get("hospital", "")
        obs_id = _stable_id(patient_id, "obs", "BP_PANEL", date, hospital)
        component_resources = []
        for c in raw["bp_components"]:
            # FHIR BP profile fixes Quantity.code to UCUM 'mm[Hg]'
            # (bracket form). The raw NHI unit 'mmHg' is allowed in
            # the human-readable Quantity.unit field but NOT as the
            # machine code, so we run it through _to_ucum.
            qty: dict = {
                "value": c["value"],
                "unit": c["unit"] or "mmHg",
                "system": "http://unitsofmeasure.org",
                "code": _to_ucum(c["unit"]) or "mm[Hg]",
            }
            entry = {
                "code": {
                    "coding": [
                        {
                            "system": "http://loinc.org",
                            "code": c["loinc"],
                            "display": c["display"],
                        }
                    ],
                    "text": c["display"],
                },
                "valueQuantity": qty,
            }
            component_resources.append(entry)
        bp_obs: dict = {
            "resourceType": "Observation",
            "id": obs_id,
            "meta": {"versionId": "1", "source": "nhi-fhir-bridge/scraper"},
            "status": "final",
            "category": [
                {
                    "coding": [
                        {
                            "system": "http://terminology.hl7.org/CodeSystem/observation-category",
                            "code": "vital-signs",
                            "display": "Vital Signs",
                        }
                    ],
                }
            ],
            "code": {
                "coding": [
                    {
                        "system": "http://loinc.org",
                        "code": raw.get("bp_panel_loinc") or "85354-9",
                        "display": "Blood pressure panel",
                    }
                ],
                "text": "Blood Pressure",
            },
            "subject": {"reference": f"Patient/{patient_id}"},
            "component": component_resources,
        }
        if date:
            bp_obs["effectiveDateTime"] = date + "T00:00:00+08:00"
        if hospital:
            bp_obs["performer"] = [{"display": hospital}]
        return bp_obs

    display = raw.get("display") or raw.get("code") or ""
    # NHI 醫令代碼: lives on raw.order_code (the panel-level 健保 billing code,
    # e.g. 09006C). The legacy raw.code field is actually the test display
    # name (assaY_ITEM_NAME) thanks to a misnamed extension adapter — using
    # it here is what made every Observation come out with display name in
    # the coding.code slot. Prefer panel_code (already the order_code arg
    # passed in by _group_by_order_code), fall back to raw.order_code, then
    # the legacy raw.code only as last resort.
    code = (str(panel_code) if panel_code else "") or raw.get("order_code") or raw.get("code") or ""
    value = raw.get("value")
    interp = (raw.get("interpretation") or "").lower()

    canonical = canonical_lab_key(display) or display
    obs_id = _stable_id(patient_id, "obs", canonical, raw.get("date", ""), raw.get("hospital", ""))
    loinc = _find_loinc(code, display)

    # Observation.category — defaults to "laboratory". Adapters that
    # emit non-lab observations (e.g. 成人預防保健 vitals = BMI / BP /
    # height / weight) set raw["category"] = "vital-signs" so SMART
    # apps' vitals views pick them up correctly.
    cat_code = raw.get("category", "laboratory") or "laboratory"
    cat_display = {
        "laboratory": "Laboratory",
        "vital-signs": "Vital Signs",
        "imaging": "Imaging",
        "procedure": "Procedure",
        "social-history": "Social History",
        "survey": "Survey",
        "exam": "Exam",
        "therapy": "Therapy",
        "activity": "Activity",
    }.get(cat_code, cat_code.title())

    resource: dict = {
        "resourceType": "Observation",
        "id": obs_id,
        "meta": {"versionId": "1", "source": "nhi-fhir-bridge/scraper"},
        "status": "final",
        "category": [
            {
                "coding": [
                    {
                        "system": "http://terminology.hl7.org/CodeSystem/observation-category",
                        "code": cat_code,
                        "display": cat_display,
                    }
                ],
            }
        ],
        "code": {
            "coding": _build_codings(code, display, loinc),
            "text": display or "Unknown Lab",
        },
        "subject": {"reference": f"Patient/{patient_id}"},
    }
    if raw.get("date"):
        resource["effectiveDateTime"] = raw["date"] + "T00:00:00+08:00"
    if raw.get("hospital"):
        resource["performer"] = [{"display": raw["hospital"]}]
    # NHI doesn't expose Observation.specimen directly; infer from
    # order_name (panel label) and display (test name) so e.g. "尿糖 4+"
    # appears as a urine glucose instead of tripping the SMART app's
    # "elevated blood glucose" heuristic.
    specimen = _infer_specimen(raw.get("order_name"), raw.get("display"), raw.get("code"))
    if specimen:
        resource["specimen"] = {"display": specimen}
    has_value = value is not None and str(value).strip() not in ("", "—", "-", "N/A", "null")
    if has_value:
        qty = _try_parse_quantity(str(value), raw.get("unit") or "")
        if qty is not None:
            resource["valueQuantity"] = qty
        else:
            resource["valueString"] = str(value)
    if raw.get("reference_range"):
        rrs = _parse_range_multi(str(raw["reference_range"]), raw.get("unit") or "")
        if rrs:
            resource["referenceRange"] = rrs
    # Explicit upstream hint wins (e.g. an "H" flag from a future HIS
    # that supplies one). Otherwise derive H/L/N or POS/NEG/A from the
    # value + structured reference range. For sex-stratified ranges
    # (multiple entries with appliesTo) we pick the FIRST one here as a
    # placeholder; the post-mapping linker in sync.py replaces it with
    # the gender-correct one once it knows the patient's sex.
    interp_coding = _map_interpretation(interp) or _derive_interpretation(
        str(value) if value is not None else "",
        resource.get("valueQuantity"),
        (resource.get("referenceRange") or [None])[0],
    )
    if interp_coding:
        resource["interpretation"] = [{"coding": [interp_coding]}]
    return resource

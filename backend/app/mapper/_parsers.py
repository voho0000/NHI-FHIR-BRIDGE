"""Pure parsing helpers — reference range, quantity, UCUM unit normalisation.

Self-contained: no dependencies on other observation module pieces. Functions:
    _to_ucum(unit)              → canonical UCUM unit string
    _parse_range_multi(rng, unit) → list[range entry] (handles sex-specific ranges)
    _parse_range(rng, unit)       → range entry dict
    _try_parse_quantity(val, unit) → quantity dict
"""

import re

# FHIR R4 Quantity.comparator allowed values. We normalise full-width
# CJK ＞ ＜ ≧ ≦ + ASCII variants so values like "＞ 40.0" still get
# parsed as a real number instead of falling through to valueString
# (which loses the unit).
_FULLWIDTH_OPS = str.maketrans(
    {
        "＞": ">",
        "＜": "<",
        "≧": ">=",
        "≦": "<=",
        "≥": ">=",
        "≤": "<=",
    }
)
_COMPARATOR_RE = re.compile(r"^\s*(<=|>=|<|>)\s*(.+)$")


# Reference-range parsing. NHI ships the range as plain text like
# "[3.89][26.8]", "[40][]", "[Negative]" or "AM 8:00 6.2-19.4". We pull
# out structured low/high + unit when we can, always keep the original
# text, and let _map_interpretation handle the qualitative cases.
_RR_LOWHIGH_BRACKETS = re.compile(r"^\s*\[\s*([^\]]*)\s*\]\s*\[\s*([^\]]*)\s*\]\s*$")
_RR_DASH_RANGE = re.compile(r"(-?\d+(?:\.\d+)?)\s*[-~–]\s*(-?\d+(?:\.\d+)?)")
_RR_COMPARATOR = re.compile(r"^\s*(<=|>=|<|>)\s*(-?\d+(?:\.\d+)?)\s*$")
# Sex-stratified bracketed range, e.g. "男:13.7 女:11.1" — used by some
# hospitals for haematology (Hb, RBC, Hct). Pulls out (sex, value) pairs.
_RR_SEX_NUM = re.compile(
    # "男:13.7", "男性 13.7", "M:13.7" — also tolerate an optional comparator
    # ≧/≦/>/< before the number, e.g. "男:＞40".
    r"(男性|女性|男|女|M|F)\s*[:：]?\s*(?:[<>≧≦]=?)?\s*(-?\d+(?:\.\d+)?)"
)
_SEX_TO_FHIR = {
    "男性": ("male", "Male"),
    "男": ("male", "Male"),
    "M": ("male", "Male"),
    "女性": ("female", "Female"),
    "女": ("female", "Female"),
    "F": ("female", "Female"),
}


def _parse_range_multi(raw_range: str, unit: str) -> list[dict]:
    """List variant of _parse_range: emits one entry per sex when the
    range is sex-stratified ("[男:13.7 女:11.1][男:17.0 女:15.0]"),
    otherwise a single-element list. Each entry tagged with appliesTo
    so the SMART app's Layer A can pick the right one for the patient.
    """
    s = (raw_range or "").strip().translate(_FULLWIDTH_OPS)
    if not s:
        return []

    def _q(v: float) -> dict:
        out = {"value": v}
        if unit:
            out["unit"] = unit
            out["system"] = "http://unitsofmeasure.org"
            out["code"] = unit
        return out

    # Two-bracket form: split into (low_blob, high_blob), each can carry
    # its own per-sex values ("[男:13.7 女:11.1][男:17.0 女:15.0]").
    # Single-bracket form: entire range is one-sided per sex
    # ("[男:>40 ; 女:>50]"). Comparator inside picks low vs high.
    low_by_sex: dict[str, str] = {}
    high_by_sex: dict[str, str] = {}
    used_multi = False
    m = _RR_LOWHIGH_BRACKETS.match(s)
    if m:
        low_blob, high_blob = m.group(1), m.group(2)
        low_by_sex = dict(_RR_SEX_NUM.findall(low_blob))
        high_by_sex = dict(_RR_SEX_NUM.findall(high_blob))
        used_multi = bool(low_by_sex or high_by_sex)
    else:
        # Try single-bracket form. Pull comparator info too so we know
        # whether each per-sex value is a low or high bound.
        single = re.match(r"^\s*\[\s*(.+?)\s*\]\s*$", s)
        if single:
            inner = single.group(1)
            for sex_key, val_str in _RR_SEX_NUM.findall(inner):
                # Need to look at what immediately precedes the number
                # to decide low/high. Find each per-sex segment and the
                # comparator inside it.
                pat = re.compile(rf"{re.escape(sex_key)}\s*[:：]?\s*([<>≧≦]=?)?\s*-?\d")
                cm = pat.search(inner)
                op = cm.group(1) if cm else ""
                if op in (">", ">="):
                    low_by_sex[sex_key] = val_str
                elif op in ("<", "<="):
                    high_by_sex[sex_key] = val_str
                else:
                    # No operator → assume low (normal value at least X).
                    low_by_sex[sex_key] = val_str
            used_multi = bool(low_by_sex or high_by_sex)

    if used_multi:
        entries: list[dict] = []
        # Iterate over the union of keys actually seen — earlier we
        # hardcoded the loop to ("男","女","M","F") and missed the long
        # form "男性"/"女性".
        all_sex_keys = list(dict.fromkeys(list(low_by_sex) + list(high_by_sex)))
        for sex_key in all_sex_keys:
            mapping = _SEX_TO_FHIR.get(sex_key)
            if not mapping:
                continue
            fhir_code, fhir_display = mapping
            entry: dict = {
                "text": raw_range,
                "appliesTo": [
                    {
                        "coding": [
                            {
                                "system": "http://hl7.org/fhir/administrative-gender",
                                "code": fhir_code,
                                "display": fhir_display,
                            }
                        ],
                        "text": fhir_display,
                    }
                ],
            }
            try:
                if sex_key in low_by_sex:
                    entry["low"] = _q(float(low_by_sex[sex_key]))
            except ValueError:
                pass
            try:
                if sex_key in high_by_sex:
                    entry["high"] = _q(float(high_by_sex[sex_key]))
            except ValueError:
                pass
            entries.append(entry)
        if entries:
            # De-dup by FHIR sex code in case input has both 男 and 男性.
            seen: set[str] = set()
            out: list[dict] = []
            for e in entries:
                c = e["appliesTo"][0]["coding"][0]["code"]
                if c in seen:
                    continue
                seen.add(c)
                out.append(e)
            return out

    # Non-sex-stratified — fall through to single-entry path.
    one = _parse_range(raw_range, unit)
    return [one] if one else []


def _parse_range(raw_range: str, unit: str) -> dict | None:
    """Convert a reference-range text into a FHIR referenceRange entry.

    Strategy (in order):
      1. "[low][high]" bracketed format — NHI's canonical shape.
         Empty bracket means that side is unbounded.
      2. "3.89-26.8" / "3.89~26.8" dash range — also accepted.
      3. "> 40" / "< 0.5" single-sided — fills low or high, comparator
         goes in text (SimpleQuantity has no comparator field per FHIR R4).
      4. Anything qualitative ("Negative", "AM 8:00 6.2-19.4") — text-only.

    For sex-stratified shapes like "[男:13.7 女:11.1][男:17.0 女:15.0]"
    use _parse_range_multi (returns one entry per sex).

    Always returns a dict with at least `text`. Returns None only for
    empty input.
    """
    s = (raw_range or "").strip().translate(_FULLWIDTH_OPS)
    if not s:
        return None
    entry: dict = {"text": raw_range}

    def _q(v: float) -> dict:
        out = {"value": v}
        if unit:
            out["unit"] = unit
            out["system"] = "http://unitsofmeasure.org"
            out["code"] = unit
        return out

    m = _RR_LOWHIGH_BRACKETS.match(s)
    if m:
        lo, hi = m.group(1).strip(), m.group(2).strip()
        # Bracket content may itself be a structured form — try them in
        # turn. Strict numeric → preferred. Dash range inside bracket
        # (e.g. "[6.4 - 8.3][]") → split. "Normal (X)" / "Nonreactive(X)"
        # → infer that the parenthetical number is the cutoff (high
        # bound, since the qualitative says "below this is normal").
        # Comparator forms ("≧60", "<=0.04") → low or high accordingly.
        for side, side_val in (("low", lo), ("high", hi)):
            if not side_val or side_val in ("無", "空白", ""):
                continue
            # 1. plain float
            try:
                entry[side] = _q(float(side_val))
                continue
            except ValueError:
                pass
            # 2. dash range — only meaningful for low (split into low+high)
            dm = _RR_DASH_RANGE.search(side_val)
            if dm and side == "low" and "high" not in entry:
                try:
                    entry["low"] = _q(float(dm.group(1)))
                    entry["high"] = _q(float(dm.group(2)))
                    continue
                except ValueError:
                    pass
            # 3. comparator (≧60, <=0.04 etc.)
            cm = _RR_COMPARATOR.match(side_val)
            if cm:
                try:
                    v = float(cm.group(2))
                    op = cm.group(1)
                    if op in (">", ">="):
                        entry["low"] = _q(v)
                    else:
                        entry["high"] = _q(v)
                    continue
                except ValueError:
                    pass
            # 4. "Normal ( X )" / "Nonreactive ( X )" — value in
            # parentheses is the cutoff. The qualitative prefix tells us
            # which side: normal = below X = high bound.
            qm = re.match(
                r"^\s*(Normal|正常|Nonreactive|Non-reactive)\s*\(\s*(-?\d+(?:\.\d+)?)\s*\)\s*$",
                side_val,
                re.IGNORECASE,
            )
            if qm:
                try:
                    entry["high"] = _q(float(qm.group(2)))
                    continue
                except ValueError:
                    pass
        return entry

    m = _RR_DASH_RANGE.search(s)
    if m:
        try:
            entry["low"] = _q(float(m.group(1)))
            entry["high"] = _q(float(m.group(2)))
        except ValueError:
            pass
        return entry

    m = _RR_COMPARATOR.match(s)
    if m:
        op, val = m.group(1), float(m.group(2))
        if op in (">", ">="):
            entry["low"] = _q(val)
        else:
            entry["high"] = _q(val)
        return entry

    # Fall through: qualitative ("Negative", "Nonreactive") or complex
    # ("AM 8:00 6.2-19.4"). Text-only is FHIR-correct; the value-side
    # _map_interpretation handles N/A/POS/NEG coding.
    return entry


def _try_parse_quantity(raw_value: str, unit: str) -> dict | None:
    """Parse "> 40.0" / "<0.010" / "1,234.5" → FHIR Quantity with comparator.

    Returns None when the residual after stripping a comparator still
    isn't numeric — caller then falls back to valueString.
    """
    s = str(raw_value).strip().translate(_FULLWIDTH_OPS)
    m = _COMPARATOR_RE.match(s)
    comparator = None
    if m:
        comparator, s = m.group(1), m.group(2).strip()
    try:
        v = float(s.replace(",", ""))
    except (ValueError, TypeError):
        return None
    ucum_code = _to_ucum(unit)
    qty: dict = {
        "value": v,
        # Quantity.unit (human-readable) keeps the original NHI label
        # so users still see '％' or 'mEq/L' in raw form. Quantity.code
        # is the strict UCUM machine code used for unit math + the
        # validator's UCUM lookup.
        "unit": unit if unit else "",
        "system": "http://unitsofmeasure.org",
    }
    if ucum_code is not None:
        qty["code"] = ucum_code
    if comparator:
        qty["comparator"] = comparator
    # Drop unit display field when empty so we don't emit "unit": "".
    if not qty["unit"]:
        qty.pop("unit", None)
    return qty


# NHI labs report units in a mix of UCUM-clean strings ('mg/dL'),
# Taiwan-style equivalents ('mEq/L' instead of UCUM 'meq/L'), full-
# width punctuation ('％' instead of '%'), and placeholder text
# ('無', literally 'none', when the test has no meaningful unit).
# The TWNHIFHIR validator rejects everything except canonical UCUM
# in Quantity.code, so we normalise. Add new mappings as we hit them.
_UCUM_OVERRIDES: dict[str, str] = {
    # Fullwidth → ASCII
    "％": "%",
    # Case-sensitive UCUM (Eq is 'eq', not 'Eq')
    "mEq/L": "meq/L",
    "meq/l": "meq/L",
    # BP profile fixed-value: mm[Hg] not mmHg
    "mmHg": "mm[Hg]",
    "MMHG": "mm[Hg]",
    # Common Chinese 'no unit' placeholders → drop UCUM code
    # (return None from _to_ucum to omit Quantity.code entirely).
    "無": None,
    "": None,
    "—": None,
    "-": None,
}


def _to_ucum(unit: str | None) -> str | None:
    """Map a unit string to a valid UCUM code, or None to omit code.

    Pass-through for already-canonical UCUM strings (mg/dL, %, U/L,
    mL/min/1.73m2, …) — the validator accepts them as-is. We only
    intervene for known invalid strings (see _UCUM_OVERRIDES).
    """
    if not unit:
        return None
    if unit in _UCUM_OVERRIDES:
        return _UCUM_OVERRIDES[unit]
    return unit

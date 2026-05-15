"""LOINC mapping tables for NHI 醫令代碼 → LOINC R4 codings.

Pure data, no logic. Split out of observation.py to keep the main mapper
file focused on the coding/grouping logic rather than the giant lookup
tables. Edit here when adding LOINC coverage for new 健保 codes.
"""

# ── _NHI_TO_LOINC ─────────────────────────────────────────
# NHI 醫令代碼 → primary LOINC mapping. Source of truth:
#   TWNHIFHIR PAS Implementation Guide ConceptMap-nhi-loinc
#   https://build.fhir.org/ig/TWNHIFHIR/pas/ConceptMap-nhi-loinc.html
#
# That ConceptMap declares 53 NHI codes with `equivalence: relatedto`
# against 806 LOINC variants (different specimens / units / methods
# per NHI code — confirming the "NHI is coarse, LOINC is fine" view).
# For each NHI code we hand-pick the canonical LOINC most clinicians
# would expect in a 健保存摺 lab report: Serum/Plasma + Mass-volume
# (or auto-count for cell counters). Edge cases noted inline.
_NHI_TO_LOINC: dict[str, str] = {
    # ── Haematology ────────────────────────────────────
    "08002C": "6690-2",  # 白血球計數 — Leukocytes #/vol Blood Auto
    "08003C": "718-7",  # 血色素檢查 — Hemoglobin Mass/vol Blood
    "08006C": "777-3",  # 血小板計數 — Platelets #/vol Blood Auto
    "08013C": "57021-8",  # 白血球分類計數 — CBC W Auto Diff panel
    "08128B": "47286-0",  # 骨髓細胞形態判讀合併細胞分類計數
    # ── Chemistry ─────────────────────────────────────
    "09011C": "17861-6",  # 鈣 — Calcium Mass/vol S/P
    "09015C": "2160-0",  # 肌酸酐、血 — Creatinine Mass/vol S/P
    "09016C": "2161-8",  # 肌酐、尿 — Creatinine Mass/vol Urine
    "09025C": "1920-8",  # AST/GOT — Aspartate aminotransferase Act S/P
    "09026C": "1742-6",  # ALT/GPT — Alanine aminotransferase Act S/P
    "09029C": "1975-2",  # 膽紅素總量 — Bilirubin total Mass/vol S/P
    "09030C": "1968-7",  # 直接膽紅素 — Bilirubin direct Mass/vol S/P
    "09033C": "2532-0",  # 乳酸脫氫脢 — LDH Activity S/P
    "09038C": "1751-7",  # 白蛋白 — Albumin Mass/vol S/P
    "09138C": "35672-5",  # 直接/總膽紅素比值
    "12112B": "1751-7",  # 白蛋白(免疫比濁法) — Albumin Mass/vol S/P
    "24007B": "1995-0",  # 血漿游離鈣 — Calcium ionized Moles/vol S/P
    # ── Hormones ──────────────────────────────────────
    "09121C": "2986-8",  # 睪丸酯醇免疫分析 — Testosterone Mass/vol S/P
    "27021B": "2991-8",  # 睪丸脂醇放射免疫分析 — Testosterone Free S/P
    # 09125C / 09127C corrected after dual-reviewer audit — the earlier
    # values (3016-3 was TSH, 10501-5 was LH) were just wrong copy-
    # pastes. Source for the new values: TWNHIFHIR PAS ConceptMap.
    "09125C": "83098-4",  # 濾泡刺激素免疫分析 — Follitropin (FSH) Immunoassay S/P
    "09127C": "83096-8",  # 二氫基春情素免疫分析 — Estradiol Immunoassay S/P
    # ── Tumor markers ─────────────────────────────────
    "12007C": "1834-1",  # α-胎兒蛋白 (AFP) — Mass/vol S/P
    "27049C": "1834-1",  # 甲-胎兒蛋白 (AFP, RIA)
    "12081C": "83112-3",  # PSA (EIA/LIA) — Mass/vol S/P Immunoassay
    "12198C": "83113-1",  # Free PSA — Mass/vol S/P Immunoassay
    "27052C": "2857-1",  # 攝護腺特異抗原 (PSA) — Mass/vol S/P
    "27083B": "10886-0",  # 游離PSA (RIA)
    "12052B": "10873-8",  # β2-微球蛋白
    # ── Immunology / proteins ─────────────────────────
    "09065B": "90991-1",  # 蛋白電泳分析
    "12028B": "14002-0",  # IgM 單向免疫擴散
    "12029B": "14002-0",  # IgM 免疫比濁法
    "12103B": "95801-7",  # 免疫電泳分析
    "12160B": "15189-4",  # IgG κ/λ
    "12171B": "17351-8",  # 抗嗜中性球細胞質抗體 (ANCA)
    "12204B": "20584-9",  # 白血球表面標記
    "25013B": "44596-5",  # 螢光切片檢查
    # ── Hepatitis ─────────────────────────────────────
    "14030C": "5195-3",  # HBsAg
    "14031C": "5195-3",  # HBsAg
    "14032C": "5196-1",  # HBsAg (Mass/vol)
    "14051C": "13955-0",  # HCV Ab
    "27033C": "5197-9",  # HBsAg RIA
    # ── Pathology / cytology / IHC ────────────────────
    "12195B": "18474-7",  # Her-2/neu ISH
    "27061B": "14130-9",  # 動情激素接受體 (ER)
    "27062B": "10861-3",  # 黃體激素接受體 (PR)
    "30103B": "83052-1",  # PD-L1 IHC
    # ── Audiology / pulmonary ─────────────────────────
    "17009B": "24341-0",  # 一氧化碳肺瀰散量
    "22001C": "45498-3",  # 純音聽力檢查
    "22015B": "45498-3",  # 詐聾聽力檢查
    "22025B": "46530-2",  # 自記聽力檢查
    # ═════════════════════════════════════════════════════════════════
    # SUPPLEMENTAL (not in PAS ConceptMap — hand-curated from common
    # NHI codes seen in 健康存摺. LOINC verified against loinc.org
    # canonical names. Method-specific codes (e.g. hs-CRP) pick the
    # specific LOINC; general-method codes pick the most common form.
    # If 健保署 publishes an authoritative broader ConceptMap later,
    # replace this section in one pass.
    # ═════════════════════════════════════════════════════════════════
    # ── Glucose / HbA1c ───────────────────────────────
    "09005C": "1558-6",  # 空腹血糖 (Glu-AC) — Fasting glucose Mass/vol S/P
    "09140C": "2345-7",  # 血糖-餐後/隨機 — Glucose Mass/vol S/P (general)
    "09006C": "4548-4",  # 醣化血紅素 (HbA1c) — Hemoglobin A1c/Hgb.total Blood
    # ── Renal / electrolytes ─────────────────────────
    "09002C": "3094-0",  # BUN — Urea nitrogen Mass/vol S/P
    "09013C": "3084-1",  # Uric Acid — Urate Mass/vol S/P
    "09021C": "2951-2",  # Na — Sodium Moles/vol S/P
    "09022C": "2823-3",  # K  — Potassium Moles/vol S/P
    "09024C": "2028-9",  # CO2 — Carbon dioxide Moles/vol S/P
    "09012C": "2777-1",  # Inorganic P — Phosphate Mass/vol S/P
    "09046B": "19123-9",  # Mg — Magnesium Mass/vol S/P
    # ── Lipid panel ───────────────────────────────────
    "09001C": "2093-3",  # T-Cholesterol — Cholesterol Mass/vol S/P
    "09004C": "2571-8",  # TG — Triglyceride Mass/vol S/P
    "09043C": "2085-9",  # HDL — HDL cholesterol Mass/vol S/P
    "09044C": "13457-7",  # LDL — LDL cholesterol (calculated) Mass/vol S/P
    # ── Liver function ────────────────────────────────
    "09027C": "6768-6",  # ALK-P — Alkaline phosphatase Activity S/P
    "09031C": "2324-2",  # γ-GT — Gamma glutamyl transferase Activity S/P
    "09035C": "2500-7",  # TIBC — Iron binding capacity Mass/vol S/P
    "09037C": "1827-5",  # Ammonia — Plasma
    "09064C": "3040-3",  # Lipase — Activity S/P
    "09059B": "14118-4",  # Lactate — Mass/vol Plasma
    # ── Hematology extras ─────────────────────────────
    "08004C": "4544-3",  # HCT — Hematocrit volume fraction Blood
    "08008C": "14196-0",  # Reticulocyte — Reticulocytes/100 RBC
    "08010C": "711-2",  # Eosinophil count — #/vol Blood
    "08011C": "24317-0",  # CBC panel — Hematology panel Blood
    "08026C": "6301-6",  # PT/INR — INR Platelet poor plasma
    "08036C": "14979-9",  # APTT — Platelet poor plasma
    "08075C": "2692-7",  # Osmolality — Serum or Plasma
    "08079B": "30240-6",  # D-dimer — Plt poor plasma
    # ── Thyroid ───────────────────────────────────────
    "09106C": "3024-7",  # Free T4 — Thyroxine free Mass/vol S/P
    "09112C": "3016-3",  # TSH — Thyrotropin S/P
    # ── Cardiac markers ───────────────────────────────
    "09099C": "10839-9",  # Troponin I — Troponin I cardiac S/P
    "12192C": "33959-8",  # Procalcitonin — S/P
    "12193C": "33762-6",  # NT-proBNP — Mass/vol S/P
    # ── Vitamins / cofactors ──────────────────────────
    "09129C": "2132-9",  # Vit B12 — Cobalamin Mass/vol S/P
    "09130C": "2284-8",  # Folate — Mass/vol S/P
    "09113C": "2143-6",  # Cortisol — Mass/vol S/P
    "12116C": "2276-4",  # Ferritin — Mass/vol S/P
    # ── Acute phase / inflammation ───────────────────
    # 12015C is the generic NHI CRP order — most clinical contexts in 健保
    # send a regular (not hs-) CRP, so map to 1988-5. If a 院所 specifically
    # bills hs-CRP it will land on a different code (e.g. 12189C).
    "12015C": "1988-5",  # CRP — C reactive protein Mass/vol S/P
    "12053C": "5048-4",  # ANA — Antinuclear Ab Titer S/P
    "12056B": "16124-0",  # Anti-mitochondrial Ab S/P
    # ── Urinalysis ────────────────────────────────────
    "06012C": "5778-6",  # Urine appearance — Color
    "06013C": "24356-8",  # 尿生化 panel — Urinalysis macroscopic panel
    "07001C": "14563-1",  # Stool occult blood
    "09134C": "58453-2",  # iFOBT quantitative — Hemoglobin Mass/vol Stool by IA
    "12111C": "2161-8",  # Urine Creatinine — same LOINC as 09016C
    # ── Serology / immunology ────────────────────────
    "12001C": "5292-8",  # RPR — Serum/Plasma
    "12021C": "2039-6",  # CEA — Mass/vol S/P
    "12025B": "2465-3",  # IgG — Mass/vol S/P
    "12027B": "2458-8",  # IgA — Mass/vol S/P
    "12031C": "19113-0",  # IgE — Mass/vol S/P
    "12069B": "5132-6",  # Cryptococcus Ag — Mass/vol S/P
    "12079C": "24108-3",  # CA 19-9 — Mass/vol S/P
    # ── Blood type ────────────────────────────────────
    "11001C": "882-1",  # 血型鑑定 — ABO + Rh group
    "11003C": "882-1",  # 血型鑑定 — ABO + Rh group
    "11004C": "890-4",  # 抗體反應 — Antibody screen
    # ── Microbiology cultures ────────────────────────
    # 13007C 細菌培養 — previously mapped to LOINC 14219-0 which is
    # actually 'HTLV I p26 Ab in Serum' (verified at loinc.org). The
    # right family is 6463-4 / 11268-0 (Bacteria identified by aerobe
    # culture) but the source row doesn't tell us specimen — leaving
    # unmapped so we don't lie. Falls through to NHI-code-only coding.
    "13013C": "31952-5",  # TB Culture — Mycobacterium tuberculosis culture
    "13016B": "600-7",  # Blood Culture — Bacteria identified in Blood
    # ── Virology ──────────────────────────────────────
    "14004B": "7849-3",  # CMV IgG — Ab S/P
    "14048B": "7850-1",  # CMV IgM — Ab S/P
    "14066C": "80383-3",  # Influenza A — Ag Respiratory
    "14084C": "94558-4",  # SARS-CoV-2 Ag — Respiratory
    "12184C": "88157-3",  # CMV DNA quant PCR — Plasma
    # ── Mycobacterium / acid-fast (added after audit) ─
    "13013C": "31952-5",  # TB Culture — already in PAS section too
    "13025C": "29260-7",  # 抗酸性濃縮抹片染色檢查 — Mycobacterium AFB stain
    "13026C": "29553-5",  # 抗酸菌培養 — Mycobacterium culture liquid+solid
    # ── ABG panel (09041B) ────────────────────────────
    # Intentionally NOT mapped here — 09041B is a panel order that
    # unfolds into many items (pH / pCO2 / pO2 / HCO3 / TCO2 / SBE /
    # ABE / SBC / SAT). Mapping the panel code to "pH" would mis-label
    # every non-pH row that shares this NHI code. Each item is
    # resolved via _LOINC_MAP display-keyword fallback below; 09041B
    # also appears in _DISPLAY_FIRST_CODES so display always wins.
    # ── Body fluid / synovial fluid panel (16008C unfolds; the
    #    member items rely on display keywords for specimen-aware
    #    LOINCs). Parent code maps to synovial fluid analysis panel. ──
    # 16008C 滑液檢查 — previously mapped to LOINC 33903-6 which is
    # actually 'Ketones [Presence] in Urine' (verified loinc.org).
    # Leaving unmapped; the panel falls through to NHI-coding only
    # and the per-item displays in _LOINC_MAP carry their own LOINCs
    # where known.
}


# ── _DISPLAY_FIRST_CODES ──────────────────────────────────
# NHI codes that are *panels* — one billing code, many item-specific
# displays. For these, display keyword MUST be tried first (so "WBC"
# under CBC panel 08011C gets 6690-2, not the generic panel LOINC).
# For everything else (single-test codes like 09005C 空腹血糖,
# 09044C LDL, 14030C HBsAg), the NHI code is more specific than any
# display keyword and wins outright.
#
# DESIGN PHILOSOPHY: the bridge is a *faithful transport* layer — it
# trusts the 健保 billing code as authoritative for clinical intent
# (院所 billed 09005C = they ordered fasting glucose, regardless of
# whether the operational specimen was a finger-stick). Display-string
# re-interpretation of clinical context (Glu-AC vs FINGER SUGAR vs
# random) is left to the SMART app, which has more UI context.
_DISPLAY_FIRST_CODES: set[str] = {
    "08011C",  # CBC panel
    "08013C",  # CBC w/ auto diff panel
    "06013C",  # Urinalysis macroscopic panel
    "09041B",  # ABG panel
    "16008C",  # Synovial / body-fluid panel
}


# ── _PANEL_LOINC_MAP ──────────────────────────────────────
# Panel-specific display → LOINC overrides. These run BEFORE the global
# _LOINC_MAP so that urine bilirubin under 06013C maps to 5770-3 (urine
# specimen) instead of being shadowed by the global 'bilirubin' that
# would imply serum, and analogous specimen-aware disambiguation for
# other panel sub-items. Keys are NHI panel codes (must also be in
# _DISPLAY_FIRST_CODES); values are display-keyword → LOINC dicts that
# follow the same matching semantics as _LOINC_MAP (leading word
# boundary for ASCII, substring for CJK).
_PANEL_LOINC_MAP: dict[str, dict[str, str]] = {
    # ── Urinalysis (06013C) ──────────────────────────────
    # All routine dipstick items reside on a single NHI billing code.
    # Without this table they'd all collapse to the panel LOINC 24356-8,
    # losing per-item granularity that's clinically useful (e.g.
    # bilirubin vs urobilinogen for liver workup).
    "06013C": {
        # Order matters: longer/more-specific keys before generic ones
        # (matches _LOINC_MAP iteration semantics — first hit wins).
        "specific gravity": "5811-5",  # Specific gravity Urine
        "sp.gravity": "5811-5",
        "sp gravity": "5811-5",
        "比重": "5811-5",
        "micro-albumin": "14957-5",  # Microalbumin Mass/vol Urine
        "microalbumin": "14957-5",
        "malb(u)": "14957-5",
        "malb": "14957-5",
        "微小白蛋白": "14957-5",
        "uacr": "14959-1",  # Microalbumin/Creatinine ratio Urine
        "urine glucose": "5792-7",
        "sugar": "5792-7",  # NHI '尿糖' / 'Sugar' under 06013C
        "尿糖": "5792-7",
        "urobilinogen": "5818-0",  # Urobilinogen Urine Ql
        "尿膽素原": "5818-0",
        "bilirubin": "5770-3",  # Bilirubin Urine Ql
        "尿膽紅素": "5770-3",
        "nitrite": "5802-4",  # Nitrite Urine
        "亞硝酸": "5802-4",
        "ketones": "5797-6",  # Ketones Urine
        "ketone": "5797-6",
        "酮體": "5797-6",
        "protein": "20454-5",  # Protein Mass/vol Urine
        "尿蛋白": "20454-5",
        "蛋白": "20454-5",
        "leukocyte": "5799-2",  # Leukocytes Urine
        "leu": "5799-2",
        "白血球酯酶": "5799-2",
        "blood": "5794-3",  # Hemoglobin Urine Ql
        "潛血": "5794-3",
        "色": "5778-6",  # Color of Urine (CJK substring)
        "color": "5778-6",
        "turbidity": "5767-9",  # Appearance of Urine
        "appearance": "5767-9",
        "外觀": "5767-9",
        "ph": "5803-2",  # pH of Urine (urine-specific, NOT
        # the arterial 11558-4 that the
        # global map points to)
        "酸鹼度": "5803-2",
        "glucose": "5792-7",  # Last in this block so 'urine
        "尿糖": "5792-7",  # glucose' / 'sugar' / 尿糖 win first
    },
}


# ── _LOINC_MAP ────────────────────────────────────────────
# Common Taiwanese HIS lab names → LOINC code mapping
_LOINC_MAP: dict[str, str] = {
    # ── Glucose ───────────────────────────────────────
    # Display-keyword fallback only kicks in when NO NHI code is
    # present (dashboard rows, LLM-extracted text). When the NHI code
    # IS present, 09005C → 1558-6 (Fasting) and 09140C → 2345-7
    # (generic) wins directly via _NHI_TO_LOINC.
    #
    # Faithful-transport principle: the bridge does NOT re-interpret
    # display strings like "FINGER SUGAR" as a different LOINC — it
    # preserves the raw display in `code.text` and the original NHI
    # code in `code.coding`. The SMART app does specimen/method-aware
    # grouping on the consumer side (see SMART app handoff doc).
    "fasting glucose": "1558-6",
    "空腹血糖": "1558-6",
    "glu-ac": "1558-6",
    "glucose ac": "1558-6",
    "glucose": "2345-7",
    "血糖": "2345-7",
    "glu": "2345-7",
    # HbA1c MUST appear before generic "hb" entries so the longest-prefix
    # match wins for the "HbA1c" display string. Other A1c synonyms…
    "hba1c": "4548-4",
    "醣化血紅素": "4548-4",
    "a1c": "4548-4",
    "hemoglobin": "718-7",
    "血紅素": "718-7",
    "hgb": "718-7",
    "hb": "718-7",
    # CBC diff — eosinophil count must precede the bare 'wbc'/'白血球'
    # keys (which would otherwise win as substrings).
    # 711-2 verified at loinc.org: 'Eosinophils [#/volume] in Blood
    # by Automated count'.
    "嗜酸性白血球": "711-2",
    "嗜伊紅性白血球": "711-2",
    "eosinophil": "711-2",
    "eosinophils": "711-2",
    "wbc": "6690-2",
    "白血球": "6690-2",
    "platelet": "777-3",
    "血小板": "777-3",
    "plt": "777-3",
    # RBC + RBC indices — verified LOINCs (loinc.org):
    #   789-8  Erythrocytes #/vol Blood Auto              → RBC
    #   785-6  Erythrocyte mean corpuscular hemoglobin    → MCH
    # Long CJK forms first (LDL/cholesterol pattern) so '平均紅血球
    # 血色素' wins over 紅血球.
    "平均紅血球血色素": "785-6",
    "rbc": "789-8",
    "紅血球": "789-8",
    "mch": "785-6",
    # Urine creatinine — MUST appear before generic 'creatinine' so
    # rows like 'U-CRE 尿液肌酸酐' or 'Creatinine(U)' resolve to the
    # urine LOINC (2161-8) instead of being shadowed by the serum
    # default (2160-0). Same longest-specific-first ordering as
    # the fasting-vs-random glucose block.
    "urine creatinine": "2161-8",
    "creatinine urine": "2161-8",
    "creatinine(u)": "2161-8",
    "u-cre": "2161-8",
    "u-crea": "2161-8",
    "尿液肌酸酐": "2161-8",
    "creatinine": "2160-0",
    "肌酸酐": "2160-0",
    "肌酐酸": "2160-0",  # Taiwan variant spelling
    "crea": "2160-0",
    "bun": "3094-0",
    "尿素氮": "3094-0",
    "ast": "1920-8",
    "alt": "1742-6",
    "ferritin": "2276-4",
    "血清鐵蛋白": "2276-4",
    "ferr": "2276-4",
    # Vital-signs from 成人預防保健 (IHKE3402) — separate code namespace
    # but the lookup is by display-name substring, same as for labs.
    "body height": "8302-2",
    "body weight": "29463-7",
    "bmi": "39156-5",
    # Waist circumference — measurement LOINC (8280-0). 56086-2 is
    # the 'Adult Waist Circumference Protocol' code, which is a
    # survey/protocol descriptor, NOT a numeric measurement
    # (verified at loinc.org). NHI 健保 reports a single waistline
    # number per visit, so the measurement code is correct.
    "waist circumference": "8280-0",
    "systolic blood pressure": "8480-6",
    "diastolic blood pressure": "8462-4",
    # Lipid panel — ORDER MATTERS. LDL/HDL variants MUST precede the
    # generic 'cholesterol' key so a row labelled 'LDL CHOLESTEROL'
    # resolves to 13457-7 (LDL calculated) and 'HDL CHOLESTEROL' to
    # 2085-9, instead of falling to 2093-3 (total cholesterol) via the
    # 'cholesterol' substring. Same canonical ordering as _LAB_SYNONYMS.
    "ldl cholesterol": "13457-7",
    "ldl-cholesterol": "13457-7",
    "低密度膽固醇": "13457-7",
    "低密度脂蛋白膽固醇": "13457-7",
    # 13457-7 = LDL cholesterol (calculated) — matches the NHI 09044C
    # billing code's intent (Taiwan labs predominantly report calculated
    # LDL via Friedewald). Keep consistent with _NHI_TO_LOINC["09044C"].
    "ldl-c": "13457-7",
    "ldl": "13457-7",
    "hdl cholesterol": "2085-9",
    "hdl-cholesterol": "2085-9",
    "高密度膽固醇": "2085-9",
    "高密度脂蛋白膽固醇": "2085-9",
    "hdl-c": "2085-9",
    "hdl": "2085-9",
    # Total cholesterol — bare 'cholesterol' only fires AFTER the
    # LDL/HDL-prefixed variants above have been checked.
    "total cholesterol": "2093-3",
    "t-cholesterol": "2093-3",
    "血清總膽固醇": "2093-3",
    "總膽固醇": "2093-3",
    "cholesterol": "2093-3",
    "triglyceride": "2571-8",
    "三酸甘油酯": "2571-8",
    "uric acid": "3084-1",
    "egfr": "33914-3",
    "hbsag": "5196-1",
    "anti-hcv": "16128-1",
    # Urine protein (display fallback for the no-NHI-code path that
    # comes from IHKE3402 vitals + adult-preventive supplements).
    "urine protein": "20454-5",  # Protein Mass/vol Urine
    "u-pro": "20454-5",
    "尿蛋白": "20454-5",
    # ABG panel components — 09041B parent code in NHI_TO_LOINC; each
    # member's display ("pCO2", "pO2", "HCO3", "TCO2", "SBE/ABE",
    # "SBC", "SAT" / "SaO2") falls to its own LOINC.
    # pH MUST come before pco2/po2 so the bare "pH" display lands here.
    "ph": "11558-4",  # pH of Arterial blood
    "pco2": "2019-8",  # Carbon dioxide pp in Arterial blood
    "po2": "2703-7",  # Oxygen pp in Arterial blood
    "hco3": "1959-6",  # Bicarbonate Moles/vol Arterial
    "bicarbonate": "1959-6",
    "tco2": "2028-9",  # Total CO2 Moles/vol Arterial
    "sbe": "11555-0",  # Standard base excess Arterial
    "abe": "11555-0",
    "sbc": "1925-7",  # Standard bicarbonate Arterial
    "saturat": "2713-6",  # O2 saturation Arterial
    "sao2": "2713-6",
    "sat": "2713-6",  # NHI display shows just "SAT"
    # Synovial / body-fluid components (16008C parent above).
    "sf.color": "5778-6",  # Color of Body fluid (reuse Urine color spec OK)
    # NOTE: 8255-2 / 13948-5 previously listed here both turned out
    # to be unrelated LOINCs (verified loinc.org — 8255-2 is
    # 'Service comment 13', 13948-5 is 'Coccidioides immitis IgM
    # Ab'). Body-fluid Appearance / RBC don't have well-attested
    # LOINCs in our table yet — falling through to code.text-only
    # is safer than emitting a misleading LOINC. To add later,
    # verify each against loinc.org first.
    "sf.wbc": "26466-3",  # WBC #/vol Body fluid
    "sf.neutrophil": "10328-6",  # Neutrophils/100 leukocytes in Body fluid
    "sf.lympho": "13046-8",  # Lymphocytes #/vol Body fluid
}


# ── _LOINC_DISPLAY ────────────────────────────────────────
# Canonical English display names for LOINC codes the bridge emits.
# Falls back to the raw input display when a LOINC isn't listed here.
# Sourced from loinc.org canonical short names where applicable.
# Add new entries as we widen LOINC coverage — the lookup is keyed on
# LOINC string, so unmapped LOINCs degrade gracefully to the NHI text.
_LOINC_DISPLAY: dict[str, str] = {
    # ── Urinalysis (06013C panel sub-items) ──────────
    # Most critical block — NHI's "Color 尿 顏  ..." style labels are
    # what triggers downstream Chinese-substring labelling bugs.
    "5803-2": "pH of Urine",
    "5811-5": "Specific gravity of Urine",
    "5770-3": "Bilirubin Urine Ql",
    "5802-4": "Nitrite Urine Ql",
    "5778-6": "Color of Urine",
    "5767-9": "Appearance of Urine",
    "5818-0": "Urobilinogen Urine Ql",
    "20454-5": "Protein Mass/Vol in Urine",
    "14957-5": "Microalbumin Mass/Vol in Urine",
    "14959-1": "Microalbumin/Creatinine Ratio in Urine",
    "5792-7": "Glucose Urine Ql",
    "5797-6": "Ketones Urine Ql",
    "5794-3": "Hemoglobin Urine Ql",
    "5799-2": "Leukocytes Urine Ql",
    "24356-8": "Urinalysis Macro Panel",
    # ALL entries below use the LOINC canonical 'Long Common Name'
    # as accepted by the TWNHIFHIR validator. Source: loinc.org for
    # each code, cross-checked against the validator's reported
    # 'Valid display is one of N choices' for displays we previously
    # got wrong (45 LOINCs found in the P333333333 validation run).
    # When updating, copy the exact en-US long name from loinc.org —
    # the validator is sensitive to spelling / punctuation.
    #
    # ── Urinalysis (06013C panel sub-items) ──────────
    "5803-2": "pH of Urine by Test strip",
    "5811-5": "Specific gravity of Urine by Test strip",
    "5770-3": "Bilirubin.total [Presence] in Urine by Test strip",
    "5802-4": "Nitrite [Presence] in Urine by Test strip",
    "5778-6": "Color of Urine",
    "5767-9": "Appearance of Urine",
    "5818-0": "Urobilinogen [Presence] in Urine by Test strip",
    "20454-5": "Protein [Presence] in Urine by Test strip",
    "14957-5": "Microalbumin [Mass/volume] in Urine",
    "14959-1": "Microalbumin/Creatinine [Mass Ratio] in Urine",
    "5792-7": "Glucose [Mass/volume] in Urine by Test strip",
    "5797-6": "Ketones [Mass/volume] in Urine by Test strip",
    "5794-3": "Hemoglobin [Presence] in Urine by Test strip",
    "5799-2": "Leukocyte esterase [Presence] in Urine by Test strip",
    "24356-8": "Urinalysis complete panel - Urine",
    # ── ABG (09041B panel) — not in validator output; loinc.org sourced
    "11558-4": "pH of Arterial blood",
    "2019-8": "Carbon dioxide [Partial pressure] in Arterial blood",
    "2703-7": "Oxygen [Partial pressure] in Arterial blood",
    "1959-6": "Bicarbonate [Moles/volume] in Arterial blood",
    "2028-9": "Carbon dioxide [Moles/volume] in Serum or Plasma",
    "11555-0": "Base excess in Arterial blood by calculation",
    "1925-7": "Bicarbonate [Moles/volume] in Arterial blood --standard",
    "2713-6": "Oxygen saturation in Arterial blood",
    # ── Glucose ──────────────────────────────────────
    "1558-6": "Fasting glucose [Mass/volume] in Serum or Plasma",
    "2345-7": "Glucose [Mass/volume] in Serum or Plasma",
    # ── Hematology ───────────────────────────────────
    "718-7": "Hemoglobin [Mass/volume] in Blood",
    "4548-4": "Hemoglobin A1c/Hemoglobin.total in Blood",
    "6690-2": "Leukocytes [#/volume] in Blood by Automated count",
    "777-3": "Platelets [#/volume] in Blood by Automated count",
    "789-8": "Erythrocytes [#/volume] in Blood by Automated count",
    "785-6": "MCH [Entitic mass] by Automated count",
    "711-2": "Eosinophils [#/volume] in Blood by Automated count",
    "4544-3": "Hematocrit [Volume Fraction] of Blood by Automated count",
    "57021-8": "CBC W Auto Differential panel - Blood",
    "24317-0": "Hemogram and platelets WO differential panel - Blood",
    # ── Chemistry / liver / renal ────────────────────
    "1920-8": "Aspartate aminotransferase [Enzymatic activity/volume] in Serum or Plasma",
    "1742-6": "Alanine aminotransferase [Enzymatic activity/volume] in Serum or Plasma",
    "2160-0": "Creatinine [Mass/volume] in Serum or Plasma",
    "2161-8": "Creatinine [Mass/volume] in Urine",
    "33914-3": "Glomerular filtration rate [Volume Rate/Area] in Serum or Plasma by Creatinine-based formula (MDRD)/1.73 sq M",
    "3094-0": "Urea nitrogen [Mass/volume] in Serum or Plasma",
    "3084-1": "Urate [Mass/volume] in Serum or Plasma",
    "2951-2": "Sodium [Moles/volume] in Serum or Plasma",
    "2823-3": "Potassium [Moles/volume] in Serum or Plasma",
    "1975-2": "Bilirubin.total [Mass/volume] in Serum or Plasma",
    "1968-7": "Bilirubin.direct [Mass/volume] in Serum or Plasma",
    "1751-7": "Albumin [Mass/volume] in Serum or Plasma",
    "2532-0": "Lactate dehydrogenase [Enzymatic activity/volume] in Serum or Plasma",
    "6768-6": "Alkaline phosphatase [Enzymatic activity/volume] in Serum or Plasma",
    "2324-2": "Gamma glutamyl transferase [Enzymatic activity/volume] in Serum or Plasma",
    "17861-6": "Calcium [Mass/volume] in Serum or Plasma",
    # ── Lipid panel ──────────────────────────────────
    "2093-3": "Cholesterol [Mass/volume] in Serum or Plasma",
    "2571-8": "Triglyceride [Mass/volume] in Serum or Plasma",
    "2085-9": "Cholesterol in HDL [Mass/volume] in Serum or Plasma",
    "13457-7": "Cholesterol in LDL [Mass/volume] in Serum or Plasma by calculation",
    # ── Thyroid / hormones ───────────────────────────
    "3016-3": "Thyrotropin [Units/volume] in Serum or Plasma",
    "3024-7": "Thyroxine (T4) free [Mass/volume] in Serum or Plasma",
    "2986-8": "Testosterone [Mass/volume] in Serum or Plasma",
    "83098-4": "Follitropin [Units/volume] in Serum or Plasma by Immunoassay",
    "83096-8": "Estradiol (E2) [Mass/volume] in Serum or Plasma by Immunoassay",
    # ── Cardiac / inflammation ───────────────────────
    "10839-9": "Troponin I.cardiac [Mass/volume] in Serum or Plasma",
    "33762-6": "Natriuretic peptide.B prohormone N-Terminal [Mass/volume] in Serum or Plasma",
    "1988-5": "C reactive protein [Mass/volume] in Serum or Plasma",
    "33959-8": "Procalcitonin [Mass/volume] in Serum or Plasma",
    # ── Hepatitis / serology ─────────────────────────
    "5195-3": "Hepatitis B virus surface Ag [Presence] in Serum",
    "5196-1": "Hepatitis B virus surface Ag [Units/volume] in Serum",
    "16128-1": "Hepatitis C virus Ab [Presence] in Serum",
    "13955-0": "Hepatitis C virus Ab [Presence] in Serum or Plasma by Immunoassay",
    # ── Coagulation ──────────────────────────────────
    "6301-6": "INR in Platelet poor plasma by Coagulation assay",
    "14979-9": "aPTT in Platelet poor plasma by Coagulation assay",
    "30240-6": "Fibrin D-dimer [Mass/volume] in Platelet poor plasma",
    # ── Vital signs (IHKE3402) ───────────────────────
    "8302-2": "Body height",
    "29463-7": "Body weight",
    "39156-5": "Body mass index (BMI) [Ratio]",
    "8280-0": "Waist Circumference at umbilicus by Tape measure",
    "8480-6": "Systolic blood pressure",
    "8462-4": "Diastolic blood pressure",
    "85354-9": "Blood pressure panel with all children optional",
}

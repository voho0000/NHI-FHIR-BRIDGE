/**
 * LOINC mapping tables for NHI 醫令代碼 → LOINC R4 codings.
 *
 * Pure data, no logic. Port of `backend/app/mapper/_loinc_tables.py`.
 */

// ── _NHI_TO_LOINC ─────────────────────────────────────────
// NHI 醫令代碼 → primary LOINC mapping. Source of truth:
// TWNHIFHIR PAS Implementation Guide ConceptMap-nhi-loinc
// https://build.fhir.org/ig/TWNHIFHIR/pas/ConceptMap-nhi-loinc.html
//
// That ConceptMap declares 53 NHI codes with `equivalence: relatedto`
// against 806 LOINC variants (different specimens / units / methods
// per NHI code — confirming the "NHI is coarse, LOINC is fine" view).
// For each NHI code we hand-pick the canonical LOINC most clinicians
// would expect in a 健保存摺 lab report: Serum/Plasma + Mass-volume
// (or auto-count for cell counters). Edge cases noted inline.
export const NHI_TO_LOINC: Record<string, string> = {
  // ── Haematology ────────────────────────────────────
  "08002C": "6690-2", // 白血球計數 — Leukocytes #/vol Blood Auto
  "08003C": "718-7", // 血色素檢查 — Hemoglobin Mass/vol Blood
  "08006C": "777-3", // 血小板計數 — Platelets #/vol Blood Auto
  "08013C": "57021-8", // 白血球分類計數 — CBC W Auto Diff panel
  "08128B": "47286-0", // 骨髓細胞形態判讀合併細胞分類計數
  // TODO(panel, v0.9.10 audit): 08128B reports morphology + per-cell
  // counts as multi-row. Low priority because bone marrow rarely
  // surfaces in 健康存摺 + SMART app shows raw display text per row,
  // so the visible-bug surface is small. Promote to DISPLAY_FIRST_CODES
  // + add PANEL_LOINC_MAP if SMART app dev reports the issue.
  // ── Chemistry ─────────────────────────────────────
  "09011C": "17861-6", // 鈣 — Calcium Mass/vol S/P
  "09015C": "2160-0", // 肌酸酐、血 — Creatinine Mass/vol S/P
  "09016C": "2161-8", // 肌酐、尿 — Creatinine Mass/vol Urine
  "09025C": "1920-8", // AST/GOT — Aspartate aminotransferase Act S/P
  "09026C": "1742-6", // ALT/GPT — Alanine aminotransferase Act S/P
  "09029C": "1975-2", // 膽紅素總量 — Bilirubin total Mass/vol S/P
  "09030C": "1968-7", // 直接膽紅素 — Bilirubin direct Mass/vol S/P
  "09033C": "2532-0", // 乳酸脫氫脢 — LDH Activity S/P
  "09038C": "1751-7", // 白蛋白 — Albumin Mass/vol S/P
  "09138C": "35672-5", // 直接/總膽紅素比值
  "12112B": "1751-7", // 白蛋白(免疫比濁法) — Albumin Mass/vol S/P
  "24007B": "1995-0", // 血漿游離鈣 — Calcium ionized Moles/vol S/P
  // ── Hormones ──────────────────────────────────────
  "09121C": "2986-8", // 睪丸酯醇免疫分析 — Testosterone Mass/vol S/P
  "27021B": "2991-8", // 睪丸脂醇放射免疫分析 — Testosterone Free S/P
  // 09125C / 09127C corrected after dual-reviewer audit — the earlier
  // values (3016-3 was TSH, 10501-5 was LH) were just wrong copy-
  // pastes. Source for the new values: TWNHIFHIR PAS ConceptMap.
  "09125C": "83098-4", // 濾泡刺激素免疫分析 — Follitropin (FSH) Immunoassay S/P
  "09127C": "83096-8", // 二氫基春情素免疫分析 — Estradiol Immunoassay S/P
  // ── Tumor markers ─────────────────────────────────
  "12007C": "1834-1", // α-胎兒蛋白 (AFP) — Mass/vol S/P
  "27049C": "1834-1", // 甲-胎兒蛋白 (AFP, RIA)
  "12081C": "83112-3", // PSA (EIA/LIA) — Mass/vol S/P Immunoassay
  "12198C": "83113-1", // Free PSA — Mass/vol S/P Immunoassay
  "27052C": "2857-1", // 攝護腺特異抗原 (PSA) — Mass/vol S/P
  "27083B": "10886-0", // 游離PSA (RIA)
  // 12052B β2-微球蛋白 — previously mapped to 10873-8 which is actually
  // 'Beta-2-Microglobulin [Mass/time] in 24 hour Urine' (timed urine
  // collection, verified loinc.org/10873-8/). Taiwan 12052B billing is
  // typically a serum order; 1952-1 is the verified serum-or-plasma LOINC
  // (Component=Beta-2-Microglobulin, Property=MCnc) — loinc.org/1952-1/.
  "12052B": "1952-1", // β2-microglobulin — Mass/vol S/P
  // ── Immunology / proteins ─────────────────────────
  "09065B": "90991-1", // 蛋白電泳分析 — panel LOINC (sub-rows
  // routed via DISPLAY_FIRST_CODES + PANEL_LOINC_MAP since v0.10.0;
  // this entry is fallback for empty display)
  // 12028B / 12029B IgM (serum, immunodiffusion / nephelometry) — previously
  // both mapped to LOINC 14002-0 which is actually 'IgM [Units/volume] in
  // Cord blood' (neonatal specimen, verified loinc.org/14002-0/). Wrong
  // specimen for an adult serum order. Leaving unmapped; falls through to
  // NHI-code-only coding. See docs/LOINC_AUDIT_2026_05_19.md.
  "12103B": "95801-7", // 免疫電泳分析
  "12160B": "15189-4", // IgG κ/λ
  "12171B": "17351-8", // 抗嗜中性球細胞質抗體 (ANCA)
  "12204B": "20584-9", // 白血球表面標記 — Lymphocyte subset panel
  // (sub-rows routed via DISPLAY_FIRST_CODES + PANEL_LOINC_MAP since
  // v0.10.0; this entry is fallback for empty display)
  "25013B": "44596-5", // 螢光切片檢查
  // ── Hepatitis ─────────────────────────────────────
  "14030C": "5195-3", // HBsAg
  "14031C": "5195-3", // HBsAg
  "14032C": "5196-1", // HBsAg (Mass/vol)
  "14051C": "13955-0", // HCV Ab
  "27033C": "5197-9", // HBsAg RIA
  // ── Pathology / cytology / IHC ────────────────────
  "12195B": "18474-7", // Her-2/neu ISH
  "27061B": "14130-9", // 動情激素接受體 (ER)
  "27062B": "10861-3", // 黃體激素接受體 (PR)
  "30103B": "83052-1", // PD-L1 IHC
  // ── Audiology / pulmonary ─────────────────────────
  "17009B": "24341-0", // 一氧化碳肺瀰散量 — DLCO panel (sub-rows
  // routed via DISPLAY_FIRST_CODES + PANEL_LOINC_MAP since v0.10.0;
  // this entry is fallback for empty display)
  // 22001C 純音聽力檢查 — previously mapped to LOINC 45498-3 which is
  // actually 'Hearing [Minimum Data Set]' (an MDS long-term-care survey
  // item, NOT a pure-tone audiometry measurement; verified loinc.org/
  // 45498-3/ 2026-05-29). Wrong analyte type entirely. Leaving unmapped;
  // falls through to NHI-code-only coding. v0.12.0 audit.
  // 22015B 詐聾聽力檢查 — same wrong 45498-3 mapping. Removed.
  // 22025B 自記聽力檢查 — previously mapped to LOINC 46530-2 which is
  // actually 'Sensory status - hearing and ability to understand spoken
  // language [OASIS]' (an OASIS home-health survey item, verified
  // loinc.org/46530-2/ 2026-05-29). Wrong type. Leaving unmapped.
  // ═════════════════════════════════════════════════════════════════
  // SUPPLEMENTAL (not in PAS ConceptMap — hand-curated from common
  // NHI codes seen in 健康存摺. LOINC verified against loinc.org
  // canonical names. Method-specific codes (e.g. hs-CRP) pick the
  // specific LOINC; general-method codes pick the most common form.
  // If 健保署 publishes an authoritative broader ConceptMap later,
  // replace this section in one pass.
  // ═════════════════════════════════════════════════════════════════
  // ── Glucose / HbA1c ───────────────────────────────
  "09005C": "1558-6", // 空腹血糖 (Glu-AC) — Fasting glucose Mass/vol S/P
  "09140C": "2345-7", // 血糖-餐後/隨機 — Glucose Mass/vol S/P (general)
  "09006C": "4548-4", // 醣化血紅素 (HbA1c) — Hemoglobin A1c/Hgb.total Blood
  // ── Renal / electrolytes ─────────────────────────
  "09002C": "3094-0", // BUN — Urea nitrogen Mass/vol S/P
  "09013C": "3084-1", // Uric Acid — Urate Mass/vol S/P
  "09021C": "2951-2", // Na — Sodium Moles/vol S/P
  "09022C": "2823-3", // K  — Potassium Moles/vol S/P
  "09024C": "2028-9", // CO2 — Carbon dioxide Moles/vol S/P
  "09012C": "2777-1", // Inorganic P — Phosphate Mass/vol S/P
  "09046B": "19123-9", // Mg — Magnesium Mass/vol S/P
  // ── Lipid panel ───────────────────────────────────
  "09001C": "2093-3", // T-Cholesterol — Cholesterol Mass/vol S/P
  "09004C": "2571-8", // TG — Triglyceride Mass/vol S/P
  "09043C": "2085-9", // HDL — HDL cholesterol Mass/vol S/P
  "09044C": "13457-7", // LDL — LDL cholesterol (calculated) Mass/vol S/P
  // ── Liver function ────────────────────────────────
  "09027C": "6768-6", // ALK-P — Alkaline phosphatase Activity S/P
  "09031C": "2324-2", // γ-GT — Gamma glutamyl transferase Activity S/P
  "09035C": "2500-7", // TIBC — Iron binding capacity Mass/vol S/P
  // 09037C 血氨 — previously mapped to LOINC 1827-5 which is actually
  // 'Alpha 1 antitrypsin MS [Mass/volume] in Serum or Plasma' (verified
  // loinc.org/1827-5/). Wrong analyte entirely. Leaving unmapped; falls
  // through to NHI-code-only coding. See docs/LOINC_AUDIT_2026_05_19.md.
  "09064C": "3040-3", // Lipase — Activity S/P
  "09059B": "14118-4", // Lactate — Mass/vol Plasma
  // ── Hematology extras ─────────────────────────────
  "08004C": "4544-3", // HCT — Hematocrit volume fraction Blood
  "08008C": "14196-0", // Reticulocyte — Reticulocytes/100 RBC
  "08010C": "711-2", // Eosinophil count — #/vol Blood
  "08011C": "24317-0", // CBC panel — Hematology panel Blood
  "08026C": "6301-6", // PT/INR — INR Platelet poor plasma
  "08036C": "14979-9", // APTT — Platelet poor plasma
  // v0.12.0 audit fix: 2692-7 typo; LOINC 2692-7 does NOT exist in the
  // LOINC database (verified loinc.org/2692-7/ → not found, suggests
  // 2692-2). Correct LOINC for serum/plasma osmolality is 2692-2,
  // "Osmolality of Serum or Plasma" (verified loinc.org/2692-2/).
  "08075C": "2692-2", // Osmolality — Serum or Plasma
  "08079B": "30240-6", // D-dimer — Plt poor plasma
  // ── Coag panel members (kept here as fallback) ────────
  // 08026C PT/INR is a 2-row panel (PT in seconds + INR). Promoted to
  // DISPLAY_FIRST_CODES so per-item displays route via PANEL_LOINC_MAP;
  // this entry is only consumed when the display is empty/unrecognised,
  // in which case INR is the safer default (more clinically tracked).
  // ── Thyroid ───────────────────────────────────────
  // Free T4 has TWO valid LOINCs that differ only in unit-system:
  //   3024-7  Component=Thyroxine.free, Property=MCnc (Mass conc, ng/dL)
  //   14920-3 Component=Thyroxine.free, Property=SCnc (Molar conc, pmol/L)
  // Both are Free T4 — neither is Total T4. Earlier history:
  //   - Original mapping was 3024-7 (correct: matches Taiwan ng/dL labs).
  //   - Commit 9da5e5b changed it to 14920-3 on the premise that 3024-7
  //     was Total T4. That premise was inverted (verified loinc.org/3024-7/
  //     — Component is "Thyroxine.free"); the change introduced a LOINC↔unit
  //     mismatch (molar LOINC paired with a ng/dL value).
  //   - Restoring 3024-7 here so the LOINC's property class (MCnc) matches
  //     the unit field (ng/dL) Taiwan labs ship. See docs/LOINC_AUDIT_2026_05_19.md
  //     section F for full evidence.
  "09106C": "3024-7", // Free T4 — Thyroxine (T4) free [Mass/volume] S/P
  "09112C": "3016-3", // TSH — Thyrotropin S/P
  // ── Cardiac markers ───────────────────────────────
  "09099C": "10839-9", // Troponin I — Troponin I cardiac S/P
  "12192C": "33959-8", // Procalcitonin — S/P
  "12193C": "33762-6", // NT-proBNP — Mass/vol S/P
  // ── Vitamins / cofactors ──────────────────────────
  "09129C": "2132-9", // Vit B12 — Cobalamin Mass/vol S/P
  "09130C": "2284-8", // Folate — Mass/vol S/P
  "09113C": "2143-6", // Cortisol — Mass/vol S/P
  "12116C": "2276-4", // Ferritin — Mass/vol S/P
  // ── Acute phase / inflammation ───────────────────
  // 12015C is the generic NHI CRP order — most clinical contexts in 健保
  // send a regular (not hs-) CRP, so map to 1988-5. If a 院所 specifically
  // bills hs-CRP it will land on a different code (e.g. 12189C).
  "12015C": "1988-5", // CRP — C reactive protein Mass/vol S/P
  "12053C": "5048-4", // ANA — Antinuclear Ab Titer S/P
  "12056B": "16124-0", // Anti-mitochondrial Ab S/P
  // ── Urinalysis ────────────────────────────────────
  "06012C": "5778-6", // Urine appearance — Color
  "06013C": "24356-8", // 尿生化 panel — Urinalysis macroscopic panel
  "07001C": "14563-1", // Stool occult blood
  "09134C": "58453-2", // iFOBT quantitative — Hemoglobin Mass/vol Stool by IA
  "12111C": "2161-8", // Urine Creatinine — same LOINC as 09016C
  // ── Serology / immunology ────────────────────────
  "12001C": "5292-8", // RPR — Serum/Plasma
  "12021C": "2039-6", // CEA — Mass/vol S/P
  "12025B": "2465-3", // IgG — Mass/vol S/P
  "12027B": "2458-8", // IgA — Mass/vol S/P
  "12031C": "19113-0", // IgE — Mass/vol S/P
  // 12069B Cryptococcus Ag — previously mapped to LOINC 5132-6 which is
  // actually 'DNA single strand Ab [Units/volume] in Serum' (anti-ssDNA,
  // lupus serology — verified loinc.org/5132-6/). Completely wrong
  // analyte. Leaving unmapped; falls through to NHI-code-only coding.
  // See docs/LOINC_AUDIT_2026_05_19.md.
  "12079C": "24108-3", // CA 19-9 — Mass/vol S/P
  // ── Blood type ────────────────────────────────────
  // v0.11.11 (SMART app dev bug 4 2026-05-29 + loinc.org audit):
  // 882-1 is the COMBINED "ABO and Rh group [Type] in Blood" — its
  // answer list is "O Pos / O Neg / A Pos…AB Neg", not appropriate
  // for ABO-only OR Rh-only rows. Splitting per loinc.org audit:
  //   883-9   ABO group [Type] in Blood              — 11001C ABO
  //   10331-7 Rh [Type] in Blood                     — 11003C Rh(D)
  //   890-4   Antibody screen [Presence] in Blood    — 11004C unchanged
  // Each LOINC verified at loinc.org 2026-05-29 (Component / Property /
  // System / Method confirmed appropriate for standalone analyte).
  "11001C": "883-9", // ABO group [Type] in Blood (BLDBK)
  "11003C": "10331-7", // Rh [Type] in Blood (BLDBK)
  "11004C": "890-4", // 抗體反應 — Antibody screen
  // ── Microbiology cultures ────────────────────────
  // 13007C 細菌培養 — previously mapped to LOINC 14219-0 which is
  // actually 'HTLV I p26 Ab in Serum' (verified at loinc.org). The
  // right family is 6463-4 / 11268-0 (Bacteria identified by aerobe
  // culture) but the source row doesn't tell us specimen — leaving
  // unmapped so we don't lie. Falls through to NHI-code-only coding.
  // 13013C TB Culture — previously mapped to LOINC 31952-5 which is
  // actually 'Rinderpest virus Ag [Presence] in Exudate' (cattle
  // morbillivirus, verified loinc.org/31952-5/). Wrong organism entirely.
  // Leaving unmapped; falls through to NHI-code-only coding. See
  // docs/LOINC_AUDIT_2026_05_19.md.
  "13016B": "600-7", // Blood Culture — Bacteria identified in Blood
  // ── Virology ──────────────────────────────────────
  // 14004B CMV IgG — previously mapped to LOINC 7849-3 which is actually
  // 'Taenia solium larva IgM Ab [Presence] in Serum' (pork tapeworm,
  // verified loinc.org/7849-3/). No verified canonical replacement found
  // in this pass (candidates 5126-8 / 5125-0 are IgM or method-specific,
  // 22592-9 / 22591-1 / 16125-5 returned HTTP 500 on every retry).
  // Leaving unmapped; falls through to NHI-code-only coding.
  "14048B": "7853-5", // CMV IgM — Cytomegalovirus IgM Ab [Units/volume] S/P
  //   restored after audit: 14048B previously mapped to 7850-1 which is
  //   'Taenia solium larva Ab' (verified loinc.org/7850-1/). 7853-5
  //   verified as the canonical CMV IgM LOINC (Component=Cytomegalovirus
  //   Ab.IgM, Property=ACnc) — loinc.org/7853-5/.
  "14066C": "80383-3", // Influenza A — Ag Respiratory
  "14084C": "94558-4", // SARS-CoV-2 Ag — Respiratory
  // 12184C CMV DNA quant PCR — previously mapped to LOINC 88157-3 which
  // is actually 'Microscopic observation [Identifier] in Semen by Acid
  // fast stain' (semen AFB, verified loinc.org/88157-3/ 2026-05-29).
  // Completely wrong analyte + specimen. Leaving unmapped; falls through
  // to NHI-code-only coding. v0.12.0 audit.
  // ── Mycobacterium / acid-fast (added after audit) ─
  // 13025C 抗酸性濃縮抹片染色檢查 — previously mapped to LOINC 29260-7
  // which is actually 'Monocytes Abnormal [#/volume] in Blood by Manual
  // count' (verified loinc.org/29260-7/ 2026-05-29). Wrong analyte
  // (hematology, not microbiology). Leaving unmapped. v0.12.0 audit.
  // 13026C 抗酸菌培養 — previously mapped to LOINC 29553-5 which is
  // actually 'Age calculated' (verified loinc.org/29553-5/ 2026-05-29).
  // Completely unrelated to mycobacteria. Leaving unmapped. v0.12.0 audit.
  // ── ABG panel (09041B) ────────────────────────────
  // Intentionally NOT mapped here — 09041B is a panel order that
  // unfolds into many items (pH / pCO2 / pO2 / HCO3 / TCO2 / SBE /
  // ABE / SBC / SAT). Mapping the panel code to "pH" would mis-label
  // every non-pH row that shares this NHI code. Each item is
  // resolved via _LOINC_MAP display-keyword fallback below; 09041B
  // also appears in _DISPLAY_FIRST_CODES so display always wins.
  // ── Body fluid / synovial fluid panel (16008C unfolds; the
  // member items rely on display keywords for specimen-aware
  // LOINCs). Parent code maps to synovial fluid analysis panel. ──
  // 16008C 滑液檢查 — previously mapped to LOINC 33903-6 which is
  // actually 'Ketones [Presence] in Urine' (verified loinc.org).
  // Leaving unmapped; the panel falls through to NHI-coding only
  // and the per-item displays in _LOINC_MAP carry their own LOINCs
  // where known.
};

// ── _DISPLAY_FIRST_CODES ──────────────────────────────────
// NHI codes that are *panels* — one billing code, many item-specific
// displays. For these, display keyword MUST be tried first (so "WBC"
// under CBC panel 08011C gets 6690-2, not the generic panel LOINC).
// For everything else (single-test codes like 09005C 空腹血糖,
// 09044C LDL, 14030C HBsAg), the NHI code is more specific than any
// display keyword and wins outright.
//
// DESIGN PHILOSOPHY: the bridge is a *faithful transport* layer — it
// trusts the 健保 billing code as authoritative for clinical intent
// (院所 billed 09005C = they ordered fasting glucose, regardless of
// whether the operational specimen was a finger-stick). Display-string
// re-interpretation of clinical context (Glu-AC vs FINGER SUGAR vs
// random) is left to the SMART app, which has more UI context.
export const DISPLAY_FIRST_CODES: ReadonlySet<string> = new Set([
  "08011C", // CBC panel
  "08013C", // CBC w/ auto diff panel
  "06013C", // Urinalysis macroscopic panel
  "09015C", // Serum creatinine — Taiwan labs report eGFR as a piggyback
  // sub-row on the same Crea billing code. Without panel-mode handling,
  // every row under 09015C (incl. the eGFR one) got LOINC 2160-0
  // (Creatinine), causing SMART apps to display eGFR=33 as CREA=33 mg/dL
  // — an instant fatal-looking false reading (real CREA ~1.94, real eGFR
  // is CKD stage 3a). Bug report 2026-05-27 (Part 2).
  "09041B", // ABG panel
  "16008C", // Synovial / body-fluid panel
  "08026C", // PT/INR — Taiwan labs bill PT (seconds) AND INR under the
  // same 08026C code as two sub-rows. Without panel-mode handling, both
  // collapsed to LOINC 6301-6 (INR). For warfarin monitoring this is
  // patient-safety-adjacent: a trend chart would plot PT seconds (~12)
  // and INR (~2.5) on the same series, or label a PT=12 row as "INR=12"
  // (instantly looks like critical anticoagulation overdose). v0.9.10.
  "08036C", // APTT — Taiwan labs bill BOTH "APTT" (seconds, normal ~25-35)
  // AND "Heparin治療範圍參考倍數" / "APTT data/mean" (ratio, normal ~1.0)
  // under the same 08036C code. Without panel-mode handling, both
  // collapsed to LOINC 14979-9 (APTT time, seconds) — the ratio row's
  // value of 1.08 displayed under an APTT-time trend column would read
  // as a fatally low APTT, or scientifically nonsensical seconds unit
  // for a ratio. SMART app dev report 2026-05-29. LOINC verified at
  // loinc.org: 14979-9 Property=Time (seconds), 63561-5 Property=RelTime
  // (actual/normal ratio). v0.11.9.
  // ── CBC component billing codes (v0.9.10, bug report Part 5) ─────
  // These are SINGLE-analyte billing codes (one analyte per code, NOT
  // panels). Why are they here? Hospital LIS labelling errors swap
  // displays across CBC siblings: 嘉基's bundle billed 08004C (HCT)
  // but the row's display text was "HGB" with value 13 g/dL — clearly
  // a hemoglobin measurement mis-billed as HCT, or a label/display
  // swap inside the LIS. Trusting the NHI code returned LOINC 4544-3
  // (HCT) for a hemoglobin row → SMART app's HCT trend column showed
  // 13 (impossible for HCT, normal 30-50%). Promoting these to
  // display-first lets unambiguous display text ("HGB", "HCT", "Hb",
  // "Ht") override the LIS billing-swap. SCOPED to CBC family ONLY —
  // we don't generalize to other single-test codes because outside
  // CBC the display strings are less standardized and the risk of
  // wrong over-ride is higher. v0.9.10 Part 5.
  "08002C", // WBC count (Leukocytes)
  "08003C", // Hemoglobin
  "08004C", // Hematocrit
  "08006C", // Platelets
  // ── Urine creatinine sibling codes (v0.9.10 Part 6 N2) ──
  // Promoted to defend against the UACR billing pattern: hospitals
  // bill both legs of the ratio (microalbumin + urine creatinine)
  // under one creatinine code and distinguish by display text. Without
  // display routing, microalbumin rows return LOINC 2161-8 (creatinine).
  // See URINE_BIOCHEM_KEYS const for the analyte map.
  "09016C", // 肌酐、尿 — Urine creatinine billing
  "12111C", // Urine Creatinine (alternate billing)
  // ── Specialised panels (v0.10.0 — completing the v0.9.10 TODO list)
  // Same reasoning as CBC umbrella + urine: each billing code unfolds
  // into multiple sub-rows with distinct LOINCs. Previously deferred
  // under TODO(panel) comments in NHI_TO_LOINC; now activated with
  // verified LOINCs.
  "09065B", // SPE — albumin/α1/α2/β/γ globulin fractions + A/G ratio
  "12204B", // Flow cytometry CD markers — CD3/CD4/CD8/CD19/CD56/ratio
  "17009B", // DLCO — DLCO + VA + DLCO/VA
]);

// ── CBC component display keys (shared) ──────────────────
// Source of truth for the basic CBC analyte keys reused by:
//   • 08011C — CBC umbrella panel (sub-rows for each analyte)
//   • 08002C / 08003C / 08004C / 08006C — single-analyte billing codes
//     promoted to DISPLAY_FIRST_CODES in v0.9.10 to defend against
//     hospital LIS labelling swaps (bug report 2026-05-27 Part 5).
// Each LOINC verified at loinc.org. "ht" / "h.t." added v0.9.10 — they
// were missing under 08011C, causing rows displayed as "Ht" to fall
// back to the panel LOINC 24317-0 (Hemogram panel) which SMART app
// pivot-by-LOINC then dropped from per-analyte trend columns.
const CBC_COMPONENT_KEYS: Record<string, string> = {
  // Hemoglobin — variant CJK 血色素 / 血紅蛋白 added v0.11.4 audit
  // (Taiwan medical texts use all three interchangeably).
  hemoglobin: "718-7",
  血紅素: "718-7",
  血色素: "718-7",
  血紅蛋白: "718-7",
  hgb: "718-7",
  hb: "718-7",
  "hb.": "718-7",
  // Hematocrit (HCT) — Taiwan LIS shortens to "Ht" / "H.t.". The
  // ".ascii" period-separated forms (e.g. "M.C.V.") added v0.11.4 —
  // they bypass \bMCV\b matching because intra-word periods break
  // the word boundary. Key WITHOUT trailing period covers both
  // "M.C.V" and "M.C.V." inputs (trailing period creates a \b on
  // the closing letter, key's regex `\bm\.c\.v\b` matches the "M.C.V"
  // prefix of "M.C.V." just fine).
  hematocrit: "4544-3",
  血球容積比: "4544-3",
  // v0.11.11 (SMART app dev bug 2 + 5 2026-05-29): variants observed
  // in user's v0.11.9 bundle. "血球容積比值測定" was previously
  // matching the global LOINC_MAP fallback to a panel LOINC; "血球比容值"
  // is a sibling phrasing.
  血球容積比值: "4544-3",
  血球容積比值測定: "4544-3",
  血球比容值: "4544-3",
  血球比容值測定: "4544-3",
  血球比容: "4544-3",
  血比容: "4544-3",
  紅血球容積: "4544-3", // alt phrasing — RBC volume = hematocrit
  hct: "4544-3",
  ht: "4544-3",
  "h.t.": "4544-3",
  "h.t": "4544-3",
  "%ht": "4544-3",
  // RBC — period-separated abbrev added
  紅血球: "789-8",
  rbc: "789-8",
  "r.b.c": "789-8",
  // WBC — period-separated abbrev added
  白血球: "6690-2",
  wbc: "6690-2",
  "w.b.c": "6690-2",
  // Platelet
  platelet: "777-3",
  血小板: "777-3",
  plt: "777-3",
  // CBC indices — period-separated abbrev forms added v0.11.4.
  // Order matters: longer "m.c.h.c" must register before "m.c.h"
  // is even considered (_findLongestMatch picks longest match
  // regardless of insertion order, so insertion order here is for
  // readability only).
  "m.c.v": "787-2",
  "m.c.h.c": "786-4",
  "m.c.h": "785-6",
  // ── v0.12.1 (SMART app dev bug 5'/6'/7' 2026-05-29): explicit
  // "EN(中文)" parenthetical variants from the 2024-01-22 hospital's
  // CBC display format. Same rationale as the CBC_DIFF_KEYS additions
  // above: guarantee longest-match wins over panel-default fallback.
  "mcv(平均紅血球容積)": "787-2",
  "mch(平均紅血球血色素)": "785-6",
  "mchc(平均紅血球濃度)": "786-4",
  "mchc(平均紅血球血色素濃度)": "786-4",
  "rdw(紅血球分布寬度)": "788-0",
  "rdw(平均紅血球寬度)": "788-0", // observed variant in user's bundle
  "rdw(紅血球分佈寬度)": "788-0",
  "wbc(白血球計數)": "6690-2",
  "rbc(紅血球計數)": "789-8",
  "hb(血紅素)": "718-7",
  "hb(血色素)": "718-7",
  "hgb(血紅素)": "718-7",
  "hgb(血色素)": "718-7",
  "hct(血球容積比)": "4544-3",
  "ht(血球容積比)": "4544-3",
  "platelet(血小板)": "777-3",
  "plt(血小板)": "777-3",
  // ── v0.11.11 (SMART app dev bug 5 2026-05-29): variants observed
  // in user's v0.11.9 bundle that previously fell through to global
  // LOINC_MAP "紅血球" → 789-8 (RBC count) — 5 distinct CBC indices
  // all wrongly tagged as RBC count (48 records).
  //
  // 紅血球分**佈**變異數 (LIS variant of 紅血球分**布**寬度) → RDW.
  //   LOINC 788-0 already verified v0.11.4.
  // 紅血球**平均**容積 (word order variant of **平均**紅血球容積) → MCV.
  //   LOINC 787-2 already verified.
  // 紅血球色素 → MCH (mean corpuscular hemoglobin).
  //   LOINC 785-6 already verified.
  // 紅血球色素濃度 → MCHC. LOINC 786-4 already verified.
  // Add 變異 + 體積 cross variants for robustness against future LIS
  // quirks; longest-match semantics keep RBC ("紅血球") from winning
  // over the longer compound keys.
  紅血球分佈變異數: "788-0",
  紅血球分布變異數: "788-0", // 布 variant
  紅血球分布變異: "788-0",
  紅血球分佈變異: "788-0",
  紅血球體積分佈: "788-0",
  紅血球體積分布: "788-0",
  紅血球平均容積: "787-2",
  紅血球平均體積: "787-2",
  紅血球色素濃度: "786-4", // MCHC (must precede 紅血球色素 for longest-match clarity)
  紅血球色素: "785-6", // MCH
  紅血球平均血色素濃度: "786-4",
  紅血球平均血色素: "785-6",
};

// ── CBC differential display keys (shared) ───────────────
// Source of truth for CBC diff (Neut/Lym/Mono/Eos/Bas) percentage
// LOINCs. Originally inlined in PANEL_LOINC_MAP["08013C"] only —
// extracted v0.9.10 Part 6 after SMART app dev reported 中國北港醫
// billing the differential rows under 08002C (WBC count code) instead
// of 08013C (CBC w/ diff code). Hospitals bill the differential rows
// under whatever CBC code their LIS uses, so the diff keys must
// be available under EVERY CBC sibling code, not just 08013C.
// Each LOINC = "/100 leukocytes" (percentage) form, distinct from
// absolute-count series (e.g. 711-2 eosinophil count under 08010C).
const CBC_DIFF_KEYS: Record<string, string> = {
  // Neutrophil + Taiwan variants (incl. v0.9.10 Part 4 "Segment" fix
  // + v0.11.4 audit additions: bare "Neut" / "Neut." short forms +
  // 多核球 / 多形核球 alternate CJK terms — Taiwan haematology textbook
  // synonyms for neutrophil).
  "neutrophilic segment": "770-8", // Neutrophils/100 leukocytes
  neutrophil: "770-8",
  neutrophils: "770-8",
  segmented: "770-8",
  segment: "770-8",
  segments: "770-8",
  seg: "770-8",
  "seg.": "770-8",
  neut: "770-8",
  "neut.": "770-8",
  "neut. seg": "770-8",
  "neut seg": "770-8",
  嗜中性白血球: "770-8",
  嗜中性球: "770-8",
  中性球: "770-8",
  多核球: "770-8",
  多形核球: "770-8",
  // Lymphocyte — v0.11.4 audit added "Lym" / "Lym." / "Lymph" / "Lymph."
  // / "Lymph cell" short forms + bare 淋巴 CJK.
  lymphocyte: "736-9", // Lymphocytes/100 leukocytes
  lymphocytes: "736-9",
  "lymph cell": "736-9",
  lymph: "736-9",
  "lymph.": "736-9",
  lym: "736-9",
  "lym.": "736-9",
  淋巴白血球: "736-9",
  淋巴球: "736-9",
  淋巴細胞: "736-9",
  淋巴: "736-9",
  // Monocyte
  monocyte: "5905-5", // Monocytes/100 leukocytes
  monocytes: "5905-5",
  單核白血球: "5905-5",
  單核球: "5905-5",
  // Eosinophil (% form in CBC diff context, NOT 711-2 #/vol)
  eosinophil: "713-8",
  eosinophils: "713-8",
  嗜酸性白血球: "713-8",
  嗜酸: "713-8",
  嗜伊紅性白血球: "713-8",
  嗜伊紅: "713-8",
  // Basophil
  basophil: "706-2",
  basophils: "706-2",
  嗜鹼性白血球: "706-2",
  嗜鹼: "706-2",
  // v0.12.1 (SMART app dev bug 5'/6'/7' 2026-05-29): one hospital
  // (2024-01-22 records) ships CBC diff displays in the format
  // "EN(中文)" — e.g. "Basophils(嗜鹼性白血球)". Existing keys
  // SHOULD match via _findLongestMatch substring on the EN part,
  // but the user's v0.11.13 bundle showed these rows routing to
  // 6690-2 (panel-default WBC). Adding explicit parenthetical
  // variants as the longest matching keys guarantees the right
  // routing regardless of which code path the rows take.
  "basophils(嗜鹼性白血球)": "706-2",
  "basophil(嗜鹼性白血球)": "706-2",
  "eosinophils(嗜酸性白血球)": "713-8",
  "eosinophil(嗜酸性白血球)": "713-8",
  "lymphocytes(淋巴白血球)": "736-9",
  "lymphocyte(淋巴白血球)": "736-9",
  "monocytes(單核白血球)": "5905-5",
  "monocyte(單核白血球)": "5905-5",
  "neutrophilic segment(嗜中性白血球)": "770-8",
  "neutrophil(嗜中性白血球)": "770-8",
  "neutrophils(嗜中性白血球)": "770-8",
  "segment(嗜中性白血球)": "770-8",
  // ── Maturation-stage neutrophils (v0.11.11) ────────────────────
  // SMART app dev bug 2 + 6 2026-05-29: Metamyelocyte ("後骨髓球") and
  // Band ("帶狀嗜中性白血球") rows were falling to the panel LOINC
  // 57021-8 (CBC W Diff panel) or 770-8 (Segment neutrophils). Both
  // are immature neutrophil maturation stages distinct from total /
  // segmented neutrophils; each has its own LOINC verified at
  // loinc.org 2026-05-29:
  //   740-1  Metamyelocytes/Leukocytes in Blood by Manual count (NFr)
  //   764-1  Band form neutrophils/Leukocytes in Blood by Manual count (NFr)
  // Adding to CBC_DIFF_KEYS so they're available under every CBC
  // sibling code (08002C/08003C/08004C/08006C/08011C/08013C).
  metamyelocyte: "740-1",
  metamyelocytes: "740-1",
  "meta-myelocyte": "740-1",
  "meta myelocyte": "740-1",
  後骨髓球: "740-1",
  band: "764-1",
  bands: "764-1",
  "band form": "764-1",
  "band cell": "764-1",
  帶狀嗜中性白血球: "764-1",
  帶狀: "764-1",
  桿狀核: "764-1", // alt name 桿狀核細胞
};

// ── Urine biochemistry display keys (shared) ─────────────
// Source of truth for analytes commonly billed under urine creatinine
// codes (09016C / 12111C) when hospitals report a UACR (urine albumin/
// creatinine ratio) workup. The two-leg ratio measurement is sometimes
// billed entirely under the creatinine code with the actual analyte
// distinguished only by display text. Without this disambiguation a
// row displayed "Micro Albumin" with billing 09016C returns LOINC
// 2161-8 (urine creatinine) — Microalbumin values land in Creatinine
// column. v0.9.10 Part 6 bug N2 fix.
const URINE_BIOCHEM_KEYS: Record<string, string> = {
  // Microalbumin variants (specimen + analyte)
  "micro-albumin": "14957-5", // Microalbumin Mass/vol Urine
  microalbumin: "14957-5",
  "micro albumin": "14957-5",
  "u-malb": "14957-5",
  "malb(u)": "14957-5",
  "malb.": "14957-5",
  malb: "14957-5",
  微小白蛋白: "14957-5",
  尿微量白蛋白: "14957-5",
  尿白蛋白: "14957-5",
  // UACR (Microalbumin/Creatinine ratio Urine)
  uacr: "14959-1",
  "u-acr": "14959-1",
  "alb/cre": "14959-1",
  "albumin/creatinine": "14959-1",
  // Urine creatinine variants
  "urine creatinine": "2161-8",
  "creatinine urine": "2161-8",
  "creatinine(u)": "2161-8",
  "u-cre": "2161-8",
  "u-crea": "2161-8",
  尿液肌酸酐: "2161-8",
  尿肌酸酐: "2161-8",
  creatinine: "2161-8", // bare — within 09016C/12111C scope, default to urine
  crea: "2161-8",
  肌酸酐: "2161-8",
};

// ── _PANEL_LOINC_MAP ──────────────────────────────────────
// Panel-specific display → LOINC overrides. These run BEFORE the global
// _LOINC_MAP so that urine bilirubin under 06013C maps to 5770-3 (urine
// specimen) instead of being shadowed by the global 'bilirubin' that
// would imply serum, and analogous specimen-aware disambiguation for
// other panel sub-items. Keys are NHI panel codes (must also be in
// _DISPLAY_FIRST_CODES); values are display-keyword → LOINC dicts that
// follow the same matching semantics as _LOINC_MAP (leading word
// boundary for ASCII, substring for CJK).
export const PANEL_LOINC_MAP: Record<string, Record<string, string>> = {
  // ── Urinalysis (06013C) ──────────────────────────────
  // All routine dipstick items reside on a single NHI billing code.
  // Without this table they'd all collapse to the panel LOINC 24356-8,
  // losing per-item granularity that's clinically useful (e.g.
  // bilirubin vs urobilinogen for liver workup).
  "06013C": {
    // Order matters: longer/more-specific keys before generic ones
    // (matches _LOINC_MAP iteration semantics — first hit wins).
    "specific gravity": "5811-5", // Specific gravity Urine
    "sp.gravity": "5811-5",
    "sp gravity": "5811-5",
    比重: "5811-5",
    "micro-albumin": "14957-5", // Microalbumin Mass/vol Urine
    microalbumin: "14957-5",
    "malb(u)": "14957-5",
    malb: "14957-5",
    微小白蛋白: "14957-5",
    // v0.12.1 (caught during v0.11.7 test re-run after LOINC_SHORT_TEXT
    // for 20454-5 was added — both 微白蛋白 displays were silently
    // routing to bare "蛋白" → 20454-5 (urine protein) instead of
    // their correct microalbumin/UACR LOINCs). Longer specific keys
    // ensure correct routing via _findLongestMatch.
    微白蛋白: "14957-5",
    "微白蛋白(尿)": "14957-5",
    "微白蛋白(尿)(半定量)": "14957-5",
    "微白蛋白(尿液)": "14957-5",
    尿微量白蛋白: "14957-5",
    尿白蛋白: "14957-5",
    "u-malb": "14957-5",
    uacr: "14959-1", // Microalbumin/Creatinine ratio Urine
    "微白蛋白/肌酐酸比值": "14959-1",
    "微白蛋白/肌酐酸比值(半定量)": "14959-1",
    "肌酐酸比值": "14959-1",
    "肌酸酐比值": "14959-1",
    "alb/cre": "14959-1",
    "albumin/creatinine": "14959-1",
    "u-acr": "14959-1",
    "urine glucose": "5792-7",
    sugar: "5792-7", // NHI '尿糖' / 'Sugar' under 06013C
    尿糖: "5792-7",
    urobilinogen: "5818-0", // Urobilinogen Urine Ql
    尿膽素原: "5818-0",
    bilirubin: "5770-3", // Bilirubin Urine Ql
    尿膽紅素: "5770-3",
    // v0.13.1 (LOINC-based dedup migration audit 2026-05-30): bare
    // "膽紅素" was missing — only the 尿- prefixed form was registered.
    // PANEL_LOINC_MAP is code-scoped to 06013C urinalysis context, so
    // adding the bare term here doesn't cross-pollute serum 膽紅素 (which
    // routes via 09029C → NHI_TO_LOINC = 1975-2).
    // WebFetch loinc.org/5770-3 verified 2026-06-02: Long Common Name
    // "Bilirubin.total [Presence] in Urine by Test strip" — Component
    // Bilirubin / Property PrThr / System Urine / Scale Ord / Method
    // Test strip → correct urine-dipstick context for 06013C. ✅
    膽紅素: "5770-3",
    nitrite: "5802-4", // Nitrite Urine
    亞硝酸: "5802-4",
    ketones: "5797-6", // Ketones Urine
    ketone: "5797-6",
    酮體: "5797-6",
    protein: "20454-5", // Protein Mass/vol Urine
    尿蛋白: "20454-5",
    蛋白: "20454-5",
    leukocyte: "5799-2", // Leukocytes Urine
    leu: "5799-2",
    白血球酯酶: "5799-2",
    // v0.11.11 (SMART app dev bug 7 2026-05-29): variant character 脢
    // (not 酶) observed under 06013C in user's v0.11.9 bundle. Without
    // this entry path-B missed and fell to global LOINC_MAP "白血球" →
    // 6690-2 (blood WBC count) — wrong specimen + wrong analyte (4
    // records affected).
    白血球酯脢: "5799-2",
    白血球脂酶: "5799-2", // also seen — 脂 vs 酯
    白血球脂脢: "5799-2",
    白血球酯類: "5799-2", // observed in some HIS as descriptive name
    blood: "5794-3", // Hemoglobin Urine Ql
    潛血: "5794-3",
    色: "5778-6", // Color of Urine (CJK substring)
    color: "5778-6",
    turbidity: "5767-9", // Appearance of Urine
    appearance: "5767-9",
    外觀: "5767-9",
    // v0.13.1 (app dev urinalysis A/B audit 2026-06-02): NHI B-channel
    // ships "濁度" where A-channel ships "Turbidity". Without this key
    // 濁度 fell to path-C panel default 24356-8 (Urinalysis complete
    // panel) → diverged from Turbidity's 5767-9 → looked like a dup pair
    // AND carried the wrong LOINC. WebFetch loinc.org/5767-9 verified
    // 2026-06-02: Long Common Name "Appearance of Urine" — System Urine,
    // Property Aper, Scale Nom. Taiwan urinalysis 濁度/Turbidity is the
    // standard urine appearance/clarity test. ✅
    濁度: "5767-9",
    ph: "5803-2", // pH of Urine (urine-specific, NOT
    // the arterial 11558-4 that the
    // global map points to)
    酸鹼度: "5803-2",
    // v0.13.1 (same audit): B-channel "酸鹼值" vs A-channel "pH". Note
    // 酸鹼值 (值) ≠ 酸鹼度 (度) — only the latter was registered, so 酸鹼值
    // fell to panel default 24356-8. Code-scoped to 06013C so no clash
    // with 09041B ABG's "酸鹼值" → 11558-4 (arterial pH). WebFetch
    // loinc.org/5803-2 verified 2026-06-02: "pH of Urine by Test strip"
    // — Component pH, System Urine. ✅
    酸鹼值: "5803-2",
    glucose: "5792-7", // Last in this block so 'urine
    // ── v0.11.4 audit — Taiwan dipstick abbrev variants ──
    // Without these the abbreviated displays ("Bili" / "KET" / "OB" /
    // "NIT" / "UBG" / "URO" / "SG" / "Colour" / "WBC esterase") fell
    // to path-C and got LOINC 24356-8 (Urinalysis panel). Some also
    // shadowed by global LOINC_MAP keys (e.g. "WBC esterase" matched
    // global "wbc" → 6690-2 BLOOD WBC, wrong specimen).
    "u-bili": "5770-3",
    bili: "5770-3",
    ket: "5797-6",
    ob: "5794-3",
    "ob.": "5794-3",
    "occult blood": "5794-3",
    nit: "5802-4",
    ubg: "5818-0",
    uro: "5818-0",
    sg: "5811-5",
    "s.g": "5811-5",
    colour: "5778-6", // UK spelling
    "wbc esterase": "5799-2", // blocks global "wbc" → 6690-2 shadow
    // v0.12.2 (SMART app dev v0.12.1 audit 2026-05-29): hospital
    // 長庚嘉義 ships urine creatinine rows under NHI 06013C (尿生化
    // panel) — NOT under 09015C as the v0.12.1 fix targeted. Without
    // explicit urine variants here, "肌酸酐(尿液)(半定量)" routed via
    // LOINC_MAP global "肌酸酐" → 2160-0 serum LOINC under 06013C
    // billing (4 rows affected in user's v0.12.1 bundle). Mirror the
    // same urine creatinine variants from PANEL_LOINC_MAP["09015C"]
    // — longest-match guarantees urine LOINC 2161-8 wins over generic.
    "肌酸酐(尿液)(半定量)": "2161-8",
    "肌酸酐(尿液)": "2161-8",
    "肌酸酐(尿)": "2161-8",
    "肌酸酐(u)": "2161-8",
    // ASCII keys ending in ")" fail \b regex boundary at end of match
    // (same \b-non-word-char-no-boundary issue documented in v0.11.13
    // APTT ratio fix). Use opening-paren-only form so \b at end fires
    // on the word char preceding ")" — "creatinine(u" matches inside
    // "creatinine(u)" with \b after "u".
    "creatinine(u": "2161-8",
    "creatinine(urine": "2161-8",
    // v0.13.1 (app dev urinalysis A/B audit 2026-06-02): A-channel ships
    // the abbreviation "CREA(U)(半定量)" — "creatinine(u" did NOT match
    // (no "creatinine" substring in "crea(u)"), so it fell to global
    // LOINC_MAP "crea" → 2160-0 SERUM creatinine while the B-channel
    // "肌酸酐(尿液)" correctly got urine 2161-8. Add the abbreviated
    // opening-paren form. Same verified LOINC 2161-8 "Creatinine
    // [Mass/volume] in Urine" — WebFetch loinc.org/2161-8 confirmed
    // 2026-06-02 (System Urine). ✅
    "crea(u": "2161-8",
    "crea(urine": "2161-8",
    "u-creatinine": "2161-8",
    "urine creatinine": "2161-8",
    "creatinine, urine": "2161-8",
  },

  // ── ABG panel (09041B) ───────────────────────────────
  // 09041B has DISPLAY_FIRST_CODES but no PANEL_LOINC_MAP entry until
  // v0.11.4 — relied on global LOINC_MAP for routing, which works for
  // the canonical abbreviations (pH/pCO2/pO2/HCO3/TCO2/SaO2) but
  // missed period-separated forms (P.CO2 / T.CO2 / p.H.) + Chinese
  // descriptive names (酸鹼值 / 二氧化碳分壓 / 氧分壓 / 血氧飽和度).
  // Panel-scoped table now covers Taiwan LIS variants. Global entries
  // kept for backward compat (Mode A bundles older than v0.11.4 may
  // still rely on global path).
  "09041B": {
    // pH variants
    "p.h.": "11558-4",
    "p.h": "11558-4",
    酸鹼值: "11558-4",
    // pCO2 variants
    "p.co2": "2019-8",
    二氧化碳分壓: "2019-8",
    // pO2 variants
    氧分壓: "2703-7",
    // HCO3 variants
    "hco3-": "1959-6",
    碳酸氫根: "1959-6",
    重碳酸: "1959-6",
    // TCO2 variants
    "t.co2": "2028-9",
    "total co2": "2028-9",
    "total carbon dioxide": "2028-9",
    // SaO2 / O2 saturation variants
    "o2 saturation": "2713-6",
    "o2 sat": "2713-6",
    saturation: "2713-6",
    血氧飽和度: "2713-6",
  },

  // ── CBC basic panel (08011C) ─────────────────────────
  // NHI 08011C bills the basic CBC items (RBC + indices, HGB, HCT,
  // PLT, WBC). Without per-item LOINCs under the panel, MCV / MCHC /
  // RDW were being shadowed:
  //   • MCV "平均紅血球容積" → matched global "紅血球" → 789-8 (RBC) ✗
  //   • MCHC "MCHC" → no key matched → fell back to panel 24317-0 ✗
  //   • RDW → no key matched → fell back to panel 24317-0 ✗
  //   • Basophil / Lymphocyte / Monocyte → fell to "白血球" → 6690-2 ✗
  // Panel-scoped table runs BEFORE the global one so the longer,
  // specific CJK / ASCII keys win. All LOINCs verified at loinc.org
  // (Long Common Name documented inline). Bug report 2026-05-27.
  "08011C": {
    // RBC indices — longer CJK keys first so they beat the bare
    // "紅血球" key in the global LOINC_MAP path. (longest-key-wins
    // semantics in _findLongestMatch make insertion order irrelevant
    // within this dict but readability still benefits.)
    平均紅血球容積: "787-2", // MCV — Erythrocyte mean corpuscular volume
    平均紅血球體積: "787-2",
    mcv: "787-2",
    平均紅血球血色素濃度: "786-4", // MCHC — Erythrocytes mean corpuscular HGB concentration
    mchc: "786-4",
    平均紅血球血色素: "785-6", // MCH — Erythrocyte mean corpuscular hemoglobin
    mch: "785-6",
    紅血球分布寬度: "788-0", // RDW — Erythrocyte distribution width
    紅血球體積分佈寬度: "788-0",
    rdw: "788-0",
    // CBC basic counts — shared with the single-analyte billing codes
    // (08002C / 08003C / 08004C / 08006C) below; see
    // CBC_COMPONENT_KEYS const below for the source of truth.
    ...CBC_COMPONENT_KEYS,
    // v0.12.2 (SMART app dev v0.12.1 audit 2026-05-29): hospital
    // 中國北港醫 ships CBC differential rows under BOTH 08013C (CBC W
    // diff billing) AND 08011C (CBC-8項 umbrella billing) for the
    // same draw. v0.11.11 spread CBC_DIFF_KEYS into 08013C but NOT
    // into 08011C — so the 08011C-billed diff rows still fell back
    // to panel-default 6690-2 (WBC count) for all diff cells. Mirror
    // the spread so per-analyte LOINCs (706-2 Basophils / 713-8
    // Eosinophils / 736-9 Lymphocytes / 770-8 Neutrophils / 5905-5
    // Monocytes / 740-1 Metamyelocyte / 764-1 Band) win regardless
    // of which CBC NHI code the hospital bills under.
    ...CBC_DIFF_KEYS,
  },

  // ── CBC sibling billing codes (v0.9.10 Part 5 + Part 6) ──
  // Single-analyte billing codes promoted to display-first so when a
  // hospital LIS swaps display vs code (e.g. row billed 08004C HCT
  // but display text reads "HGB"), the unambiguous display wins. Each
  // sibling spreads BOTH CBC_COMPONENT_KEYS (basic counts) AND
  // CBC_DIFF_KEYS (differential percentages) — hospitals bill the
  // diff rows under whatever CBC code their LIS uses (中國北港醫
  // observed billing diff under 08002C WBC count; bug report Part 6
  // bug N3). Fallback path C still hits NHI_TO_LOINC entry for empty/
  // unrecognised displays.
  "08002C": { ...CBC_COMPONENT_KEYS, ...CBC_DIFF_KEYS }, // WBC count billing
  "08003C": { ...CBC_COMPONENT_KEYS, ...CBC_DIFF_KEYS }, // Hemoglobin billing
  "08004C": { ...CBC_COMPONENT_KEYS, ...CBC_DIFF_KEYS }, // Hematocrit billing
  "08006C": { ...CBC_COMPONENT_KEYS, ...CBC_DIFF_KEYS }, // Platelet count billing

  // ── Urine creatinine sibling codes (v0.9.10 Part 6 N2) ──
  // See URINE_BIOCHEM_KEYS const docstring. When hospital bills UACR
  // workup under 09016C / 12111C, the actual analyte (microalbumin
  // vs creatinine vs UACR ratio) is distinguished only by display.
  "09016C": URINE_BIOCHEM_KEYS,
  "12111C": URINE_BIOCHEM_KEYS,

  // ── Serum protein electrophoresis (09065B; v0.10.0) ─────
  // SPE reports 5 fractions (Albumin / α1 / α2 / β / γ globulins) plus
  // A/G ratio. Each fraction has its own LOINC verified at loinc.org.
  // Previously all 6 sub-rows collapsed to 90991-1 (SPE panel LOINC) —
  // SMART app pivot-by-LOINC merged everything into one column.
  "09065B": {
    // Specific fractions — long names first (longest-match wins)
    "alpha-1 globulin": "2867-3",
    "alpha 1 globulin": "2867-3",
    "α1-globulin": "2867-3",
    α1: "2867-3",
    "alpha-2 globulin": "2868-1",
    "alpha 2 globulin": "2868-1",
    "α2-globulin": "2868-1",
    α2: "2868-1",
    "beta globulin": "2869-9",
    "β-globulin": "2869-9",
    β: "2869-9",
    "gamma globulin": "2871-5",
    "γ-globulin": "2871-5",
    γ: "2871-5",
    "a/g ratio": "1759-0", // Albumin/Globulin ratio
    "a/g": "1759-0",
    "alb/glb": "1759-0",
    // v0.11.11 (SMART app dev bug 3a 2026-05-29): Total Protein (T.P)
    // row was inheriting the SPE panel LOINC 90991-1. T.P is the total
    // serum protein measurement, distinct LOINC.
    // 2885-2 verified at loinc.org 2026-05-29:
    //   Component=Protein, Property=MCnc, System=Ser/Plas (Class=CHEM)
    "total protein": "2885-2",
    "t.p": "2885-2",
    "t. p": "2885-2",
    "t p": "2885-2",
    tp: "2885-2",
    總蛋白: "2885-2",
    血清總蛋白: "2885-2",
    總蛋白質: "2885-2",
    albumin: "2865-7", // Albumin in SPE context (Sercon-MoMt/MS)
    白蛋白: "2865-7",
    alb: "2865-7",
  },

  // ── Flow cytometry CD markers (12204B; v0.10.0) ─────────
  // Lymphocyte surface markers — each CD subtype has its own LOINC.
  // Previously all CD3/CD4/CD8/CD19/CD56/ratio rows collapsed to
  // 20584-9 (Lymphocyte subset panel). Critical for HIV monitoring
  // (CD4 absolute count is the actionable indicator).
  "12204B": {
    // v0.11.4 audit fix: trailing "+" in keys breaks \b regex boundary
    // (+ is non-word, end-of-string after non-word has no \b). Keys
    // dropped trailing + so "CD3+/CD4+" display still matches via the
    // "cd3+/cd4" prefix substring. Keys with leading + and bare CD#
    // also need careful ordering — _findLongestMatch picks longest
    // match, so combined ratio keys must outrank bare cd3/cd4/cd8 by
    // length to avoid CD3 winning over the CD3+/CD4+ ratio entry.
    "cd3+/cd4": "8123-2", // CD3+/CD4+ ratio → CD4 helper LOINC
    "cd3+/cd8": "8128-1", // CD3+/CD8+ ratio → CD8 helper LOINC
    "cd4/cd8 ratio": "54218-3",
    "cd4/cd8": "54218-3",
    "cd8/cd4": "54218-3",
    "cd16+cd56": "8112-5",
    "cd16/cd56": "8112-5",
    cd3: "8124-0", // CD3 #/area in Blood
    cd4: "8123-2", // CD4 #/area in Blood
    cd8: "8128-1", // CD8 #/area in Blood
    cd19: "8118-2", // CD19 #/area in Blood (B cell)
    cd16: "8112-5", // CD16 + CD56 (NK cell)
    cd56: "8125-7", // CD56 #/area in Blood (NK cell)
  },

  // ── DLCO (17009B; v0.10.0) ──────────────────────────────
  // Carbon monoxide diffusing capacity test — reports DLCO + alveolar
  // volume (VA) + DLCO/VA ratio as 3 sub-rows. LOINCs verified at
  // loinc.org. Pulmonary function rarely surfaces in 健康存摺 but the
  // panel exists for completeness.
  "17009B": {
    "dlco/va": "19911-7", // DLCO/VA ratio
    "dlco/alveolar volume": "19911-7",
    "kco": "19911-7", // Transfer coefficient (same as DLCO/VA)
    dlco: "24341-0", // Diffusing capacity for CO
    "dlco sb": "24341-0", // Single-breath variant
    一氧化碳肺瀰散量: "24341-0",
    "va": "19850-7", // Alveolar volume
    "alveolar volume": "19850-7",
    "肺泡容積": "19850-7",
  },

  // ── Serum creatinine + eGFR piggyback (09015C) ──────
  // NHI bills creatinine under 09015C; Taiwan labs auto-calculate eGFR
  // (CKD-EPI / MDRD) and append it as a separate sub-row using the
  // SAME 09015C billing code, distinguished only by display text.
  // Without this panel-scoped table, every 09015C row inherited LOINC
  // 2160-0 (serum creatinine) and SMART apps routed eGFR values into
  // the creatinine column — patient-safety issue (eGFR=33 displayed as
  // CREA=33 mg/dL is instantly mistaken for acute kidney failure).
  //
  // MDRD (33914-3) is the default per Taiwan KDIGO guidelines. Newer
  // CKD-EPI formulas (62238-1, 88293-6, 98979-8) covered as well so a
  // single panel entry handles whichever formula the lab uses. The
  // explicit creatinine entries are duplicated from the global LOINC_MAP
  // so the panel is self-contained.
  "09015C": {
    egfr: "33914-3", // eGFR — Glomerular filtration rate (MDRD default)
    "estimated gfr": "33914-3",
    "estimated glomerular filtration rate": "33914-3",
    "glomerular filtration rate": "33914-3",
    "gfr-est": "33914-3", // v0.11.4 audit
    "gfr est": "33914-3",
    腎絲球過濾率: "33914-3",
    估算腎絲球過濾率: "33914-3",
    creatinine: "2160-0",
    crea: "2160-0",
    肌酸酐: "2160-0",
    肌酐酸: "2160-0",
    血中肌酸酐: "2160-0",
    // v0.12.1 (SMART app dev bug 10 2026-05-29): some hospitals bill
    // urine creatinine under serum-billing code 09015C with the
    // display annotating "(尿液)". Without explicit urine variants
    // here, longest-match returns the bare "肌酸酐" key → 2160-0
    // serum LOINC even though the row is urine. Longer urine-
    // annotated keys win. 2161-8 = "Creatinine [Mass/volume] in
    // Urine" (verified at loinc.org/2161-8/ earlier).
    "肌酸酐(尿液)(半定量)": "2161-8",
    "肌酸酐(尿液)": "2161-8",
    "肌酸酐(尿)": "2161-8",
    "肌酸酐(u)": "2161-8",
    // ASCII keys ending in ")" fail \b regex boundary at end of match
    // (same \b-non-word-char-no-boundary issue documented in v0.11.13
    // APTT ratio fix). Use opening-paren-only form so \b at end fires
    // on the word char preceding ")" — "creatinine(u" matches inside
    // "creatinine(u)" with \b after "u".
    "creatinine(u": "2161-8",
    "creatinine(urine": "2161-8",
    // v0.13.1 (app dev urinalysis A/B audit 2026-06-02): A-channel ships
    // the abbreviation "CREA(U)(半定量)" — "creatinine(u" did NOT match
    // (no "creatinine" substring in "crea(u)"), so it fell to global
    // LOINC_MAP "crea" → 2160-0 SERUM creatinine while the B-channel
    // "肌酸酐(尿液)" correctly got urine 2161-8. Add the abbreviated
    // opening-paren form. Same verified LOINC 2161-8 "Creatinine
    // [Mass/volume] in Urine" — WebFetch loinc.org/2161-8 confirmed
    // 2026-06-02 (System Urine). ✅
    "crea(u": "2161-8",
    "crea(urine": "2161-8",
    "u-creatinine": "2161-8",
    "urine creatinine": "2161-8",
    "creatinine, urine": "2161-8",
  },

  // ── PT/INR panel (08026C) ────────────────────────────
  // Taiwan labs bill PT (seconds) and INR (ratio) under the SAME 08026C
  // code, distinguished only by display string. Without this panel
  // table both rows mapped to LOINC 6301-6 (INR); a warfarin trend
  // view would plot a PT=12 sec point as INR=12 (instant overdose
  // alarm) or merge PT and INR into one series. Each LOINC verified
  // at loinc.org:
  //   5902-2  Prothrombin time (PT) in Platelet poor plasma by
  //           Coagulation assay
  //   6301-6  INR in Platelet poor plasma by Coagulation assay
  //   5894-1  Prothrombin time (PT) Control in Platelet poor plasma
  //           by Coagulation assay
  // Order is longest-key-wins inside _findLongestMatch so insertion
  // order doesn't matter, but readability benefits from
  // longest-specific first.
  "08026C": {
    "international normalized ratio": "6301-6",
    // v0.11.9 (SMART app dev report 2026-05-29 + loinc.org audit):
    // 5894-1's canonical name is "Prothrombin time (PT) actual/Normal"
    // — Component=Prothrombin time actual/Normal, Property=RelTime
    // (a RATIO, not a control reading). Earlier v0.9.10 mapping of
    // "PT control" / "對照" / "對照組" / "prothrombin time control"
    // → 5894-1 was based on the misread that 5894-1 was a "control"
    // LOINC. It is NOT — these displays describe lab QC control plasma
    // readings, which have no clinical LOINC fit and are already
    // candidates for the QC filter (looksLikeQcControl). Removing the
    // wrong LOINC mapping so any "Control PT" rows that slip past the
    // QC filter fall back to NHI-coding-only, rather than being
    // mis-labelled as a PT-ratio analyte.
    "prothrombin time": "5902-2",
    "pt (sec)": "5902-2",
    "pt sec": "5902-2",
    "pt-sec": "5902-2",
    凝血酶原時間: "5902-2",
    凝血時間: "5902-2",
    // Bug report 2026-05-27 v0.11.1: 長庚嘉義 LIS prints "P.T" (dot-
    // separated initials). `_keywordMatches` uses \b...\b regex on
    // ASCII keys, and the period in "p.t" breaks the implicit word
    // boundary that "pt" relied on — so `pt` key never matched and
    // path-C fallback returned NHI_TO_LOINC = 6301-6 (INR) for a
    // 11.9 sec PT measurement. Patient-safety-adjacent: SMART app
    // would plot 11.9 in the INR column (looks like fatal INR=11.9
    // → emergency reversal). Adding period-separated variants.
    "p.t": "5902-2",
    "p . t": "5902-2",
    "p t": "5902-2",
    inr: "6301-6",
    pt: "5902-2",
  },

  // ── APTT panel (08036C) ──────────────────────────────
  // Taiwan labs bill TWO sub-rows under 08036C:
  //   1. "APTT" / "活化部份凝血活酶時間" — value in seconds (~25-35 sec
  //      normal). LOINC 14979-9 (aPTT in PPP, Property=Time).
  //   2. "Heparin治療範圍參考倍數" / "APTT data/mean" / "APTT actual/normal"
  //      — ratio (patient APTT / lab normal mean), value ~1.0 ± dimensionless.
  //      LOINC 63561-5 (aPTT actual/normal in PPP, Property=RelTime).
  // Before v0.11.9 BOTH rows mapped to 14979-9 — a ratio value of 1.08
  // displayed under APTT-time column would read as fatally low APTT
  // (normal lower bound ~25 sec), or render seconds units on a unitless
  // ratio. SMART app dev report 2026-05-29.
  //
  // LOINC verified at loinc.org (2026-05-29):
  //   14979-9 Component=aPTT, Property=Time, System=PPP (seconds)
  //   63561-5 Component=aPTT actual/normal, Property=RelTime, System=PPP (ratio)
  //
  // Longest-key-wins via _findLongestMatch — so the longer ratio
  // synonyms get priority over the bare "APTT" → time fallback when
  // a row's display contains both substrings.
  "08036C": {
    // Ratio variants — Taiwan LIS shows "Heparin治療範圍參考倍數"
    // (Heparin therapeutic range reference multiplier) when reporting
    // the APTT ratio for heparin monitoring. Also "APTT data/mean"
    // (denominator-explicit form) and "actual/normal" verbiage.
    heparin治療範圍參考倍數: "63561-5",
    heparin治療範圍: "63561-5",
    治療範圍參考倍數: "63561-5",
    參考倍數: "63561-5",
    "aptt data/mean": "63561-5",
    "aptt actual/normal": "63561-5",
    "aptt ratio": "63561-5",
    "aptt mean": "63561-5",
    // v0.11.13: parenthesised variant ("APTT (ratio)" with space + paren)
    // observed in v0.11.10 lockdown test. \b-bounded "aptt (ratio)" key
    // doesn't match at the trailing ")" (non-word char has no \b before
    // end of string). Workaround: add bare "ratio" key — \b around the
    // ASCII word "ratio" matches even inside parens, longest-match wins
    // over bare "aptt" (5 chars > 4). Combined with "{ratio}" unit
    // pre-canonicalisation, this routes the ratio analyte cleanly.
    ratio: "63561-5",
    "aptt-ratio": "63561-5",
    // Bare time variants — fall through to seconds LOINC.
    aptt: "14979-9",
    "a.p.t.t": "14979-9",
    活化部份凝血活酶時間: "14979-9",
    部份凝血活酶時間: "14979-9",
    凝血活酶時間: "14979-9",
  },

  // ── Synovial / body-fluid panel (16008C) ─────────────
  // 16008C bills the full body-fluid analysis: appearance / color /
  // WBC count / differential. Each sub-item has its own specimen-
  // aware LOINC. Panel-scoped table runs before the global one so
  // shorter generic keys (e.g. global "wbc" → 6690-2 blood WBC)
  // can't shadow the body-fluid specific LOINCs. Each LOINC verified
  // at loinc.org:
  //   5778-6  Color of Urine (re-used for body-fluid color; cell-counter
  //           descriptive LOINC, specimen-agnostic in practice)
  //   26466-3 Leukocytes [#/volume] in Body fluid by Manual count
  //   10328-6 Neutrophils/100 leukocytes in Body fluid
  //   13046-8 Lymphocytes [#/volume] in Body fluid
  // The "sf.*" notation matches Taiwan LIS prefixes ("SF" = Synovial
  // Fluid) that appear in raw display text.
  "16008C": {
    "sf.neutrophil": "10328-6",
    "sf neutrophil": "10328-6",
    neutrophil: "10328-6",
    "sf.lympho": "13046-8",
    "sf lympho": "13046-8",
    "sf.lymphocyte": "13046-8",
    lymphocyte: "13046-8",
    lymphocytes: "13046-8",
    "sf.wbc": "26466-3",
    "sf wbc": "26466-3",
    wbc: "26466-3",
    leukocyte: "26466-3",
    leukocytes: "26466-3",
    "sf.color": "5778-6",
    "sf color": "5778-6",
    color: "5778-6",
    顏色: "5778-6",
  },

  // ── CBC with auto diff (08013C) ──────────────────────
  // 08013C reports each cell type as a PERCENT of leukocytes (per 100),
  // distinct LOINCs from the absolute-count series (08010C Eosinophil
  // count → 711-2 is a different billing code with the count semantics).
  // Adding these here so under 08013C the diff entries route to the
  // /100 leukocytes LOINCs instead of falling to global eosinophil
  // count or "白血球" → WBC.
  "08013C": {
    // Differential percentages — shared with the CBC sibling billing
    // codes (08002C / 08003C / 08004C / 08006C) above; see
    // CBC_DIFF_KEYS const for the source of truth (includes singular
    // "Segment" Part 4 fix + 淋巴白血球 / 單核白血球 / 嗜中性白血球
    // wider CJK variants added v0.9.10 Part 6 N3).
    ...CBC_DIFF_KEYS,
    // v0.11.11 (SMART app dev bug 2 2026-05-29): basic CBC component
    // displays (Hct, Hb, RBC indices) also appear under 08013C diff
    // panel printout in some Taiwan LIS. Without these mappings, e.g.
    // "Hct(血球容積比)" rows previously fell to panel LOINC 57021-8
    // (CBC W Auto Diff panel). Adding the shared component keys here
    // routes basic CBC entries to their canonical LOINCs.
    ...CBC_COMPONENT_KEYS,
    // WBC absolute count can also appear on the diff panel printout.
    白血球: "6690-2",
    wbc: "6690-2",
  },
};

// ── _LOINC_MAP ────────────────────────────────────────────
// Common Taiwanese HIS lab names → LOINC code mapping
export const LOINC_MAP: Record<string, string> = {
  // ── Glucose ───────────────────────────────────────
  // Display-keyword fallback only kicks in when NO NHI code is
  // present (dashboard rows, LLM-extracted text). When the NHI code
  // IS present, 09005C → 1558-6 (Fasting) and 09140C → 2345-7
  // (generic) wins directly via _NHI_TO_LOINC.
  //
  // Faithful-transport principle: the bridge does NOT re-interpret
  // display strings like "FINGER SUGAR" as a different LOINC — it
  // preserves the raw display in `code.text` and the original NHI
  // code in `code.coding`. The SMART app does specimen/method-aware
  // grouping on the consumer side (see SMART app handoff doc).
  "fasting glucose": "1558-6",
  空腹血糖: "1558-6",
  "glu-ac": "1558-6",
  "glucose ac": "1558-6",
  glucose: "2345-7",
  血糖: "2345-7",
  glu: "2345-7",
  // HbA1c MUST appear before generic "hb" entries so the longest-prefix
  // match wins for the "HbA1c" display string. Other A1c synonyms…
  hba1c: "4548-4",
  醣化血紅素: "4548-4",
  a1c: "4548-4",
  hemoglobin: "718-7",
  血紅素: "718-7",
  hgb: "718-7",
  hb: "718-7",
  // CBC diff — eosinophil count must precede the bare 'wbc'/'白血球'
  // keys (which would otherwise win as substrings).
  // 711-2 verified at loinc.org: 'Eosinophils [#/volume] in Blood
  // by Automated count'.
  嗜酸性白血球: "711-2",
  嗜伊紅性白血球: "711-2",
  eosinophil: "711-2",
  eosinophils: "711-2",
  // Other diff cells — added v0.9.10 Part 6 N7 (long庚嘉義 row had
  // display="Neutrophil" with EMPTY coding array, ie. no NHI code
  // context for panel routing to kick in). When no NHI code, fall
  // back to /100 leukocytes form since that's the dominant diff
  // context in Taiwan LIS. Absolute-count form has its own dedicated
  // billing codes (08010C eosinophil count etc.) that resolve via
  // NHI_TO_LOINC path A before this global table is consulted.
  "neutrophilic segment": "770-8",
  neutrophil: "770-8",
  neutrophils: "770-8",
  segmented: "770-8",
  segment: "770-8",
  segments: "770-8",
  嗜中性白血球: "770-8",
  嗜中性球: "770-8",
  中性球: "770-8",
  lymphocyte: "736-9",
  lymphocytes: "736-9",
  淋巴白血球: "736-9",
  淋巴球: "736-9",
  淋巴細胞: "736-9",
  monocyte: "5905-5",
  monocytes: "5905-5",
  單核白血球: "5905-5",
  單核球: "5905-5",
  basophil: "706-2",
  basophils: "706-2",
  嗜鹼性白血球: "706-2",
  嗜鹼: "706-2",
  // Microalbumin (urine) — same Part 6 N7 reasoning: when no NHI
  // code arrives, "Micro Albumin" / "MALB" display should still
  // route to the right LOINC instead of falling to null.
  "micro-albumin": "14957-5",
  microalbumin: "14957-5",
  "micro albumin": "14957-5",
  malb: "14957-5",
  微小白蛋白: "14957-5",
  wbc: "6690-2",
  白血球: "6690-2",
  platelet: "777-3",
  血小板: "777-3",
  plt: "777-3",
  // RBC + RBC indices — verified LOINCs (loinc.org):
  // 789-8  Erythrocytes #/vol Blood Auto              → RBC
  // 785-6  Erythrocyte mean corpuscular hemoglobin    → MCH
  // Long CJK forms first (LDL/cholesterol pattern) so '平均紅血球
  // 血色素' wins over 紅血球.
  平均紅血球血色素: "785-6",
  rbc: "789-8",
  紅血球: "789-8",
  mch: "785-6",
  // Urine creatinine — MUST appear before generic 'creatinine' so
  // rows like 'U-CRE 尿液肌酸酐' or 'Creatinine(U)' resolve to the
  // urine LOINC (2161-8) instead of being shadowed by the serum
  // default (2160-0). Same longest-specific-first ordering as
  // the fasting-vs-random glucose block.
  "urine creatinine": "2161-8",
  "creatinine urine": "2161-8",
  "creatinine(u)": "2161-8",
  "u-cre": "2161-8",
  "u-crea": "2161-8",
  尿液肌酸酐: "2161-8",
  creatinine: "2160-0",
  肌酸酐: "2160-0",
  肌酐酸: "2160-0", // Taiwan variant spelling
  crea: "2160-0",
  bun: "3094-0",
  尿素氮: "3094-0",
  ast: "1920-8",
  alt: "1742-6",
  ferritin: "2276-4",
  血清鐵蛋白: "2276-4",
  ferr: "2276-4",
  // Vital-signs from 成人預防保健 (IHKE3402) — separate code namespace
  // but the lookup is by display-name substring, same as for labs.
  "body height": "8302-2",
  "body weight": "29463-7",
  bmi: "39156-5",
  // Waist circumference — measurement LOINC (8280-0). 56086-2 is
  // the 'Adult Waist Circumference Protocol' code, which is a
  // survey/protocol descriptor, NOT a numeric measurement
  // (verified at loinc.org). NHI 健保 reports a single waistline
  // number per visit, so the measurement code is correct.
  "waist circumference": "8280-0",
  "systolic blood pressure": "8480-6",
  "diastolic blood pressure": "8462-4",
  // Lipid panel — ORDER MATTERS. LDL/HDL variants MUST precede the
  // generic 'cholesterol' key so a row labelled 'LDL CHOLESTEROL'
  // resolves to 13457-7 (LDL calculated) and 'HDL CHOLESTEROL' to
  // 2085-9, instead of falling to 2093-3 (total cholesterol) via the
  // 'cholesterol' substring. Same canonical ordering as _LAB_SYNONYMS.
  "ldl cholesterol": "13457-7",
  "ldl-cholesterol": "13457-7",
  低密度膽固醇: "13457-7",
  低密度脂蛋白膽固醇: "13457-7",
  // 13457-7 = LDL cholesterol (calculated) — matches the NHI 09044C
  // billing code's intent (Taiwan labs predominantly report calculated
  // LDL via Friedewald). Keep consistent with _NHI_TO_LOINC["09044C"].
  "ldl-c": "13457-7",
  ldl: "13457-7",
  "hdl cholesterol": "2085-9",
  "hdl-cholesterol": "2085-9",
  高密度膽固醇: "2085-9",
  高密度脂蛋白膽固醇: "2085-9",
  "hdl-c": "2085-9",
  hdl: "2085-9",
  // Total cholesterol — bare 'cholesterol' only fires AFTER the
  // LDL/HDL-prefixed variants above have been checked.
  "total cholesterol": "2093-3",
  "t-cholesterol": "2093-3",
  血清總膽固醇: "2093-3",
  總膽固醇: "2093-3",
  cholesterol: "2093-3",
  triglyceride: "2571-8",
  三酸甘油酯: "2571-8",
  "uric acid": "3084-1",
  egfr: "33914-3",
  hbsag: "5196-1",
  "anti-hcv": "16128-1",
  // Urine protein (display fallback for the no-NHI-code path that
  // comes from IHKE3402 vitals + adult-preventive supplements).
  "urine protein": "20454-5", // Protein Mass/vol Urine
  "u-pro": "20454-5",
  尿蛋白: "20454-5",
  // ABG panel components — 09041B parent code in NHI_TO_LOINC; each
  // member's display ("pCO2", "pO2", "HCO3", "TCO2", "SBE/ABE",
  // "SBC", "SAT" / "SaO2") falls to its own LOINC.
  // pH MUST come before pco2/po2 so the bare "pH" display lands here.
  ph: "11558-4", // pH of Arterial blood
  pco2: "2019-8", // Carbon dioxide pp in Arterial blood
  po2: "2703-7", // Oxygen pp in Arterial blood
  hco3: "1959-6", // Bicarbonate Moles/vol Arterial
  bicarbonate: "1959-6",
  tco2: "2028-9", // Total CO2 Moles/vol Arterial
  // Bug report 2026-05-27 Part 3 C1: SBE and ABE were both mapped to
  // 11555-0 ("Base excess in Arterial blood by calculation"), so SMART
  // apps that pivot by LOINC collapsed two clinically distinct analytes
  // into one column. ABE is the actual (non-standardised) base excess;
  // SBE is the standardised pH-7.40 / Hb-5 g/dL value. Different normal
  // ranges, different clinical interpretation. Splitting per bug report.
  // (Previous sbc → 1925-7 mapping kept as-is: SBC is rarely reported
  // in Taiwan ABG; if it ever collides with the new ABE → 1925-7 in a
  // single bundle, the SMART app will need to disambiguate via code.text
  // — left as a known follow-up rather than guessing a new SBC LOINC.)
  abe: "1925-7", // ABE — Base excess in Blood by calculation
  "a.b.e": "1925-7", // period-separated abbrev (v0.11.4 audit)
  "actual base excess": "1925-7",
  sbe: "1927-3", // SBE — Base excess in Arterial blood adjusted to pH 7.40
  "s.b.e": "1927-3",
  "standard base excess": "1927-3",
  sbc: "1925-7", // SBC — Standard bicarbonate Arterial (legacy mapping; see comment above)
  saturat: "2713-6", // O2 saturation Arterial
  sao2: "2713-6",
  sat: "2713-6", // NHI display shows just "SAT"
  // Synovial / body-fluid components (16008C parent above).
  "sf.color": "5778-6", // Color of Body fluid (reuse Urine color spec OK)
  // NOTE: 8255-2 / 13948-5 previously listed here both turned out
  // to be unrelated LOINCs (verified loinc.org — 8255-2 is
  // 'Service comment 13', 13948-5 is 'Coccidioides immitis IgM
  // Ab'). Body-fluid Appearance / RBC don't have well-attested
  // LOINCs in our table yet — falling through to code.text-only
  // is safer than emitting a misleading LOINC. To add later,
  // verify each against loinc.org first.
  "sf.wbc": "26466-3", // WBC #/vol Body fluid
  "sf.neutrophil": "10328-6", // Neutrophils/100 leukocytes in Body fluid
  "sf.lympho": "13046-8", // Lymphocytes #/vol Body fluid
};

// ── _LOINC_DISPLAY ────────────────────────────────────────
// Canonical English display names for LOINC codes the bridge emits.
// Falls back to the raw input display when a LOINC isn't listed here.
// Sourced from loinc.org canonical short names where applicable.
// Add new entries as we widen LOINC coverage — the lookup is keyed on
// LOINC string, so unmapped LOINCs degrade gracefully to the NHI text.
export const LOINC_DISPLAY: Record<string, string> = {
  // ── Urinalysis (06013C panel sub-items) ──────────
  // Most critical block — NHI's "Color 尿 顏  ..." style labels are
  // what triggers downstream Chinese-substring labelling bugs.
  "5803-2": "pH of Urine",
  "5811-5": "Specific gravity of Urine",
  "5770-3": "Bilirubin Urine Ql",
  "5802-4": "Nitrite Urine Ql",
  "5778-6": "Color of Urine",
  "5767-9": "Appearance of Urine",
  "5818-0": "Urobilinogen Urine Ql",
  "20454-5": "Protein Mass/Vol in Urine",
  // v0.12.2 (SMART app dev v0.12.1 audit 2026-05-29): quantitative
  // urine protein LOINC. Verified at loinc.org/2888-6/ —
  //   Component=Protein, Property=MCnc (Mass concentration),
  //   System=Urine, Scale=Qn (Quantitative), Class=UA.
  // Distinct from 20454-5 which is Property=PrThr (Presence) /
  // Scale=Ord (Ordinal) — dipstick presence test. Bridge routes
  // numeric mg/dL values to 2888-6 and qualitative dipstick values
  // (Negative / Trace / 1+ / "4+ (2000)" combined) to 20454-5 — see
  // classifyUrineProteinValue() in observation.ts.
  "2888-6": "Protein [Mass/volume] in Urine",
  "14957-5": "Microalbumin Mass/Vol in Urine",
  "14959-1": "Microalbumin/Creatinine Ratio in Urine",
  "5792-7": "Glucose Urine Ql",
  "5797-6": "Ketones Urine Ql",
  "5794-3": "Hemoglobin Urine Ql",
  "5799-2": "Leukocytes Urine Ql",
  "24356-8": "Urinalysis Macro Panel",
  // ALL entries below use the LOINC canonical 'Long Common Name'
  // as accepted by the TWNHIFHIR validator. Source: loinc.org for
  // each code, cross-checked against the validator's reported
  // 'Valid display is one of N choices' for displays we previously
  // got wrong (45 LOINCs found in the P333333333 validation run).
  // When updating, copy the exact en-US long name from loinc.org —
  // the validator is sensitive to spelling / punctuation.
  //
  // ── Urinalysis (06013C panel sub-items) ──────────
  // ── ABG (09041B panel) — not in validator output; loinc.org sourced
  "11558-4": "pH of Arterial blood",
  "2019-8": "Carbon dioxide [Partial pressure] in Arterial blood",
  "2703-7": "Oxygen [Partial pressure] in Arterial blood",
  "1959-6": "Bicarbonate [Moles/volume] in Arterial blood",
  "2028-9": "Carbon dioxide [Moles/volume] in Serum or Plasma",
  "11555-0": "Base excess in Arterial blood by calculation",
  "1925-7": "Bicarbonate [Moles/volume] in Arterial blood --standard",
  "2713-6": "Oxygen saturation in Arterial blood",
  // ── Glucose ──────────────────────────────────────
  "1558-6": "Fasting glucose [Mass/volume] in Serum or Plasma",
  "2345-7": "Glucose [Mass/volume] in Serum or Plasma",
  // ── Hematology ───────────────────────────────────
  "718-7": "Hemoglobin [Mass/volume] in Blood",
  "4548-4": "Hemoglobin A1c/Hemoglobin.total in Blood",
  "6690-2": "Leukocytes [#/volume] in Blood by Automated count",
  "777-3": "Platelets [#/volume] in Blood by Automated count",
  "789-8": "Erythrocytes [#/volume] in Blood by Automated count",
  "785-6": "MCH [Entitic mass] by Automated count",
  "711-2": "Eosinophils [#/volume] in Blood by Automated count",
  // v0.11.12 FHIR R4 audit (2026-05-29): coverage sweep — LOINCs
  // routed to by mapper but missing from LOINC_DISPLAY. Without
  // entries here, Coding.display falls back to the raw row display
  // ("Meta-Myelocyte" / "紅血球分佈變異數" / etc) which violates the
  // FHIR R4 rule that Coding.display "follows the rules of the system"
  // (= LOINC Long Common Name). All entries below are the Long Common
  // Name fetched verbatim from loinc.org 2026-05-29.
  "740-1": "Metamyelocytes/Leukocytes in Blood by Manual count",
  "764-1": "Band form neutrophils/Leukocytes in Blood by Manual count",
  // CBC indices (v0.11.11 expanded variant routing → these LOINCs)
  "786-4": "MCHC [Entitic Mass/volume] in Red Blood Cells by Automated count",
  "787-2": "MCV [Entitic mean volume] in Red Blood Cells by Automated count",
  "788-0": "Erythrocyte [DistWidth] in Blood by Automated count",
  // v0.11.10 LOINC_SHORT_TEXT entries that lacked LOINC_DISPLAY twins
  "2143-6": "Cortisol [Mass/volume] in Serum or Plasma",
  "2132-9": "Cobalamin (Vitamin B12) [Mass/volume] in Serum or Plasma",
  "2284-8": "Folate [Mass/volume] in Serum or Plasma",
  "83112-3":
    "Prostate specific Ag [Mass/volume] in Serum or Plasma by Immunoassay",
  "4544-3": "Hematocrit [Volume Fraction] of Blood by Automated count",
  "57021-8": "CBC W Auto Differential panel - Blood",
  "24317-0": "Hemogram and platelets WO differential panel - Blood",
  // ── Chemistry / liver / renal ────────────────────
  "1920-8":
    "Aspartate aminotransferase [Enzymatic activity/volume] in Serum or Plasma",
  "1742-6":
    "Alanine aminotransferase [Enzymatic activity/volume] in Serum or Plasma",
  "2160-0": "Creatinine [Mass/volume] in Serum or Plasma",
  "2161-8": "Creatinine [Mass/volume] in Urine",
  "33914-3":
    "Glomerular filtration rate [Volume Rate/Area] in Serum or Plasma by Creatinine-based formula (MDRD)/1.73 sq M",
  "3094-0": "Urea nitrogen [Mass/volume] in Serum or Plasma",
  "3084-1": "Urate [Mass/volume] in Serum or Plasma",
  "2951-2": "Sodium [Moles/volume] in Serum or Plasma",
  "2823-3": "Potassium [Moles/volume] in Serum or Plasma",
  "1975-2": "Bilirubin.total [Mass/volume] in Serum or Plasma",
  "1968-7": "Bilirubin.direct [Mass/volume] in Serum or Plasma",
  "1751-7": "Albumin [Mass/volume] in Serum or Plasma",
  "2885-2": "Protein [Mass/volume] in Serum or Plasma", // v0.11.11 — Total Protein
  "2532-0":
    "Lactate dehydrogenase [Enzymatic activity/volume] in Serum or Plasma",
  "6768-6":
    "Alkaline phosphatase [Enzymatic activity/volume] in Serum or Plasma",
  "2324-2":
    "Gamma glutamyl transferase [Enzymatic activity/volume] in Serum or Plasma",
  "17861-6": "Calcium [Mass/volume] in Serum or Plasma",
  // ── Lipid panel ──────────────────────────────────
  "2093-3": "Cholesterol [Mass/volume] in Serum or Plasma",
  "2571-8": "Triglyceride [Mass/volume] in Serum or Plasma",
  "2085-9": "Cholesterol in HDL [Mass/volume] in Serum or Plasma",
  "13457-7":
    "Cholesterol in LDL [Mass/volume] in Serum or Plasma by calculation",
  // ── Thyroid / hormones ───────────────────────────
  "3016-3": "Thyrotropin [Units/volume] in Serum or Plasma",
  "3024-7": "Thyroxine (T4) free [Mass/volume] in Serum or Plasma",
  "14920-3": "Thyroxine (T4) free [Moles/volume] in Serum or Plasma",
  "2986-8": "Testosterone [Mass/volume] in Serum or Plasma",
  "83098-4": "Follitropin [Units/volume] in Serum or Plasma by Immunoassay",
  "83096-8": "Estradiol (E2) [Mass/volume] in Serum or Plasma by Immunoassay",
  // ── Cardiac / inflammation ───────────────────────
  "10839-9": "Troponin I.cardiac [Mass/volume] in Serum or Plasma",
  "33762-6":
    "Natriuretic peptide.B prohormone N-Terminal [Mass/volume] in Serum or Plasma",
  "1988-5": "C reactive protein [Mass/volume] in Serum or Plasma",
  "33959-8": "Procalcitonin [Mass/volume] in Serum or Plasma",
  // ── Hepatitis / serology ─────────────────────────
  "5195-3": "Hepatitis B virus surface Ag [Presence] in Serum",
  "5196-1": "Hepatitis B virus surface Ag [Units/volume] in Serum",
  "16128-1": "Hepatitis C virus Ab [Presence] in Serum",
  "13955-0":
    "Hepatitis C virus Ab [Presence] in Serum or Plasma by Immunoassay",
  // ── Virology (audit 2026-05-19) ──────────────────
  "7853-5": "Cytomegalovirus IgM Ab [Units/volume] in Serum or Plasma",
  // ── Tumor markers / proteins (audit 2026-05-19) ──
  "1952-1": "Beta-2-Microglobulin [Mass/volume] in Serum or Plasma",
  // ── Blood type (v0.11.11 — ABO/Rh split from combined 882-1) ──
  "883-9": "ABO group [Type] in Blood",
  "10331-7": "Rh [Type] in Blood",
  "890-4": "Blood group antibody screen [Presence] in Serum or Plasma",
  // ── Coagulation ──────────────────────────────────
  "5902-2":
    "Prothrombin time (PT) in Platelet poor plasma by Coagulation assay",
  // v0.11.9 audit: previously labelled "Prothrombin time (PT) Control...".
  // loinc.org canonical is actually "Prothrombin time (PT) actual/Normal..."
  // (Component=Prothrombin time actual/Normal, Property=RelTime — a RATIO,
  // not a control reading). See PANEL_LOINC_MAP['08026C'] comment.
  "5894-1":
    "Prothrombin time (PT) actual/Normal in Platelet poor plasma by Coagulation assay",
  "6301-6": "INR in Platelet poor plasma by Coagulation assay",
  "14979-9": "aPTT in Platelet poor plasma by Coagulation assay",
  // v0.11.9 (SMART app dev report 2026-05-29): added APTT ratio LOINC.
  // 08036C bills both APTT (seconds, 14979-9) AND APTT ratio (63561-5) as
  // sub-rows; without per-LOINC display, the ratio row inherited APTT
  // time's display and looked like a fatal coagulation reading.
  "63561-5":
    "aPTT in Platelet poor plasma by Coagulation assay --actual/normal",
  "30240-6": "Fibrin D-dimer [Mass/volume] in Platelet poor plasma",
  // ── Body fluid (16008C panel members; v0.9.10) ───
  "26466-3": "Leukocytes [#/volume] in Body fluid by Manual count",
  "10328-6": "Neutrophils/100 leukocytes in Body fluid",
  "13046-8": "Lymphocytes [#/volume] in Body fluid",
  // ── SPE fractions (09065B; v0.10.0) ──────────────
  "2865-7": "Albumin [Mass/volume] in Serum or Plasma by Electrophoresis",
  "2867-3": "Globulin.alpha 1 [Mass/volume] in Serum or Plasma by Electrophoresis",
  "2868-1": "Globulin.alpha 2 [Mass/volume] in Serum or Plasma by Electrophoresis",
  "2869-9": "Globulin.beta [Mass/volume] in Serum or Plasma by Electrophoresis",
  "2871-5": "Globulin.gamma [Mass/volume] in Serum or Plasma by Electrophoresis",
  "1759-0": "Albumin/Globulin [Mass Ratio] in Serum or Plasma",
  // ── Flow cytometry CD (12204B; v0.10.0) ──────────
  "8124-0": "CD3 cells [#/area] in Blood",
  "8123-2": "CD4 cells [#/area] in Blood",
  "8128-1": "CD8 cells [#/area] in Blood",
  "8118-2": "CD19 cells [#/area] in Blood",
  "8125-7": "CD56 cells [#/area] in Blood",
  "8112-5": "CD16+CD56 cells [#/area] in Blood",
  "54218-3": "CD4/CD8 [Ratio] in Blood",
  // ── DLCO (17009B; v0.10.0) ───────────────────────
  "19850-7": "Alveolar volume [Volume]",
  "19911-7": "Transfer factor coefficient for carbon monoxide (DLCO/VA)",
  // ── Vital signs (IHKE3402) ───────────────────────
  "8302-2": "Body height",
  "29463-7": "Body weight",
  "39156-5": "Body mass index (BMI) [Ratio]",
  "8280-0": "Waist Circumference at umbilicus by Tape measure",
  "8480-6": "Systolic blood pressure",
  "8462-4": "Diastolic blood pressure",
  "85354-9": "Blood pressure panel with all children optional",
  // ── v0.12.0 legacy sweep (46 entries) ─────────────
  // All Long Common Names below WebFetch-verified at loinc.org
  // 2026-05-29 for the LOINCs already routed to by the bridge but
  // missing LOINC_DISPLAY entries. Without these, Coding.display fell
  // back to raw row display — FHIR R4 violation ("follow rules of the
  // system"). Audit during this sweep also found 6 incorrect mappings
  // + 1 invalid LOINC (2692-7) which were corrected in NHI_TO_LOINC
  // above (12184C / 22001C / 22015B / 22025B / 13025C / 13026C
  // unmapped; 08075C 2692-7 → 2692-2 typo fix).
  // CBC differential percentages
  "706-2": "Basophils/Leukocytes in Blood by Automated count",
  "713-8": "Eosinophils/Leukocytes in Blood by Automated count",
  "736-9": "Lymphocytes/Leukocytes in Blood by Automated count",
  "770-8": "Neutrophils/Leukocytes in Blood by Automated count",
  "5905-5": "Monocytes/Leukocytes in Blood by Automated count",
  // Tumor markers
  "1834-1": "Alpha-1-Fetoprotein [Mass/volume] in Serum or Plasma",
  "2039-6": "Carcinoembryonic Ag [Mass/volume] in Serum or Plasma",
  "2857-1": "Prostate specific Ag [Mass/volume] in Serum or Plasma",
  "10861-3": "Progesterone receptor [Mass/mass] in Tissue",
  "10886-0": "Prostate Specific Ag Free [Mass/volume] in Serum or Plasma",
  "24108-3": "Cancer Ag 19-9 [Units/volume] in Serum or Plasma",
  "83113-1":
    "Prostate Specific Ag Free [Mass/volume] in Serum or Plasma by Immunoassay",
  // Hepatitis / virology
  "5197-9":
    "Hepatitis B virus surface Ag [Presence] in Serum by Radioimmunoassay (RIA)",
  "14118-4": "Lactate [Mass/volume] in Serum or Plasma",
  "80383-3":
    "Influenza virus B Ag [Presence] in Upper respiratory specimen by Rapid immunoassay",
  "94558-4":
    "SARS-CoV-2 (COVID-19) Ag [Presence] in Respiratory system specimen by Rapid immunoassay",
  // Immunology / autoimmune
  "5048-4": "Nuclear Ab [Titer] in Serum by Immunofluorescence",
  // 5292-8 is canonically the VDRL LOINC; bridge maps NHI 12001C (RPR
  // billing) here because RPR + VDRL are clinically interchangeable
  // serology methods for the same anti-cardiolipin antibody. Display
  // follows the LOINC's own canonical name (VDRL) per FHIR R4.
  "5292-8": "Reagin Ab [Presence] in Serum by VDRL",
  "15189-4":
    "Kappa light chains/Lambda light chains [Mass Ratio] in Serum",
  "16124-0": "Cryptococcus sp Ab [Titer] in Serum",
  "17351-8": "Neutrophil cytoplasmic Ab [Presence] in Serum",
  "20584-9": "Leukocytes [#/volume] in Specimen by Automated count",
  "47286-0": "Differential panel - Bone marrow",
  "95801-7": "Immunoglobulin light chains.free and IFE panel - Urine",
  // Pathology / IHC
  "18474-7": "HER2 Ag [Presence] in Tissue by Immune stain",
  "14130-9": "Estrogen receptor [Moles/mass] in Tissue",
  "14196-0": "Reticulocytes [#/volume] in Blood",
  "35672-5": "Bilirubin.direct/Bilirubin.total in Serum or Plasma",
  "83052-1":
    "PD-L1 by clone 22C3 [Presence] in Tissue by Immune stain",
  // ABG / Pulmonary
  "24341-0": "Gas and Carbon Monoxide Panel - Arterial blood",
  "44596-5": "IgG Ag [Presence] in Skin by Immunofluorescence",
  // Chemistry (general)
  "1927-3": "Base excess in Venous blood by calculation",
  "1995-0": "Calcium.ionized [Moles/volume] in Serum or Plasma",
  "14563-1":
    "Hemoglobin [Presence] in Stool from gastrointestinal --1st specimen",
  "2276-4": "Ferritin [Mass/volume] in Serum or Plasma",
  "2458-8": "IgA [Mass/volume] in Serum or Plasma",
  "2465-3": "IgG [Mass/volume] in Serum or Plasma",
  "2500-7": "Iron binding capacity [Mass/volume] in Serum or Plasma",
  "2692-2": "Osmolality of Serum or Plasma", // typo fix from 2692-7
  "2777-1": "Phosphate [Mass/volume] in Serum or Plasma",
  "2991-8": "Testosterone Free [Mass/volume] in Serum or Plasma",
  "3040-3": "Lipase [Enzymatic activity/volume] in Serum or Plasma",
  "19113-0": "IgE [Units/volume] in Serum or Plasma",
  "19123-9": "Magnesium [Mass/volume] in Serum or Plasma",
  // Stool / GI
  "58453-2":
    "Hemoglobin [Mass/volume] in Stool from gastrointestinal lower by Immunoassay",
  // Microbiology
  "600-7": "Bacteria identified in Blood by Culture",
  // SPE panel parent
  "90991-1":
    "Protein electrophoresis and M protein isotype panel - Serum or Plasma",
};

// ── _LOINC_SHORT_TEXT ─────────────────────────────────────
// Short clean clinical names used as `Observation.code.text` (the
// human-readable label most SMART apps surface in trend columns and
// per-row tooltips). Distinct from LOINC_DISPLAY (which is the LONG
// canonical name in `coding[loinc].display` for FHIR validator
// compliance) — code.text is allowed to be friendlier.
//
// Rationale (v0.11.9, SMART app dev report 2026-05-29): the raw NHI
// display for coag analytes is often clinically ambiguous —
// "Heparin治療範圍參考倍數" looks like a settings label, not the
// APTT-ratio analyte. Without an override, SMART app pivoted on
// code.text and showed columns labelled "Heparin治療範圍參考倍數"
// next to a sibling "APTT" column, even though both are the same
// underlying APTT measurement (one in seconds, one as ratio).
//
// Behaviour:
//   - If the row resolves to a LOINC AND that LOINC has a
//     LOINC_SHORT_TEXT entry, `code.text` uses the override
//   - The raw NHI display is ALWAYS preserved in
//     `coding[nhi].display` (faithful-transport)
//   - LOINCs without entries here fall back to raw display
//     (current behaviour, no regression for the long tail)
//
// Faithful-transport check: this is NOT inventing data the
// hospital didn't ship; it's relabelling our own output column
// header with a clinical short name that matches the LOINC
// already chosen.
export const LOINC_SHORT_TEXT: Record<string, string> = {
  // ── Coagulation panel (08036C / 08026C) ──────────
  "14979-9": "APTT",
  "63561-5": "APTT (ratio)",
  "5902-2": "PT",
  "6301-6": "INR",
  "5894-1": "PT (ratio)", // v0.11.9: 5894-1 is PT actual/normal RATIO
  // (Property=RelTime), NOT PT Control as previously (incorrectly) labelled.
  // See LOINC_DISPLAY comment for full audit trail.
  //
  // ── Single-analyte panels (v0.11.10) ─────────────
  // SMART app dev report 2026-05-29 Category B + C: bridge previously
  // shipped DR title and obs.text from two different sources for
  // these single-analyte panels — DR title from order_name (with NHI-
  // catalog method suffix like 「免疫分析」), obs.text from row display
  // (lab-shorthand or alternate Chinese). Unifying via LOINC_SHORT_TEXT
  // means both DR title and obs.text resolve to the same clean
  // clinical short name when the row's NHI code maps to one of these
  // LOINCs (via NHI_TO_LOINC path A).
  //
  // Each LOINC below verified via WebFetch loinc.org 2026-05-29 —
  // Component / Property / System / Method all confirmed appropriate
  // for the Taiwan NHI billing context:
  //   4548-4   Hemoglobin A1c/Hemoglobin.total, MFr, Blood (NGSP %; Taiwan default)
  //   1975-2   Bilirubin total, MCnc, Ser/Plas
  //   10839-9  Troponin I.cardiac, MCnc, Ser/Plas
  //   13457-7  Cholesterol in LDL (calculated), MCnc, Ser/Plas
  //   3016-3   Thyrotropin (TSH), ACnc, Ser/Plas
  //   2143-6   Cortisol, MCnc, Ser/Plas
  //   2132-9   Cobalamin (Vitamin B12), MCnc, Ser/Plas
  //   2284-8   Folate, MCnc, Ser/Plas
  //   83112-3  Prostate specific Ag, MCnc, Ser/Plas, IA (covers EIA/LIA both)
  "4548-4": "HbA1c", // NHI 09006C (was: DR "醣化血紅素" / obs "Hb-A1c")
  "1975-2": "Total Bilirubin", // NHI 09029C (was: DR "膽紅素總量" / obs "全膽紅素")
  "10839-9": "Troponin I", // NHI 09099C (was: DR "心肌旋轉蛋白Ｉ" fullwidth)
  "13457-7": "LDL-C", // NHI 09044C (was: DR "低密度脂蛋白－膽固醇" / obs "LDL-C(direct)")
  "3016-3": "TSH", // NHI 09112C (was: DR "甲狀腺刺激素免疫分析" / obs "甲狀腺刺激素")
  "2143-6": "Cortisol", // NHI 09113C (was: DR "皮質素免疫分析")
  "2132-9": "Vitamin B12", // NHI 09129C (was: DR "維生素B12免疫分析")
  "2284-8": "Folate", // NHI 09130C (was: DR "葉酸免疫分析")
  "83112-3": "PSA", // NHI 12081C (was: DR "攝護腺特異抗原(EIA/LIA法)")
  // v0.12.1 (SMART app dev bug 8' 2026-05-29): urine total protein
  // observations had DR title "全蛋白" (ambiguous NHI catalog name —
  // can mean serum or urine total protein) while the obs itself was
  // correctly LOINC 20454-5 (Protein Mass/Vol in Urine). Clinicians
  // reading the DR header assumed serum TP. Clean short text resolves
  // both DR title and obs.code.text to "Urine Protein" — disambiguating
  // the specimen explicitly. LOINC_DISPLAY[20454-5] already correctly
  // reads "Protein Mass/Vol in Urine" (catalog-faithful, FHIR R4 OK).
  "20454-5": "Urine Protein",
  // v0.12.2: quantitative urine protein. Same clean label as the
  // qualitative twin so SMART app per-LOINC pivot shows both under
  // the same column header "Urine Protein"; the LOINC code itself
  // disambiguates which scale (Ord vs Qn) downstream consumers see.
  "2888-6": "Urine Protein",
  // v0.13 — CBC sub-analytes (08011C / 08013C) ─────────
  // App dev (MediPrisma) soft request 2026-05-30: bridge ships these
  // 12 CBC LOINCs but `obs.code.text` varies (Hb / 血色素 / Hemoglobin /
  // HGB depending on hospital LIS). SMART apps doing cross-hospital
  // trend display need to maintain an alias table to merge them. With
  // SHORT_TEXT entries here PLUS the clean-match gate in
  // mapObservation / buildObservation (CBC_CANONICAL_TEXT_LOINCS check
  // → only canonicalize when findLoincDetailed.cleanMatch === true),
  // app-side alias table can retire.
  //
  // Mis-tag canary preservation: when a CBC panel sub-row's display
  // doesn't match any PANEL_LOINC_MAP["08011C"] key explicitly, the
  // row falls to the panel-default LOINC via findLoinc path C
  // (cleanMatch=false). In that case the raw display is preserved as
  // obs.code.text — letting downstream reviewers spot the mis-tag.
  // This is the lesson from v0.11.9 Bug 6 (帶狀嗜中性白血球 silently
  // routed to 770-8 panel default before the variant key was added).
  //
  // Short labels chosen to match clinical convention (Taiwan EHR
  // standard column headers). NOT LOINC's verbose long name — that
  // already lives in coding[loinc].display per LOINC_DISPLAY.
  "770-8":  "Neutrophils %",
  "736-9":  "Lymphocytes %",
  "5905-5": "Monocytes %",
  "713-8":  "Eosinophils %",
  "706-2":  "Basophils %",
  "4544-3": "HCT",
  "718-7":  "Hb",
  "777-3":  "Platelet",
  "787-2":  "MCV",
  "786-4":  "MCHC",
  "788-0":  "RDW",
  "789-8":  "RBC",
};

// v0.13 (app dev MediPrisma soft request 2026-05-30) — LOINCs eligible
// for obs.code.text canonicalization ONLY when findLoincDetailed reports
// cleanMatch === true (explicit PANEL_LOINC_MAP / NHI_TO_LOINC hit, not
// fallback-to-panel-default).
//
// Why this set is restricted (not just "every LOINC in LOINC_SHORT_TEXT"):
//   - Pre-v0.13 LOINC_SHORT_TEXT entries (TSH / Hb-A1c / 4544-3 etc) were
//     added for SINGLE-ANALYTE NHI codes where path A in findLoinc
//     (NHI_TO_LOINC direct hit) is the only routing path → cleanMatch
//     is always true → no canary needed. Those keep current "always
//     canonicalize" behaviour.
//   - The 12 CBC LOINCs here live under MULTI-ANALYTE panel codes
//     (08011C / 08013C in DISPLAY_FIRST_CODES). Routing goes through
//     PANEL_LOINC_MAP path B1; misses fall back to panel default via
//     path C, which is exactly the v0.11.9 Bug 6 surface area. So we
//     need the gate to preserve mis-tag canary.
export const CBC_CANONICAL_TEXT_LOINCS: ReadonlySet<string> = new Set([
  "770-8",
  "736-9",
  "5905-5",
  "713-8",
  "706-2",
  "4544-3",
  "718-7",
  "777-3",
  "787-2",
  "786-4",
  "788-0",
  "789-8",
]);

// ── _NHI_CODE_PANEL_NAME ─────────────────────────────────
// Per-NHI-code override for Observation.code.text when the hospital
// LIS reliably ships a generic panel-umbrella display string instead
// of an analyte-specific one. The NHI catalog has the canonical
// panel-specific name; without an override, downstream SMART apps
// that key off `code.text` see indistinguishable "血型鑑定" labels
// for ABO vs Rh vs antibody screen even though the NHI codes (and
// therefore DR title) are different.
//
// Rationale (SMART app dev report 2026-05-29, v0.11.9):
//   - 11001C ABO / 11003C RH(D) / 11004C antibody all ship from LIS
//     with `display: "血型鑑定"` (generic blood-typing umbrella).
//   - Bridge already separates them at the DR layer (NHI code wins,
//     v0.11.8 fix), but downstream consumers that look only at
//     `obs.code.text` see 3 identical "血型鑑定" rows.
//   - SMART app cousins this trip up duplicate-detection (same title
//     + same date + same hospital + same value → wrongly flagged
//     "possible duplicate").
//
// Precedence in buildObservation: LOINC_SHORT_TEXT > NHI_CODE_PANEL_NAME
// > raw display. Faithful-transport check ✅: this only relabels OUR
// OWN code.text; raw display is preserved verbatim in
// `coding[nhi].display` (set by buildCodings).
//
// Only add an entry here when the LIS reliably ships a GENERIC display
// for ALL rows under that NHI code in practice. For CBC-style panels
// where each sub-row has a unique analyte display, NO entry — display
// (which is already specific) wins.
export const NHI_CODE_PANEL_NAME: Record<string, string> = {
  // v0.11.10 FHIR R4 compliance audit (2026-05-29): values must match
  // the NHI catalog's authoritative panel name verbatim — this map is
  // also consulted by `buildCodings` as the fallback for
  // `Observation.code.coding[nhi].display` when `raw.order_name` is
  // missing, and Coding.display per FHIR R4 must "follow the rules of
  // the system". Treating my paraphrase ("ABO 血型測定") as the NHI
  // catalog name would be wrong on both counts (FHIR semantic + faithful
  // transport). NHI 健保 catalog formal names confirmed via the SMART
  // app dev's bug report enumeration of observed DR titles.
  "11001C": "ABO血型測定檢驗",
  "11003C": "RH（D）型檢驗",
  "11004C": "抗體反應 (不規則抗體)",
};

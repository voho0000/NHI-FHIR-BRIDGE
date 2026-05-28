# Project Memory — NHI-FHIR-Bridge

Standing rules that survive across sessions. Update when the user adds a new rule.

## FHIR R4 compliance check (added 2026-05-29)

**Every change to mapper / observation pipeline / coding fields / resource construction must be audited against FHIR R4 spec before commit.** Don't ship "bug-fix patches" that violate the spec for short-term wins.

Checklist:

1. **`Coding.display` must follow the rules of the system.** Per FHIR R4 spec.
   - LOINC: use the canonical **Long Common Name** from loinc.org (lives in `LOINC_DISPLAY` table)
   - NHI medical order code system: use the **NHI catalog name verbatim** (from `raw.order_name`, or `NHI_CODE_PANEL_NAME` fallback — both must match the catalog formal name including fullwidth/halfwidth choice)
   - **Never normalize, paraphrase, or substitute Coding.display** — that violates "rules of the system"

2. **`CodeableConcept.text` is free-form.** Bridge can override/normalize freely:
   - LOINC_SHORT_TEXT overrides for clean clinical labels (e.g. "TSH")
   - `normalizeFullwidth()` for halfwidth ASCII (e.g. Ｉ → I)
   - NHI_CODE_PANEL_NAME fallback when LIS display is generic
   - Single-obs DR text propagation (with LOINC-equality guard)

3. **`Resource.id` syntactic constraints.** Per FHIR R4 spec:
   - `[A-Za-z0-9\-\.]{1,64}` — SHA1 hex output qualifies
   - `stableId` hash inputs are bridge's choice; just ensure stability across reruns when content unchanged

4. **`Observation` only for patient measurements.** Drop non-patient rows in `filterLabRows`:
   - QC controls (Nor.plasma mean / 正常血漿APTT平均值 → `looksLikeQcControl`)
   - Specimen quality flags (溶血 / 脂血 / icterus → `looksLikeQualityFlag`)
   - Narrative / comment rows (`:` / `PEP-Comment` / 備註 → `looksLikeNarrativeRow`)
   - These should never become patient Observation resources sharing the host code's LOINC

5. **Adding any new LOINC mapping requires WebFetch loinc.org verification.** Per project rule (2026-05-29):
   - Confirm Component / Property / System / Method match the intended NHI billing context
   - Document findings inline as code comments
   - Add LOINC_DISPLAY entry (Long Common Name) at the same time
   - Add LOINC_SHORT_TEXT entry too if the LOINC will appear in DR title / code.text override paths

6. **Faithful transport principle.** User-defined (2026-05-28):
   > 我的 faithful transport 是不能亂加健康存摺上沒有的 data，或者亂改，但 LOINC 對應是可以的。
   - Patient values / dates / hospitals / units: NEVER modify
   - LOINC mapping corrections: allowed (with WebFetch verification)
   - Label normalization in `code.text`: allowed (free-form per FHIR R4)
   - Filtering non-patient rows (QC / quality / narrative): allowed and required

7. **Multi-reading preservation + targeted dedup (revised 2026-05-29 v0.12.4).** User-defined principle:

   The bundle is for general SMART app consumption — **the dedup responsibility cannot be pushed to consumers** or downstream apps would break. Bridge produces one Observation per *logical measurement* in 健保存摺.

   What this means in practice:

   - **Bridge MUST dedup NHI multi-channel structural duplicates** (A+B same-measurement pairs). NHI ships the same logical measurement via channel A (`不定期上傳`, real-time, typically English display + numeric refRange) AND channel B (`定期上傳`, batch sync, typically Chinese display + text refRange like `[無][無]`). These two API rows are NHI's structural artifact from dual-channel upload, not separate measurements. Implemented in `dedupNhiCrossChannelPairs()`.

     Criteria for the A+B pair (all must match):
     - same NHI 醫令碼 (`ordeR_CODE`)
     - same date
     - same hospital
     - same value
     - same unit
     - exactly 1 row has `orI_TYPE=A` AND exactly 1 has `orI_TYPE=B`

     Action when detected: keep A (numeric refRange is more clinically useful), drop B.

   - **Bridge MUST NOT dedup based on its own clinical judgement.** Specifically forbidden:
     - Post-emission Observation dedup by `(LOINC, value, date, hospital)` for **same-source** rows — looks-the-same is not enough; ICU same-value draws happen and same-source LIS double-upload is a real NHI signal worth preserving
     - Dropping Observations whose value pattern is "structurally impossible" for the LOINC's analyte (e.g. ABO obs with `+` value, Rh obs with `B` value) — bridge can't tell forward/reverse typing from cross-contamination
     - Collapsing rows because their placeholder unit encodings (`空白空白` / `-`) differ but both mean "no unit" — dedup keys must use the raw unit string for same-source comparisons

   - **`stableId` includes `value` AND `unit` AND `nhi_source_channel`** so distinct readings (different values, different channels, etc) don't collapse. With v0.12.4 dedup happening BEFORE stableId, the source-channel hash input only affects edge cases where the channel dedup didn't fire (e.g. only B row, or A+B with different values).

   - **Exceptions to "no clinical-judgement dedup" (allowed):**
     - **LOINC mapping corrections** — incorrect LOINCs may be rerouted to correct ones (v0.11.13 9a INR-sec → PT). The Observation still emits with the corrected LOINC; no data loss.
     - **Specimen quality flags** (`溶血` / `脂血` / icterus) are filtered because they are not patient measurements and would not be modelled as Observations under FHIR R4 regardless of LIS encoding.
     - **Unit string cleanup** in `_canonicalizeUnit` — placeholder strings are stripped from the emitted `Quantity.unit` field (FHIR R4 requires valid UCUM or absent), but this happens AFTER dedup so it never affects observation count.

   User principle (verbatim, lightly edited for retention):
   > "你要考量到這份 fhir json 可能給其他非我開發的 smart app 使用，如果把 dedup 的責任都放在 app 端，會有大問題。你有忠實搬運，但不能明明 UI 顯示只有一筆你抓了兩筆。"
   > (You need to consider this FHIR JSON may be used by other SMART apps I didn't develop. Putting the dedup responsibility entirely on the app side will be a big problem. You're faithful in transport, but you can't fetch 2 rows when the UI clearly only shows 1.)

## NHI multi-channel upload — A vs B (added 2026-05-29, v0.12.3)

**NHI 健保存摺 ships separate raw rows per upload channel for the same measurement.** Verified directly against `https://myhealthbank.nhi.gov.tw/api/ihke3000/ihke3409s01/page_load` 2026-05-29 — of 113 dup pairs in user's v0.12.1 bundle, 92 were NHI-side A+B pairs, not bridge transformer artifacts.

Channels:
- **A** = `特約醫事機構不定期上傳` (real-time-ish; typically carries English-shorthand display + numeric reference range)
- **B** = `特約醫事機構定期上傳` (batch sync; typically carries Chinese display + text-only reference range like `[無][無]`)

NHI's own UI dedupes some pairs visually but not consistently:
- Urinalysis (06013C) rows: both A and B shown side-by-side in UI
- Chem panel rows (Na/K/Ca/Cr): UI often collapses to a single row (most-recent upload), even when API ships both

**Key consequence**: an app dev who audits a SMART app's bundle and "verifies against 健保存摺 UI" will sometimes see N rows in the UI but find N+M rows in the FHIR bundle. The bundle is correct; the UI dedups silently for some panel families.

**Bridge handling (revised 2026-05-29 v0.12.4)**:

1. **`dedupNhiCrossChannelPairs()` runs in `mapObservationsGrouped` BEFORE `groupByOrderCode`**. When a group of rows shares (code, date, hospital, value, unit) AND contains exactly 1 A row + 1 B row, the A row is kept and B is dropped. The bundle ships one Observation per logical measurement.

2. **Surviving Observation carries the source channel** via `Observation.meta.tag` (system `http://nhi-fhir-bridge/nhi-source-channel`, code `A` or `B`). This is informational for downstream consumers who want to know which NHI channel sourced the data; it's NOT a signal for further dedup (the dedup has already happened).

3. **The extension adapter (`adaptLabItem` in `nhi-adapters.js`)** reads `orI_TYPE` / `orI_TYPE_NAME` from the raw NHI JSON and passes them as `nhi_source_channel` / `nhi_source_channel_name` on the adapted row.

4. **Same-source double-uploads (A+A or B+B) are NOT deduped** — those are real NHI duplicate-upload events worth preserving per the multi-reading rule. Only the cross-channel A+B pair is structurally an NHI artifact.

5. **`stableId` still includes `nhi_source_channel`** as a defensive ID-input — only matters for edge cases the dedup function didn't fire (e.g. only A row, or 3+ rows including A+B+something else).

**Why dedup bridge-side, not app-side**: the bundle is for general SMART app consumption (other apps the user didn't author). If bridge ships 2 obs per A+B pair and pushes dedup downstream, every consumer needs to implement the source-channel dedup themselves — that breaks FHIR interoperability.

**Auditing future "bundle has duplicate" claims**:
- First check whether the pair has different `nhi_source_channel` codes
- If YES (A+B pair) and rest of (code, date, hospital, value, unit) match → bug in `dedupNhiCrossChannelPairs`, fix it
- If different sources but different values → legitimate multi-reading, preserved
- If same source (A+A / B+B) → NHI true double-upload, preserved per faithful-transport rule

## Release approval workflow (added 2026-05-28)

**No release without explicit user OK.** Even for small fixes. The exact rule from user:
> 我沒同意 release 就不能 release

Steps before any commit-and-push that creates a release:

1. Show the preview / diff summary
2. Get explicit OK (e.g. "可以 push" / "全做" / "release 吧")
3. Then commit + push + tag

UI-affecting changes get a preview screenshot or live demo before approval (separate longstanding rule from earlier sessions).

## LOINC → preferred code.text canonicalization (deferred, soft request 2026-05-29)

App dev (MediPrisma) noted that for CBC analytes the bridge attaches one canonical LOINC but obs.code.text varies (mixed Chinese/English from different Taiwan EHRs). Their request: bridge could canonicalize LOINC → preferred text for CBC LOINCs (770-8 / 736-9 / 5905-5 / 713-8 / 706-2 / 4544-3 / 718-7 / 777-3 / 787-2 / 786-4 / 788-0 / 789-8) so app-side TEST_ALIASES table could retire.

**Critical caveat from app dev:** DO NOT normalize text when EHR sent a genuinely-different analyte label (e.g. v0.11.9 Bug 6 where 帶狀嗜中性白血球 was mis-routed to 770-8 panel-default). App today uses display text as mis-tag canary.

**Status: deferred.** Implementing requires a "clean match" detector in `findLoinc` so normalization fires only for unambiguous canonical-alias matches and stays a no-op for fuzzy substring routings. Non-trivial. App dev explicitly said it's not urgent (their alias table works).

If revisited:
- Add CBC LOINC entries to `LOINC_SHORT_TEXT` (each WebFetch-verified)
- Add a `displayMatchedCleanly` signal threading from `findLoinc` → `buildObservation`
- Apply LOINC_SHORT_TEXT to obs.code.text ONLY when matched cleanly; preserve raw display otherwise
- Add CI regressions for both directions (clean match → canonical; fuzzy match → raw preserved)

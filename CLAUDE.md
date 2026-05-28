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

7. **Multi-reading preservation + strict no-dedup.** User-defined (2026-05-29, reinforced 2026-05-29 v0.12.1):
   - 健保存摺 sometimes ships multiple legitimate readings per panel per day (ABO has 2 typing arms, ICU patients can have multiple same-value draws/day, etc.)
   - `stableId` includes `value` so distinct readings under same NHI code+display+date don't collapse
   - **Bridge does NOT judge data validity.** Even when LIS uploads look duplicate, identical-value, or structurally implausible by clinical standards, the bridge preserves them. The user (or the SMART app) decides what to do with such data.
   - **Specifically forbidden:**
     - Post-emission Observation dedup by `(LOINC, value, date, hospital)` — looks-the-same is not enough; ICU same-value draws happen
     - Dropping Observations whose value pattern is "structurally impossible" for the LOINC's analyte (e.g. ABO obs with `+` value, Rh obs with `B` value) — bridge can't tell forward/reverse typing from cross-contamination
     - Collapsing rows because their placeholder unit encodings ("空白空白" / "-") differ but both mean "no unit" — dedup keys must use the raw unit string
   - **Exceptions (allowed):**
     - **LOINC mapping corrections** — incorrect LOINCs may be rerouted to correct ones (v0.11.13 9a INR-sec → PT). The Observation still emits with the corrected LOINC; no data loss.
     - **Specimen quality flags** (`溶血` / `脂血` / icterus) are filtered because they are not patient measurements and would not be modelled as Observations under FHIR R4 regardless of LIS encoding.
     - **Unit string cleanup** in `_canonicalizeUnit` — placeholder strings are stripped from the emitted `Quantity.unit` field (FHIR R4 requires valid UCUM or absent), but this happens AFTER dedup so it never affects observation count.

## NHI multi-channel upload — A vs B (added 2026-05-29, v0.12.3)

**NHI 健保存摺 ships separate raw rows per upload channel for the same measurement.** Verified directly against `https://myhealthbank.nhi.gov.tw/api/ihke3000/ihke3409s01/page_load` 2026-05-29 — of 113 dup pairs in user's v0.12.1 bundle, 92 were NHI-side A+B pairs, not bridge transformer artifacts.

Channels:
- **A** = `特約醫事機構不定期上傳` (real-time-ish; typically carries English-shorthand display + numeric reference range)
- **B** = `特約醫事機構定期上傳` (batch sync; typically carries Chinese display + text-only reference range like `[無][無]`)

NHI's own UI dedupes some pairs visually but not consistently:
- Urinalysis (06013C) rows: both A and B shown side-by-side in UI
- Chem panel rows (Na/K/Ca/Cr): UI often collapses to a single row (most-recent upload), even when API ships both

**Key consequence**: an app dev who audits a SMART app's bundle and "verifies against 健保存摺 UI" will sometimes see N rows in the UI but find N+M rows in the FHIR bundle. The bundle is correct; the UI dedups silently for some panel families.

**Bridge handling**:
1. Both A and B rows are preserved per strict no-dedup rule (rule #7 above)
2. `stableId` for Observation includes the raw NHI source channel so A and B rows with otherwise-identical canonical/code/date/hospital/value/unit don't collide at the `seenObsIds` step
3. The channel is surfaced as `Observation.meta.tag` with system `http://nhi-fhir-bridge/nhi-source-channel` and code `A` or `B`, so SMART apps can dedup-by-source as a UI choice without requiring the bridge to encode that judgement
4. The extension adapter (`adaptLabItem` in `nhi-adapters.js`) reads `orI_TYPE` / `orI_TYPE_NAME` from the raw NHI JSON and passes them as `nhi_source_channel` / `nhi_source_channel_name`

**Auditing future "bundle has duplicate" claims**: before investigating bridge transformer logic, check whether the duplicate pair has different `orI_TYPE` source channels. If yes, it's NHI multi-channel — not a bug.

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

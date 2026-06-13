# Project Memory — NHI-FHIR-Bridge

Standing rules that survive across sessions. Update when the user adds a new rule.

## 測試資料身分證規則 (added 2026-06-12, audit P0-1 post-mortem)

**Committed 檔案中禁止 checksum-valid 的台灣身分證。** 一組真實身分證＋姓名＋生日曾隨 v0.18.1 進入公開 repo（2026-06-12 已以 git filter-repo 重寫全史清除＋force push）。規則：

- 測試假資料一律用 **checksum 故意無效**的合成碼（如 `F223456789`、`P123456789`、`B223456789`）。唯一允許的 checksum-valid 例外：`A123456789`（眾所周知的規格書範例，列在 guard 的 allowlist）。
- CI gate：`scripts/check-no-real-twid.mjs`（backend-ts.yml 第一個 step）— 掃描所有 git-tracked 檔案，比對 `[A-Z][12]\d{8}` 且通過官方 checksum 即 fail。
- 文件/註解引用真實病人案例時（即使已半遮如 `F10375XXXX`），改用通用占位符（"probe patient" 等）；日期可保留當 breadcrumb。
- fixtures 不可用真實擷取原樣 commit：日期需逐檔年份平移、小型院所/藥局/電話改合成值、`_note` 標明 sanitized。

## 去識別化 Patient.id 派生 (added 2026-06-12, audit P1-1)

de-identify toggle 開啟時，`Patient.id` 必須由**半遮後** ID 派生（`effectiveFhirPatientId(idNo, deidentify)`，mapper 單一真相來源）— 因 TWID 空間僅 ~3×10⁸，無鹽 SHA-1(全碼) 可秒級暴力還原，等於把遮罩拆掉。本機 bundle、backend 上傳（經 `deidentifyOverride` 先遮）、popup 查詢、SMART launch 四條路徑都走同一派生；新增任何跨路徑 patient-key 邏輯時禁止另起爐灶。

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
   - **v0.13 — CBC LOINC clean-match gate**: 12 CBC LOINCs in `CBC_CANONICAL_TEXT_LOINCS` (770-8 / 736-9 / 5905-5 / 713-8 / 706-2 / 4544-3 / 718-7 / 777-3 / 787-2 / 786-4 / 788-0 / 789-8) only get LOINC_SHORT_TEXT canonicalization when `findLoincDetailed.cleanMatch === true` (path A/B1/B). Path-C panel-default fallbacks keep raw display so mis-tag canary (v0.11.9 Bug 6 lesson) stays visible. Other LOINCs in LOINC_SHORT_TEXT keep the v0.11.10 "always canonicalize" behavior (single-analyte panels, path A only → no canary needed).

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
   - **Verify the NEGATIVE too (added 2026-06-13, 尿黏液 post-mortem).** Before LEAVING an analyte unmapped because "no clean LOINC exists," you must WebFetch-search loinc.org for that Component and confirm none fits — asserting a negative without searching is how 黏液/Mucus shipped uncoded for months when 8247-9 existed all along. Multi-axis selection among candidates: match Scale (Qn count vs Ord presence) + System (Urine vs Urine sed) + Method to the ACTUAL result shape AND to how sibling analytes in the same panel are already coded.
   - **Panel-default LOINC is suppressed on the Observation output (added 2026-06-13).** When a DISPLAY_FIRST panel sub-analyte's display matches no analyte key, `findLoincDetailed` still returns the panel's own LOINC with `cleanMatch=false` (needed internally — it's the grouping key that dedups NHI A+B unresolved-analyte pairs), BUT `isPanelDefaultFallback()` strips it from the emitted `Observation.code.coding` so apps never see a panel code mis-tagged onto an analyte (e.g. 24356-8 "Urinalysis complete panel" on a single sub-row). The obs degrades to NHI-code-only + raw display. The panel-level LOINC still rides on the `DiagnosticReport.code` (correct — the DR IS the panel). Never re-introduce the panel LOINC into per-analyte output coding.

6. **Faithful transport principle.** User-defined (2026-05-28):
   > 我的 faithful transport 是不能亂加健康存摺上沒有的 data，或者亂改，但 LOINC 對應是可以的。
   - Patient values / dates / hospitals / units: NEVER modify
   - LOINC mapping corrections: allowed (with WebFetch verification)
   - Label normalization in `code.text`: allowed (free-form per FHIR R4)
   - Filtering non-patient rows (QC / quality / narrative): allowed and required

7. **(NHI 醫令碼, display) is a dual-source signal — never trust only one. (added 2026-05-30 v0.13.0)** User-articulated after specimen mis-tag bug post-mortem:

   > 只靠 name 會有錯誤，只靠 NHI 碼會有錯誤 — 要同時看兩個。

   The bug history confirms this from both sides:
   - **Display-only pitfalls**: substring matches (`尿酸` triggers bare `尿` → wrong specimen Urine in v0.12.6); sub-analyte alias misses (`帶狀嗜中性白血球` not in PANEL_LOINC_MAP keys → falls back to wrong panel default LOINC in v0.11.9 Bug 6)
   - **NHI-code-only pitfalls**: LIS mis-billing (urine creatinine shipped under 09015C blood-default code → row is actually urine despite catalog default); panel-default LOINC can't distinguish sub-analytes (every CBC row under 08011C would collapse to 24317-0 if display ignored)

   The right architectural pattern (now applied consistently to LOINC + specimen):
   - **NHI 醫令碼 → provides panel context** (which family the code belongs to: 06=urinalysis, 08=hematology, 09=chemistry; LOINC default for single-analyte codes via NHI_TO_LOINC; specimen default via NHI_CODE_PREFIX_SPECIMEN)
   - **Display → provides analyte specificity + override** (sub-analyte routing via PANEL_LOINC_MAP keys; specimen override when LIS-shipped display contradicts NHI catalog default, e.g. `肌酸酐(尿液)` under 09015C)
   - **Cross-reference order**: explicit display marker / panel-key alias → other-specimen rules → NHI code default → display/order_name regex fallback for unknown codes
   - **Disagreement is informative**: when display URINE-marker contradicts the code's BLOOD default, that's the mis-billing signal we honor (display wins for actual measurement). When display contains no specimen marker, NHI code default fills in (06013C "Color" still gets Urine specimen).
   - **Two parallel alias tables = structural problem (v0.13.1 lesson)**: if one helper consults `PANEL_LOINC_MAP`, another consults `CODE_SCOPED_SYNONYMS`, and a third hard-codes its own list — the three WILL drift as features are added asymmetrically. v0.13.0 dedup missed 98 CBC A+B pairs because `canonicalLabKey` (CODE_SCOPED_SYNONYMS, only had 06013C urinalysis) returned different keys for "MCV" vs "平均紅血球容積" while `findLoinc` (PANEL_LOINC_MAP, had CBC variants) routed both to 787-2. Fix: dedup now reuses `findLoincDetailed` so LOINC routing AND dedup grouping share single source of truth. **Architectural rule**: any cross-reference downstream logic should reuse the same routing function — not maintain its own parallel alias table.

8. **Silent-bug CI gate practice (added 2026-05-30 v0.13.0).** User-driven after the specimen mis-tag was found only by app dev's manual audit, not by CI:

   > Specimen mis-tag 是 silent bug — 這個要怎麼在 test 被加入測到？

   Silent bugs are characterised by: no FHIR validator catch, no runtime error, just wrong downstream routing in consuming apps. They're invisible until someone audits a real bundle by hand. To proactively gate them:

   - **Enumerate (input, expected output) tables** for the invariant being checked. Example: `bundle-quality.test.ts > "CI invariant — specimen.display vs NHI 醫令碼 consistency"` lists ~25 (NHI code, display) pairs → expected specimen.
   - **Run the bridge** for each row, assert specimen matches expectation. Failures aggregate into a single error message (so all violations show in one CI run, not a flurry of fail/pass cycles).
   - **Add a row to the table** every time a new silent-bug case is discovered (whether from app dev audit, NHI catalog audit, or proactive guess). The table grows monotonically as bridge coverage expands.

   This pattern applies to any LIS / NHI signal that's silent on failure:
   - specimen.display vs NHI 醫令碼 (v0.13)
   - LOINC routing vs NHI_TO_LOINC entry (informally covered by bug-9a structural tests)
   - obs.code.text vs LOINC scale (e.g. Qn value should not pair with Ord LOINC — future)
   - meta.tag presence / absence (v0.12.3 source-channel, v0.13 visit-date)

9. **Multi-reading preservation + targeted dedup (revised 2026-05-29 v0.12.4).** User-defined principle:

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

10. **NHI 醫令碼的「碼義 / 單項 vs panel」必須先確認，再決定 LOINC 與分類。 (added 2026-06-09, after 06012C silent mis-tag)** User-driven after 06012C (尿液一般檢查, a full 18-analyte urinalysis panel) was found shipping all 18 sub-analytes under LOINC 5778-6 "Color of Urine":

    > 06012C 我查健保碼是尿液常規的意思，那被歸成顏色也很離譜，還是我們多一個規則，以後關乎 NHI 碼的部分也需要先 web search 確認內容正確。

    Rule #5 verifies the *LOINC* side (loinc.org confirms the target code's Component/Property/System/Method). Rule #10 closes the symmetric gap on the *NHI* side: **before adding or changing any `NHI_TO_LOINC` entry or panel classification, confirm what the NHI billing code actually bills for** — a single analyte vs a multi-analyte panel. A panel code given a single sub-analyte's LOINC is a silent bug (FHIR validator passes; every sub-row collapses to one wrong analyte).

    Trigger: any new/modified `NHI_TO_LOINC` entry, `DISPLAY_FIRST_CODES` membership, or `PANEL_LOINC_MAP` table.

    Procedure:
    1. **Read `ordeR_NAME` first.** Panel-indicating phrasing — `一般檢查` / `常規` / `分類計數` / `包括…等` / English `panel` / `profile` — means it is NOT a single analyte. A single LOINC for such a code is wrong.
    2. **Confirm scope** against NHI 支付標準 / web search (the code's official 項目名稱 + 內容).
    3. **Panel invariant** — a panel code MUST be in `DISPLAY_FIRST_CODES` AND have a `PANEL_LOINC_MAP` sub-analyte table; its `NHI_TO_LOINC` value may only be a **panel-level** LOINC used as the Step-C best-effort fallback (kept cleanMatch=false so the mis-tag canary stays visible). A single-analyte code may keep the Step-A short-circuit.
    4. **`coding[nhi].display` stays verbatim** (rule #1) regardless.
    5. **Add a rule #8 CI invariant row** for the (code, display)→LOINC mapping.

    Architectural root cause (the asymmetry that let 06012C through): specimen inference already uses prefix-family logic (`NHI_CODE_PREFIX_SPECIMEN`: 06→Urine works for ANY 06 code), but LOINC routing's Step-A trusts `NHI_TO_LOINC[code]` for ANY code not explicitly listed in `DISPLAY_FIRST_CODES` — so a panel code accidentally omitted from that set short-circuits to its (wrong, single-analyte) default AND is marked cleanMatch=true, silencing the canary. The durable fix is a single-source-of-truth analyte table reused by all urinalysis panel codes + specimen-qualified global keys (`尿蛋白`, never bare `蛋白`) so standalone urine tests under unrecognized codes route safely. **Shipped v0.18.2 (2026-06-09)**: `URINALYSIS_ANALYTE_KEYS` const shared by `PANEL_LOINC_MAP["06012C"]` AND `["06013C"]` (same object — can't drift); 06012C added to `DISPLAY_FIRST_CODES`; `NHI_TO_LOINC["06012C"]` 5778-6 → 24356-8 (panel-level Step-C fallback); 6 sediment-microscopy LOINCs WebFetch-verified (5787-7 / 5821-4 / 5808-1 / 25145-4 / 5783-6); specimen-qualified global urine keys added for scenario-D standalone tests. CI: `bundle-quality.test.ts > "CI v0.18.2 — 06012C urinalysis panel"`. **Update 2026-06-13 (SMART app dev report)**: 黏液/Mucus was previously left unmapped → fell to the Step-C panel default 24356-8, which is the COMPLETE-PANEL code, not a mucus analyte (app dev correctly flagged the panel-on-analyte mis-tag). The "no clean urine-mucus LOINC" assumption was wrong: `黏液/mucus → 8247-9` "Mucus [Presence] in Urine sediment by Light microscopy" (WebFetch loinc.org/8247-9, single observation, Scale Ord). Also corrected `LOINC_DISPLAY["24356-8"]` "Urinalysis Macro Panel" → "Urinalysis complete panel - Urine" (the Macro name is 24357-6's; 06012C = dipstick+microscopy = complete panel, so the code was right, only the display string wrong).

## NHI imaging ori_TYPE A/B/E channels (added 2026-06-04, v0.15; simplified 2026-06-05 v0.15.5)

**`ori_TYPE` is an upload-channel label, NOT a candidacy signal.** Verified directly against `https://myhealthbank.nhi.gov.tw/api/ihke3000/IHKE3408S02/page_load?crid=...&ctype=...` 2026-06-04 by reading `ori_TYPE_NAME` field in detail body (NHI's own plain-Chinese label):

- **A** = `特約醫事機構不定期上傳` (on-demand upload).
- **B** = `特約醫事機構定期上傳` (scheduled upload).
- **E** = `特約醫事機構影像上傳` (image upload).

The labels describe HOW the row was uploaded, not WHAT it carries — any channel can hold a narrative `desc` and any channel can hold an image. **All image-candidacy decisions look ONLY at `jpG_STATUS`:**

- `"1"` + `ipL_CASE_SEQ_NO` populated → fetch bytes (any channel)
- `"A"` → trigger via `/IHKE3408S02/add` (any channel)
- `"2"` → no image, skip

### Evolution of the rule

| Build | Behavior | Why wrong |
|---|---|---|
| v0.14 | Trigger any `status=A` | Correct in retrospect, just had the rownum bug (POST body hard-coded `"-3"`) so most triggers silent-failed |
| v0.15.0-v0.15.3 | Trigger only `ori=E status=A`; fetch only `ori=E status=1` | First probe patient had 6 `status=A × A` rows that stayed at A after triggers → wrongly classified as "phantoms" (was actually the rownum bug) |
| v0.15.4 | Drop channel filter from cached-bytes gate | 某探針病人 showed 3 `status=1 × A` rows with valid seq + imG_SIZE dropped silently — proved A can carry images |
| v0.15.5 | Drop channel filter from trigger gate too | Symmetric simplification — if status=A × A rows are genuinely phantoms (no image source), post-verify silent-fail detection catches them cleanly, no pending stash pollution |

### Phantom protection

If some `status=A` rows are genuinely phantoms (NHI's `/add` accepts but doesn't queue), bridge's post-verify check sees `jpg_STATUS` still `"A"` → outcome `direct-api-silent-fail` → row does NOT go into pending stash, breakdown shows it under `健康存摺拒收`. Wasted cost ~2s/phantom-row, capped by the 90s trigger-loop wall-clock budget.

### Where `ori_TYPE` is still used

Only as a shape-signature discriminator in `refreshSeqMapAndShapeMap` (matching precision when NHI re-keys rids post-prep) — not as a candidacy gate.

Bridge implementation (v0.15.5):
```js
const hasReadyBytes = status === "1" && listIplSeq && listIplSeq !== "-";
const needsTrigger = status === "A";
const isCandidate = hasReadyBytes || needsTrigger;
```
2. **Narrative emission**: `adaptImagingReportFromDetail` runs on ALL row types (A/B/E) — `desc` text comes from A/B, the channel filter only gates image triggering. A and B `desc` content is dedup-merged via `dedupImagingItems` (see below).
3. **Sweep auto-evict** (`sweepPendingImaging` in `nhi-imaging-jpeg.ts`): pending entries whose rid resolves to ori_TYPE != "E" in the current list are removed — they're left-over from pre-v0.15 builds that didn't gate by channel.
4. **Imaging dedup** (`dedupImagingItems` in `packages/mapper/src/imaging-dedup.ts`): groups by (code, date, hospital). Within a group, content-hashes JPG payloads to merge same-content E-rows; folds 1 narrative-only item (A or B `desc`) + 1 image-only item (E with frames) into 1 DR with both narrative + frames.

Live-probed cross-tab on a real patient (184 rows total):
- status=1 × E: 42  (image ready, cached)
- status=A × E: 30  (image needs trigger)
- status=A × A:  6  (no-image channel mis-marked status=A — phantom)
- status=2 × A: 53  (narrative-A, no image expected)
- status=2 × B: 51  (narrative-B, no image expected)
- status=2 × E:  2  (image triggered, NHI preparing)

C/D channels exist in NHI schema but absent from this probe. Treat them defensively the same way as A/B (narrative, no image) unless future evidence contradicts.

## NHI imaging trigger flow — SW-direct fetch protocol (added 2026-06-05, v0.15)

**v0.15 replaced the hidden-tab Vue-click trigger with a service-worker direct fetch.** ~10× faster (~2s/row vs ~10-15s/row), no tab side effects, no DOM races, no Vue introspection. Verified live 2026-06-05 via Chrome MCP sniffing on a fresh-case patient + multiple full syncs.

### Three-step protocol per row

1. `GET /api/ihke3000/IHKE3408S02/page_load?crid=<rid>&ctype=<ctype>` — establishes NHI's server-side "current row" context AND returns the row's `rownum` (per-row sentinel).
2. `POST /api/ihke3000/IHKE3408S02/add` body `{"ipl_CASE_SEQ_NO": "<rownum from step 1>"}` — queues NHI's lazy prep.
3. (verification) `GET …/page_load` again — row's `jpg_STATUS` should flip `"A"` → `"0"` (preparing).

### Critical gotcha: `ipl_CASE_SEQ_NO` is the row's **`rownum`**, not a fixed sentinel

The very first Chrome MCP sniff in Part B captured a single row whose `rownum` happened to be `"-3"`. v0.15 initially hard-coded `"-3"` as the POST body's `ipl_CASE_SEQ_NO` for every row, thinking it was a universal sentinel. Result: NHI's `add` handler returned `{"status":"Y","message":"申請載入影像檔時發生錯誤。"}` for every other row — silent reject with literal error in the message body. Verified live: row `AAtEGaABMAAJummAAn` → rownum `"-10"`, row `AAtEGaABMAAJumRAAE` → rownum `"-7"`, row `AAtEGaABMAAJumRAAC` → rownum `"-5"`. ALL DIFFERENT.

Fix: extract `setupResp.body.ihke3408S02_main_data[0].rownum` from step 1's response and put THAT into the POST body. With matching rownum, the same direct-API path that previously failed succeeds reliably.

### `status` field in `/add` response is NOT a success indicator

NHI's `/add` response is `{"status":"Y","message":"..."}` on BOTH accept and reject:
- Accept: `{"status":"Y","message":"已申請載入影像檔。"}`
- Reject (rownum mismatch): `{"status":"Y","message":"申請載入影像檔時發生錯誤。"}`

`status:"Y"` is a fixed contract field — DO NOT trust it. The only reliable acceptance signal is step 3's verification (status flipped A→0).

### NHI re-keys row_ID after prep completes — shape-based fallback match

**After NHI finishes preparing a triggered row, it DELETES the original status=A row (with rid like `AAtEGa…`) and CREATES a brand-new row with status=1 and a DIFFERENT rid (like `AAAyWRAF3AAFB…`).** Verified live 2026-06-05: 3 rids I triggered yesterday via MCP were entirely absent from today's list dump; all status=1 × E rows in today's list had a different rid prefix family from the status=A × E rows.

Bridge implication: direct rid lookup in poll-fetch's list refresh NEVER finds the rid we triggered. The triggered row appears as `triggered-waiting` even after NHI completed prep and bytes are fetchable under the new rid.

Mitigation (`pollFetchImagingJpegs` in `nhi-imaging-jpeg.ts`):
1. **`refreshSeqMapAndShapeMap()`** builds BOTH a `rid → seq` map AND a shape map keyed by `(order_CODE | real_INSPECT_DATE | hosp_ABBR | ori_TYPE)` → list of `{rid, seq}` for current status=1 × E rows.
2. **`consumedRids` set** is seeded with all already-cached candidates' rids so the shape fallback doesn't redirect a triggered row's match to a rid the direct-fetch path is already using.
3. **`resolveSeqForReq()`** tries direct rid match first; on miss, looks up the row's shape in shapeMap and picks the first un-consumed candidate. Mutates consumedRids on success so sibling triggered rows with the same shape don't collide.
4. Both the poll loop AND final-attempt block use the same resolution function.

### mainMeta MUST be sourced from the LIST row, not the S02 detail body

Shape match compares `mainMeta` field values against shapeMap field values built from the S01 list refresh. If `mainMeta` is sourced from S02 detail (`visit`), field values can differ from S01 (hospital short name vs full name, date format, code with/without "C" suffix) → shape signature mismatch → row stuck in `triggered-waiting`.

Verified live 2026-06-05: cap=Infinity with 7 triggered rows → 5 shape-matched successfully, 2 missed because their S02 detail's `hosp_ABBR` value didn't match S01's `hosp_ABBR` for the same logical exam. Fix: `fetchImagingDetails` sources `mainMeta.date / orderCode / orderName / hospital` from `listRow` first, `visit` (S02 detail) only as fallback for rare missing fields.

### Slow-network resilience: batched concurrency + retry

20+ parallel S03 fetches with 1-3 MB each saturate slow links → individual fetches hit the 30s timeout. Verified live 2026-06-05 (user on weak signal): 20/20 ready candidates → 10 succeeded, 10 fetch-failed. Fix:

- **`runBatched(items, 5, fn)`**: chunks items into windows of 5, processes each window with Promise.all internally, awaits before next window. Caps in-flight bandwidth share.
- **`fetchJpgWithRetry(seqNo, 2)`**: 2 attempts with 1.5s backoff. Retries on transient errors only: `timeout`, `HTTP 5xx`, `HTTP 429`, `Failed to fetch`, `NetworkError`, or 200-OK-but-empty-pics. Does NOT retry on `SESSION_EXPIRED` (let outer handle) or `HTTP 4xx` (deterministic). Step A (cached rows) uses retry because failures here are unrecoverable in the current sync; Step C (poll loop) uses batching only — poll has natural retry via multiple cycles.

Same `runBatched(5)` applied to SW-side `sweepPendingImaging` (previous-sync recovery).

Same patient + sync after the fix: 20/20 cached succeeded, 0 fetch-failed, total sync time 1m41s (was 1m47s with 10 failures — slightly FASTER because batching avoids the network thrashing of 20-parallel saturation).

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

## CBC LOINC code.text canonicalization (shipped v0.13.0, 2026-05-30)

App dev (MediPrisma) soft request 2026-05-29 → user accepted 2026-05-30 → shipped v0.13.0.

12 CBC LOINCs (770-8 / 736-9 / 5905-5 / 713-8 / 706-2 / 4544-3 / 718-7 / 777-3 / 787-2 / 786-4 / 788-0 / 789-8) live in `CBC_CANONICAL_TEXT_LOINCS` and get LOINC_SHORT_TEXT canonical text on `obs.code.text` — but **only when `findLoincDetailed.cleanMatch === true`** (path A NHI_TO_LOINC / path B1 PANEL_LOINC_MAP / path B LOINC_MAP). Path-C panel-default fallbacks keep raw NHI display so mis-tag canary remains.

Mechanism (`packages/mapper/src/observation.ts`):
- `findLoincDetailed(code, display) → { loinc, cleanMatch }` — wraps existing routing logic, reports HOW the LOINC was found
- `resolveObsCodeText(loinc, code, display, cleanMatch)` — applies SHORT_TEXT only if (LOINC NOT in CBC_CANONICAL_TEXT_LOINCS) OR cleanMatch=true
- `findLoinc()` preserved as thin wrapper for backward compat / external tests

Caveat: v0.11.11 #8 single-obs DR text propagation can still overwrite the gate's "keep raw" choice when an unknown-display row falls under a single-leaf NHI code (08003C / 08004C / 08006C — NHI_TO_LOINC values 718-7 / 4544-3 / 777-3 all in CBC set). In those single-row cases the DR title (= canonical short text) propagates regardless. Considered acceptable: the NHI billing code itself unambiguously identifies the analyte for these single-leaf codes, so the canonical label IS correct even when display is malformed. Multi-row 08011C / 08013C cases (where the gate's mis-tag canary matters most) are unaffected.

CI invariants (`backend-ts/tests/unit/bundle-quality.test.ts` "CI v0.13 — CBC obs.code.text canonicalization"):
- Clean match → canonical text ("HGB"/"Hb"/"Segment" → "Hb"/"Hb"/"Neutrophils %")
- Non-CBC LOINC (4548-4 HbA1c) keeps v0.11.10 always-canonicalize behavior
- Non-CBC LOINC outside our 12 set (6690-2 WBC count) keeps raw text
- Multi-row 08011C with mixed clean / unknown rows → clean canonical + unknown raw preserved (canary)

## NHI funC_DATE (就醫日期) surfaced via meta.tag (shipped v0.13.0, 2026-05-30)

User-verified anomaly 2026-05-30: 長庚嘉義 09006C HbA1c row has reaL_INSPECT_DATE=2025-12-09 but funC_DATE=2025-09-16 — ~3 months apart. Cause indeterminate from NHI data alone (hospital late report vs roving outpatient lab order vs system bug); bridge cannot judge per the faithful-transport rule.

v0.13.0 surfaces funC_DATE separately from effectiveDateTime:
- `Observation.effectiveDateTime` stays on `reaL_INSPECT_DATE` (FHIR R4 "physiologically relevant time" for a lab; preserves v0.6.1 fix)
- `Observation.meta.tag` carries funC_DATE under system `http://nhi-fhir-bridge/nhi-visit-date` (ISO 8601 date as `code`)
- Mechanism mirrors v0.12.3 nhi-source-channel pattern — bridge-namespaced URI, non-breaking for apps that don't know it (FHIR R4 Meta.tag spec: "applications are not required to consider the tags")
- Bridge does NOT decide which date is "correct" — both are NHI-supplied facts; downstream apps can detect gaps and surface UI warnings

Adapter (`extension/src/nhi-adapters.js`): `adaptLabItem` adds `nhi_visit_date: rocToISO(item.funC_DATE)` alongside existing `date` field.

CI invariants ("CI v0.13 — NHI 就醫日期 (funC_DATE) surfaced as meta.tag"):
- Gap case (inspect 12/9, visit 9/16) → both surface, effectiveDateTime unchanged
- No funC_DATE → no spurious empty meta.tag
- funC_DATE === date → tag still emitted (no smart suppression)

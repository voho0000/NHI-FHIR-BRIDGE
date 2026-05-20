# Changelog

All notable changes to NHI-FHIR-Bridge are documented here.
Newest first. GitHub Releases page keeps the latest version only; this file is the authoritative history.
## 0.8.5 重點 — 2026-05-21

純 UX patch — popup sync 進度條更友善，user 不會以為當機。

**新功能**
- ⏱️ **長時間 fan-out 加 elapsed-time ticker**：v0.8.4 修好 detail URL 後 sync 時間從 ~32s 變 ~1m30s（NHI 後端 detail JOIN 真的有 cost）。之前 popup 訊息靜止顯示「📥 取得 163 筆就醫紀錄詳情…」一分鐘看起來像當掉。本版每 3 秒更新 elapsed 秒數，message 像「📥 取得 163 筆就醫紀錄詳情…（已 27 秒，NHI 後端 detail JOIN 較慢）」。套到 5 個長 fan-out：就醫紀錄、影像、處置、慢箋、用藥。

**升級注意**
- Reload extension。純 UX 改動，bundle 內容跟 v0.8.4 完全一樣。

---

## 0.8.4 重點 — 2026-05-21

**Critical 修法** — IHKE3303S02 detail endpoint URL 用錯參數從 v0.6.x 起靜默失敗了好幾個月，三個 feature 都默默沒 work。

**Bug 修正**
- 🚨 **IHKE3303S02 detail URL 修正** (`rid=&t=` → `crid=&ctype=`)：之前 URL 套了 NHI UI 路由的參數格式、不是真實 API 的參數，每次 detail fetch 都回 `{"ihke3303S02_main_data":[]}` 空 array 但 HTTP 200（error handler 抓不到）。三個 features 都因此靜默退化：
  - **v0.6.x classHint** 從 detail 拿 `hosp_DATA_TYPE_NAME` — 全部 fallback "AMB"。原本 ER (急診) 應該是 EMER、住院應該是 IMP，**全部被誤標 outpatient**（IHKE3309 / IHKE3308 來源的住院 Encounter 不受影響）。
  - **v0.8.1 次診斷** — bundle 永遠 0 個次診斷。
  - **v0.8.3 primary ICD bilingual** — 永遠 fallback S01，IHKE3303 list 對某些病人只 ship 中文 → Encounter.reasonCode 英文 display 缺失。
- 🧪 **新增 URL contract regression test**：未來新 detail endpoint 寫錯 param style → CI 紅燈。Sanity-verified 把 URL 改回壞的 test 會 fail 並指出 offender。

**升級注意**
- Reload extension + 重 sync 一次就會拿到全部修好的資料。
- 預期效果：(a) 部分 Encounter 從 `class.code="AMB"` 變 `"EMER"` 或 `"IMP"` (b) 多診斷的 visit 會出現 reasonCode[1..N] (c) `reasonCode[0].coding[0].display` 對更多病人是英文。
- Sync 時間從 ~32s 變 ~1m30s 是預期 — 之前是「快速回空」假象、現在 NHI 真的做 DB join 抓 detail。

---


## 0.8.3 重點 — 2026-05-21

修 v0.8.0 雙語契約對 `Encounter.reasonCode` 的覆蓋率漏洞。

**Bug 修正**
- 🐞 **Encounter ICD 英文 description 補齊**：v0.8.0 起 `MedicationRequest.reasonCode[0].coding[0].display` 都是英文 ✓；但同一份 bundle 裡的 `Encounter.reasonCode[0].coding[0].display` 卻常是中文。原因：IHKE3303**S01** list 對某些病人只 ship 中文 ICD 描述（沒雙語 `||`），舊版 adapter fallback 成中文 fill 進 display。本版改從 IHKE3303**S02** detail（一定 ship 完整雙語）抓 primary ICD bilingual — 我們已經 fetch detail 拿 class hint + 次診斷，順手把 primary 也補上、零額外請求。修完後 `Encounter` 跟 `MedicationRequest` 兩邊行為一致，民眾/醫療雙視角切換都能 work。

**升級注意**
- Reload extension + 重 sync 才會拿到完整雙語的 Encounter。
- 順便確認次診斷 (v0.8.1) 也都在新 bundle 裡 — 之前 (5).json 若 0 個次診斷，可能是更早版本的 sync 結果。

---


## 0.8.2 重點 — 2026-05-20

修一個 v0.8.0 沒接乾淨的尾巴。Extension local-mode 下載的 FHIR Bundle 缺 Immunization。

**Bug 修正**
- 🐞 **下載 Bundle 補上 Immunization**：v0.8.0 加了疫苗 endpoint + mapper，但 extension 在組裝 local Bundle 時 iterate 的是一份 hard-coded `_LOCAL_PAGE_TYPE_ORDER` 白名單、忘了加 `immunizations` — sync 完 popup 正確顯示「疫苗 N 筆」，但下載的 .json 一個 Immunization 都沒有。本版補上、加 regression test（未來新增 page_type 漏接會立刻 CI 紅燈）。

**升級注意**
- Reload extension + 重 sync 才會拿到含 Immunization 的 Bundle。

---

## 0.8.1 重點 — 2026-05-20

`Encounter.reasonCode[]` 新增次診斷 (次診斷 1-N)。純加法、舊 SMART app 不會 break。

**新功能**
- 🩺 **次診斷納入 `Encounter.reasonCode[]`**：之前每筆 Encounter 只有 1 個主診斷；現在從 IHKE3303S02 detail 抓出 `icdcode_data[]` (健保存摺上的「次診斷1、2、3、4」)，每筆 append 為一個 `reasonCode[]` entry，跟主診斷同形狀（ICD-10-CM coding + 雙語 text）。觀察某眼科病人案例最多到 4 個次診斷（青光眼 + 黃斑部皺褶 + 視網膜水腫 + 第三對腦神經麻痺）。**順序契約**：`reasonCode[0]` 永遠是主診斷，後面照 NHI 回傳順序是次診斷 1、2、3...。

**升級注意**
- 重 sync 拿新的次診斷資料（IHKE3303S02 detail 本來就會抓，零額外請求）。
- SMART app 若只讀 `reasonCode[0]` 行為不變；想顯示完整診斷可改 iterate 整個 array。

---

## 0.8.0 重點 — 2026-05-20

三個 FHIR 輸出合約變動同時出：藥局 Encounter 區分、CodeableConcept 雙語、新 Immunization resource。Minor bump 是因為輸出多了新欄位與新 resource type。

**新功能**
- 🏥 **藥局 Encounter 改標 `type="藥局"`**：之前 IC 卡的藥局領藥事件跟診所看病一樣標 `"IC卡資料"`，下游 SMART app 沒辦法用結構化欄位區分藥局 vs 診所。本版對藥局事件直接寫 `text="藥局"`、其他事件不變，detection 一行命中。健保存摺申報資料本來就不放藥局，bridge 跟隨這個設計、不合成多餘 Encounter。
- 🌐 **CodeableConcept 雙語 (民眾版 + 醫療版)**：藥名、藥理分類、ICD 描述、處置名稱現在 `.text` 是繁中（民眾讀）、`coding[0].display` 是英文（醫療人員讀）。NHI 本來就 ship 雙語在這些欄位，之前 `pickEnglish()` 把中文半邊丟了。順手修了 reasonCode `"I359 I359/Nonrheumatic..."` 重複 code 的舊 bug。
- 💉 **新 `Immunization` resource**：抓 NHI 預防接種紀錄 (IHKE3203S01，疾病管制署為來源)，流感、COVID-19 (BNT/莫德納/AstraZeneca) 都涵蓋。`vaccineCode.text=中文`、自動從 `(批號XXX)` 解析 `lotNumber`、`performer.actor.display=接種院所`。

**升級注意**
- 重 sync 拿新的雙語 + Immunization 資料。
- 若 SMART app 之前用 `.text` 給醫療人員看技術藥名（剛好之前 text 跟 coding.display 都是英文混著用），現在 `.text` 變繁中、要改讀 `coding[0].display`。詳見 SMART app 整合 spec。

---

## 0.7.1 重點 — 2026-05-20

兩個 FHIR 輸出修正：處置自動關聯到對應就醫 + 區分藥局事件 vs 看診。

**Bug 修正**
- 🔗 **處置 (Procedure) 自動連結到當天就醫 (Encounter)**：`mapProcedure` 是唯一一個有 `hospital` 欄位卻沒寫進 FHIR `performer` 的 mapper，導致 link.ts 配不到 Encounter。SMART app 按就醫展開時，同一天的處置會游離在外。本版補上 `Procedure.performer = [{ actor: { display: hospital } }]`（R4 spec：Procedure.performer 是 BackboneElement，display 要 nest 進 `.actor`），linker 也擴充能讀兩種 shape。
- 🏥 **藥局 Encounter 區分出來 (`type=藥局`)**：NHI 把藥局領藥跟診間就醫都塞在 IHKE3303，先前 FHIR Encounter 兩種都標 type="IC卡資料" / "申報資料"（資料來源 label）。本版用 IHKE3306 / IHKE3307 處方端點的 `ori_TYPE_NAME="藥局"` 做 row_ID cross-reference 認出藥局事件、shadow 過 NHI 的 type label 改成 "藥局"。SMART app 不必再做 hospital 名稱 substring matching。

**升級注意**
- 重 sync 才能拿到新的處置 → 就醫連結跟藥局 Encounter type。popup → 🗑 清資料 → 重抓。

---

## 0.7.0 重點 — 2026-05-20

新增**慢性處方箋**抓取，把 FHIR 標準的慢性用藥屬性也標起來。Minor bump 是因為 FHIR 輸出多了新欄位。

**新增功能**
- 💊 **慢箋端點納入同步 (IHKE3307S01)**：NHI 把慢箋放在跟一般處方分開的端點。觀察某病人案例 126 慢箋 vs 73 常規，**74 筆完全只在慢箋列表**。新增 `chronic_prescriptions` endpoint + 2-step fan-out，撈回原本完全 missing 的慢箋資料。
- 🏷️ **`MedicationRequest.courseOfTherapyType = continuous`** (HL7 標準 CodeableConcept)。SMART app 認這個 code 之後可以顯示「長期用藥」徽章或在 problem list 篩出慢性藥。急性處方欄位不存在、不變 ── 舊 SMART app backward compatible。
- 🔄 **慢箋 vs 一般處方去重**：52 筆 row_ID 兩個端點都有，慢箋詳情先抓、把 row_ID 收進 skip-set，常規 fan-out 跳過。每個 row 恰好 fetch 一次。

**升級注意**
- 重 sync 一次自動補上原本 missing 的慢箋。

---

## 0.6.9 重點 — 2026-05-20

資料正確性 patch。三個 adapter 修正都是「NHI 給的日期欄位不是病人實際發生事件的那天」這個 bug family。

**Bug 修正**
- 🐞 **影像日期改用 main_tit**：之前 fallback chain 是 `real_INSPECT_DATE → func_DATE`。real_INSPECT_DATE 常 null 退到 func_DATE = OPD 開單日（不是病人實際做檢查的日期）。OPD ECG 1/31 開單、2/29 做 → 之前 SMART app 顯示「1/31 做 ECG」。改成 `real_INSPECT_DATE → main_tit → func_DATE`（main_tit 才是 NHI 卡片上方顯示的「這份報告的日期」）。
- 🐞 **處置 (Procedure) 兩段式 fan-out 拿到 ICD-10-PCS + 真正執行日**：IHKE3301S05 列表沒給 PCS 碼也沒給實際執行日；新增 IHKE3308S02 detail fan-out（同 imaging 2-step pattern），FHIR Procedure 現在帶 `code = op_CODE`（例 08B53ZZ）、`performedDateTime = exe_S_DATE`。住院期間中段開的刀不會再被擠到入院日。
- 🐞 **住院藥用 validityPeriod 表達實際使用區間**：NHI 把整段住院期間用過的藥打包成同一個 row、`func_DATE` 全部標成入院日。之前 SMART app 看到「5/18 一次開了 14 種藥」。本版抓 `cure_E_DATE` 寫到 `MedicationRequest.dispenseRequest.validityPeriod = {start: 入院日, end: 出院日}`。OPD 單日處方不受影響。

**升級注意**
- 重 sync 才能拿到新的處置 PCS 碼跟住院藥 validityPeriod。popup → 🗑 清資料 → 重抓。

---

## 0.6.8 重點 — 2026-05-19

安全 + 可靠性 patch。兩個 P1、兩個 P2 + 一個 docs 收尾。

**安全修正**
- 🔒 **`/fhir/*` 補上 SMART scope 檢查**：之前 `requireFhirAuth` 只驗 bearer token 有效、不檢查 token 的 scope。註冊一個只有 `openid fhirUser` 的 client 也能讀全部病人資料。本版加 `requireFhirScope`，bearer token 沒有 `patient/*.read` 或 `patient/<Resource>.read` 會回 403 + `WWW-Authenticate: insufficient_scope`。Dashboard 走 API key 路徑不受影響。

**Bug 修正**
- 🐞 **停止同步真的清掉資料**：之前 popup 顯示「已停止並清除部分資料」但 extension 送 raw 身分證、backend 比對 hashed `Patient.id`，**半套的 FHIR resource 全部留在後端**。Extension 改送 hashed ID、backend 雙向相容（raw / hashed 都接受）。
- 🐞 **Dashboard `next build` 修正**：`SyncLog.status` union 漏列 `"partial"`，extension 在有非致命錯誤時實際會回傳該值。
- 🐞 **`scopes_supported` 一致化**：`/fhir/.well-known/smart-configuration` 與 `/smart/.well-known/smart-configuration` 之前回的 scope 清單不一致，SMART app 看到的 capability 取決於它先 probe 哪個 URL。

**內部清理**
- 🧹 刪掉沒人 reference 的 frontend `/authorize` wrapper（dead code，會漏 `launch` / `aud` 參數、正式部署會直接被後端拒）
- 📝 ARCHITECTURE.md salt 段對齊現實：之前描述的 `setStableIdSalt()` 機制從未實作，文件改成符合真實設計（無 salt + 在 reverse proxy 層 scrub access log）

**升級注意**
- 自製 SMART client 請確認 `allowedScopes` 至少含 `patient/*.read`，否則 `/fhir/*` 會 403。

---

## 0.6.7 重點 — 2026-05-19

LOINC 對應表全輪 audit，移除誤對、補回正確對應。每筆都對照 loinc.org 重新查核。

**Bug 修正**
- 🐞 **刪掉 7 個對到完全不相關 analyte 的 LOINC**：複製貼錯 LOINC 的同類 pattern。Bridge 改成只用 NHI 醫令碼，避免 SMART app 拿到誤導性 display。
- 🐞 **CMV IgM 14048B 復原為 7853-5**：先前 audit 誤刪。
- 🐞 **β2-microglobulin 12052B 從 24-hour urine LOINC 改為 serum 1952-1**。
- 🐞 **Free T4 09106C 回退為 3024-7**：v0.6.6 改成 14920-3 的立論「3024-7 是 Total T4」是錯的，兩個都是 Free T4，差別只在 mass-conc vs substance-conc。台灣實驗室都用 ng/dL（mass-conc），所以 3024-7 才對。
- 🐞 **修復 4 個 LOINC_DISPLAY 文字 `#` 字毀損**：6690-2 Leukocytes、777-3 Platelets、789-8 Erythrocytes、711-2 Eosinophils。

完整 audit 證據（每個 loinc.org URL）見 [`docs/LOINC_AUDIT_2026_05_19.md`](docs/LOINC_AUDIT_2026_05_19.md)。

---

## 0.6.6 重點 — 2026-05-19

LOINC 對應準確度修補。一系列「短關鍵字 prefix 撞到長關鍵字」的同類 bug 修正。

**Bug 修正**
- 🐞 **HBsAg / Anti-HCV LOINC 對錯**：泛用的 "hb" 關鍵字（Hemoglobin LOINC 718-7）撞到 "hbsag"，導致所有 HBsAg observation 都拿到 Hemoglobin 的 LOINC。adapter 端直接 pin NHI 醫令碼（HBsAg=14032C、Anti-HCV=14051C）跳過關鍵字搜尋。
- 🐞 **LOINC keyword search 改用 word boundary + 最長匹配**：根本性修法，順手抓出 `"hb"` / `"ph"` / `"mch"` 三個同類撞號 bug。
- 🐞 **成人健檢全部 pin NHI 醫令碼**：9 個化學 / 肝 / 腎 / 肝炎欄位徹底防範未來 prefix-collision 復發。
- 🐞 **拿掉幽靈 Urine UA observation**：NHI 健康存摺 UI 沒這欄、實測 payload 永遠空白，每次 sync 都多出假 observation。
- 🐞 **檢驗 code 改用 NHI 醫令碼而非 hospital free-text**：同一個 Creatinine 在不同醫院欄位有「Crea」「Crea,」等差異，SMART app 視為兩筆不同 lab。改用 `ordeR_CODE`（跨院穩定），free-text 留在 display。

---

## 0.6.5 重點 — 2026-05-19

Bug fix
- 成人預防保健的 HBsAg / Anti-HCV / Urine Protein / Urine UA 之前顯示成數字狀態碼（HBsAg 會看到 "1"），現在正確顯示「陰性」等真實結果。NHI 對這些定性檢查回傳的是「狀態碼 + 中文文字」一對，先前 adapter 誤用狀態碼當值，被當成 valueQuantity 解析。v0.6.3 重構時不慎把這個之前修好的 fix 又改回舊版，本版徹底修回並補上回歸測試。

內部
- adaptAdultPreventive 用真實 payload 取代合成測試 fixture，避免「合成資料看不出來的 bug」漏網。
- push() 過濾邏輯區分「em-dash 哨兵」與「臨床陰性 -」。前者繼續略過，後者保留為合法值。
- 加 4 個專屬單元測試 + 整段 snapshot test 鎖住 HBsAg / Anti-HCV / Urine Protein / Urine UA 的輸出形狀。82 個 extension 測試全綠。

---

## 0.6.4 重點

新功能
- 加抓「重大傷病」registry (IHKE3209S01)。NHI 官方審查通過的重大慢性疾病登錄（癌症、自體免疫、洗腎、移植後等），映射為 FHIR Condition + category=problem-list-item，餵 SMART app 的 problem list view。Popup 查看明細會多一行「重大傷病：N 筆」。
- mapCondition 支援 category 與 recordedDate 欄位。

UX 修補
- 失敗明細浮上來給使用者看：sync 後的「N 項失敗」之前要開 DevTools 才看得到具體訊息，現在收進「查看明細 → 失敗明細 (N)」摺疊區。

Bug fixes
- v0.6.3 refactor 漏掉 adaptEncounterFromMedExpense 的 import；每次 sync 在 encounter detail 階段炸一次。Re-import + 加靜態檢查測試防止再犯。
- 重新取得時 id_no 不更新：如果先在錯誤的 NHI 帳號下抓資料，stored id_no 變成 B 的 cid；切回 A 重新取得，原本會繼續用 B 的 cid。改成每次 sync 都從 NHI session 抓 cid (authoritative)，識別到 patient switch 也順手清掉舊的下載 bundle。

內部
- 測試 68 → 78，新增 ihke3209 fixture、background-imports 靜態防呆、condition mapper 4 個新 case。

---

## 0.6.3 重點

純 dev-side patch — 沒有使用者可見的功能變動，全部是 v0.6.2「補測試」工程的延伸。建議所有開發者升級，但一般民眾沒差。

**測試強度**
- 🧪 從 52 → 68 個 tests，3 個測試檔
- 📐 加 `vitest.config.js`：v8 coverage、threshold（lines 90% / functions 95% / branches 80% / statements 90%）由 CI 強制。目前實際達到 100% / 100% / 91% / 100%
- 📸 新增 `tests/fixtures.snapshot.test.js`：每個 adapter 跑活 fixture 後用 inline snapshot pin 整體形狀。如果 adapter 不小心多/少輸出欄位、改順序，CI 立刻紅燈

**更多 fixtures**
補上 4 個合成 fixture（之前只有 3 個活捕獲）：
- `ihke3303-encounter.json`（IHKE3303 醫療費用申報）
- `ihke3306s02-medication.json`（IHKE3306S02 處方藥品 detail，含 bilingual 欄位）
- `ihke3202-allergy.json`（IHKE3202 藥物過敏）
- `ihke3402-adult-preventive.json`（IHKE3402 成人預防保健，覆蓋 vitals + lipid + LFT + RFT + Hep B/C + 尿酸）

**再一輪結構性整理**
- 🗂️ **NHI endpoint registry 抽到 `nhi-endpoints.js`**：原本跟 service worker flow 邏輯混在一起，現在獨立成 module。
- ✅ **新增 `tests/endpoints.test.js`**：8 個 consistency tests，包含「每個 endpoint 都要有中文 label」「每個 page_type 必須在 mapper 認得的集合裡」「path 必須以 /api/ihke3000/ 開頭」等。新增 endpoint 時忘了補 label 會立刻被 CI 抓到。
- 🧹 imaging list 的內聯 `() => null` 改成具名的 `adaptImagingListStub`，跟 `adaptMedication` 風格一致，coverage 也跟上來
- 📄 新增 `extension/tests/README.md` 解釋測試架構 + 新增 adapter 的 step-by-step
- 📋 ARCHITECTURE.md 更新模組結構圖

**新 dev 指令**
- `npm test`（root）一次跑 backend-ts + extension
- `npm run test:coverage` 跑 coverage report
- `npm run verify-sync <file.json>` 對任意 FHIR Bundle 做 static QA

---

## 0.6.2 重點

**使用者可見**
- ⚠️ **加上資料正確性免責聲明**：popup 底部 + README 開頭都加上小型警示——本工具僅供參考，無法保證資料完全準確；臨床判讀請以健保署健康存摺顯示為主。NHI schema 偶有變動 + 任何 mapper bug 都可能造成輸出與真實情況不一致。

**內部品質工程**
這版底層做了一輪結構性投資，是 v0.6.1 那批「資料正確性 bug」事件後的根本反省：bug 之所以漏出來是 extension adapter 完全沒有 unit test，sit 在 SW context 裡無法隔離測試。這版花力氣補上：

- 🔧 **adapter 抽 module**：把 `extension/src/background.js` 裡的 12 個 `adapt*` + helper 函式抽到獨立的 `extension/src/nhi-adapters.js`，可以在 vitest 下純函式測試。background.js 從 1700 多行縮到 1400 多行。
- 🧪 **52 個 adapter 單元測試**：每個 adapter 至少測「正常路徑」、「缺欄位 fallback」、「null/型別防禦」、「日期欄位優先順序」。v0.6.1 那兩個 bug 都有對應 regression test，再犯立刻 CI 紅燈。
- 📦 **真實 NHI payload 作為測試 fixture**：把 IHKE3409（lab）、IHKE3408S02（imaging）、IHKE3301S05（procedure）三個 endpoint 的活捕獲 payload 收進 `extension/tests/fixtures/`，每次跑測試都會用真實資料形狀驗證 adapter 輸出。
- 🛠️ **`scripts/verify-sync.mjs` 偵錯工具**：對任何 FHIR JSON 跑啟發式檢查（日期 clustering、缺 meta tag、檔名 vs 實際資料 span），用來抓 v0.6.1 那種「住院期間檢驗全擠到一天」的 smell。`node scripts/verify-sync.mjs path/to/file.json` 一句搞定。
- 🤖 **CI 接上**：`backend-ts + extension` workflow 現在會跑 `npm run test --workspace extension`。

---

## 0.6.1 重點

資料正確性 patch — 修兩個系統性的「日期欄位選錯」bug，會影響有住院期間檢驗 / 影像的使用者。

**Bug 修正**
- 🩺 **實驗室檢驗用採檢日，不再用入院日**：NHI 的 lab row 同時帶 `funC_DATE`（就診/入院日）和 `reaL_INSPECT_DATE`（實際採檢日）。原本 adapter 只看 `funC_DATE`，結果**住院期間每一筆 lab 都被擠到入院當天**。例如使用者 5/18 入院、5/22 抽到 191 mg/dL 血糖 → FHIR 卻顯示在 5/18。改成 `reaL_INSPECT_DATE` 優先（缺則回落 `funC_DATE`）。影響 IHKE3409（其他檢驗）+ IHKE3404（癌篩）兩個 endpoint。
- 🖼️ **影像報告同樣的問題**：DiagnosticReport.effectiveDateTime 原本用 `func_DATE`，住院期間做的 CT/X-ray 全部錯標成入院日。同 pattern 修法（IHKE3408S02 detail adapter）。

**內部**
- 🧹 刪掉死碼 `adaptDiagReport`（定義但無 call site）
- 📋 對所有 adapter 跑了一次 date-field 系統性審查；其他 adapter（Encounter / 預防保健 / 過敏 / 處方 / 處置）的 date 欄位選擇 audit 過、語意正確

建議 reload extension 後重新「取得健保存摺資料」，新檔的 lab / imaging 日期就會對。

---

## 0.6.0 重點

這版是 extension 的**定位轉折**：從「附帶嵌入 SMART App 面板的開發者友善工具」收斂為「面向一般民眾、進階模式選擇性開啟」的健保資料下載工具。

**重大改動**
- ✂️ **拿掉嵌入式 SMART App 助理面板**：右側 pill + iframe 機制整套移除（-1.8k 行）。原因是 Chrome 的 Private Network Access 會擋 iframe（public origin）→ localhost backend 的 fetch，導致面板永遠卡在「Launching SMART…」。要打開 SMART App 改走 popup 既有的「開啟 SMART App」按鈕在新 tab 開啟（top-level browsing context 可繞 PNA 限制）。
- 🎛 **本機伺服器模式藏進進階設定**：預設只剩「下載到電腦」一條路。99% 民眾用不到 Docker backend，「伺服器」這個詞對非工程使用者來說容易誤解（以為資料會上傳到雲端）。需要 Dashboard / SMART App 的開發者勾選「啟用本機伺服器模式」即可解鎖既有 UI（mode toggle + Backend URL / API Key / SMART App URL 欄位）。
- ✋ **姓名升為必填**：跟 生日 / 性別 一致打紅星。step 2 的三個欄位現在都是真實必填。

**使用體驗修正**
- 🆙 **Step 1 banner 改寫**：以前只一句「請完成登入」，民眾常常在 NHI 分頁看起來「還在登入狀態」（其實 session 已逾時）→ 看到 popup 說沒登入會困惑「明明已經登入了」。新版分兩種情境條列，加一顆「前往登入頁面」按鈕一鍵帶到 NHI 登入畫面（不用懂 F5、不用記登入 URL）。
- 🎯 **Step 3 阻塞 strip 變跳轉按鈕**：CTA 被擋下時的 ⚠️ 警告整列可點，一鍵跳回該補的步驟（不用爬 stepper）。涵蓋「不在 NHI 分頁」、「未登入」、「基本資料未填」、「生日格式錯誤」四種狀況。
- 🆔 **隱藏 auto-XXXXXXXX 內部 ID**：第一次儲存（還沒同步）只顯示姓名；同步完從 NHI 拿到真實 cid 後，顯示半遮罩版本（`P12345****`）。
- 🧹 **Step 1 / Step 2 視覺一致化**：拿掉 🔗 🔒 ✅ 等 emoji；Step 1 三段 banner 改成白底 + 細色條，跟 Step 2 / 3 同調。
- 📛 **「本機後端」→「本機伺服器」** label 改名（降低工程術語感）。
- 🚀 **「開啟 SMART App」按鈕視覺升級**：從蒼白 outline 改為淡藍底 + 粗體字，明確讀作次要動作。

**Bug 修正**
- 🐞 **SMART App launch context patient_id 雜湊不一致**：v0.5.1 修了 popup 但漏修 sidebar，現在 sidebar 整個砍掉，等於問題自動消失（且 popup 那條路本來就是 hash 過的）。
- 🐞 **「開啟 SMART App」按鈕在拿掉身分證輸入框後永遠 disabled**：getPatientOverride() 不再包含 id_no 導致 launch 判斷失效，已改用模組級 cache。

**內部**
- 🧹 manifest.json 移除 content_scripts + web_accessible_resources 兩整塊（只為 sidebar.js 存在）
- 🧹 background.js 移除 syncRunning storage flag、onInstalled 重注入、sidebarEnabled migration key
- 🧹 popup.js 內 `derivePatientId` import 重新啟用（給流程一致化）
- 🧹 backend-ts biome 自動格式化收尾（v0.5.3 mapper 測試補的格式漂移）
- 🧹 死 CSS（`.data-state-card` / `.data-state-row` / `.data-state-value`）刪除
- 🧹 dist 產物從 3 個 bundle 降到 2 個（少了 sidebar.js）

---

## 0.5.4 重點

v0.5.3 的 popup UX 收尾 polish + 一個功能簡化。

**使用體驗修正**
- 🔢 Footer 版本號改為從 manifest 動態讀取（過去寫死在 v0.2.0）
- ⏳ CTA 按下後文字會變「取得中…」，比單純 disabled 更清楚有反應
- 🎨 「開啟健保存摺登入」按鈕回歸全站統一藍（先前是 out-of-palette 的 sky）
- 🔘 停止按鈕邊框加粗、加深，不會在 CTA 旁邊消失
- 🆗 Step 1 「步驟 ② 確認您的資料」變成可點的連結，直接帶進下一步
- 📛 模式「本機後端」改名「本機伺服器」(降低工程術語)

**Step 2 / Step 3 重新整理**
- ✂️ **拿掉身分證字號輸入框** — 取得時會從 NHI 自動帶入，過去 placeholder 已寫「留空 = 取得時自動帶入」。Step 2 現在就是三個真正需要決定的欄位：生日 / 性別 / 姓名
- 📝 姓名提示從兩行壓成一行（"填真名可協助遮罩報告內容；分享或展示時建議勾選遮罩"）
- 🚀 「開啟 SMART App」從蒼白白底改成淡藍底 + 粗體字，明確讀作次要動作（過去太像 disabled）
- 🎨 Step 1 三段 banner（需登入 / 已登入）改成白底 + 細色條，與 Step 2/3 視覺一致；移除 🔗 🔒 ✅ emoji
- 🗑 垃圾桶 tooltip 加註「不會刪除已下載到電腦的檔案」(醫療資料情境降焦慮)
- 🎛 「進階設定」只在 Step 3 + 本機伺服器模式下出現，不再浮在 Step 1/2 底下顯示空摺疊

**Bug 修正**
- 🐞 移除身分證欄位後，「開啟 SMART App」按鈕一度永遠 disabled — `getPatientOverride()` 不再包含 `id_no`，導致 launch 判斷邏輯失效。改用模組級快取從 storage 維持 `id_no`，背景在 sync 時將 placeholder 換成真實 cid 也會經由 `storage.onChanged` 自動更新

**內部**
- 🧹 刪除 dead CSS（`.data-state-card` / `.data-state-row` / `.data-state-value`，已被 `.state-rows` 取代）
- 🧹 popup.js 狀態訊息與 tooltip 引用按鈕標籤的舊 emoji 一併清掉

---

## 0.5.3 重點

這版主要是 popup UI 的大幅整理 + 一些 sync 流程的 bug 修正。

**UI 重新設計**
- 🪜 **3 步驟引導式 popup**：① 登入 → ② 您的資料 → ③ 取得
- 🎨 Step 3 從「動作卡 + 結果卡 + 下載卡 + Launch 卡」整併成**單一面板**，視覺壓力大幅降低
- 🎨 統一主色為藍色 (#2563eb)，綠色只用於成功狀態；SMART App 按鈕改 outline 藍框
- 🎨 Stepper 壓縮成 breadcrumb 形式（高度減半）
- 🪜 取得對象識別卡：step 3 頂端顯示「目前要抓誰」，點一下回 step 2 修改
- 🎨 取得 CTA 完成後自動降級為「重新取得」outline，讓下載按鈕變主動作
- 📋 完成後的明細從 dev jargon 改成中文（就醫 12 筆、處方 88 筆）

**病人資料 (step 2) 重新規劃**
- ⚠️ 必填欄位（生日、性別）放在最上方
- 🏥 姓名旁邊直接放遮罩 toggle + 說明（不再藏在進階設定）
- 💡 解釋填真名的好處：narrative 中的同名字串會自動一併遮罩
- 🆔 身分證移到最後（反正取得時自動帶入）

**Bug 修正**
- 🐞 NHI 沒回任何資料時不再顯示綠 ✅，改成 ⚠️ 警告 + 建議重新登入
- 🐞 Backend 模式 export URL 用 hashed Patient.id，不再永遠拿到空 bundle
- 🐞 Export 回 0 筆時不再覆蓋掉上傳的真實 total
- 🐞 Sync 進行中切回 popup，CTA 保持 disabled（不會被 onChanged 重設）
- 🐞 生日輸入到一半（只年份）會被攔下，不會 NaN 年齡
- 🐞 切換到 patient B 時，A 的下載 bundle / 狀態 / 後端 cache 都會清空
- 🐞 點 🗑 清除按鈕時，status banner 也跟著清掉
- 🐞 NHI 登入預檢：popup 一開就主動偵測 NHI 分頁 session 狀態
- 🐞 Sidebar 「📋 助理」面板 toggle 失效（讀錯 storage area）
- 🐞 Tombstone：sync 完自動清掉 NHI 已刪除的舊資料

**其他**
- 🧪 新增 80 個 mapper unit tests（從 107 → 187 tests）
- 📚 完整重寫 ARCHITECTURE.md（之前還是舊 Python 版內容）
- 🔒 Apache 2.0 license

---

## 0.5.2 重點

- 🐞 **生日驗證**：填到一半（例如只填年份）無法按「確定」或「取得」，避免下游年齡計算出現 NaN
- ✨ **Sidebar 助理 pill 更顯眼**：加大尺寸 + 開頁 3 秒微脈動，讓使用者一眼看到那是可點的按鈕
- 🧪 **Mapper 測試大幅補齊**：新增 80 個 unit test（107 → 187），覆蓋 allergy / procedure / encounter / diagnostic-report / linker / dispatch

---

## 0.5.1 重點（v0.5.0 之後的 polish）

- 🆕 **資料退場**：每次 sync 會自動清掉同 patient/page_type 但本次沒回傳的舊資料 — NHI 後端刪掉的紀錄不會再永留本機
- ✨ **登入預檢**：popup 一開就確認健保存摺分頁有效 session；沒登入會直接跳紅色 banner，不會讓你按完 CTA 才被「🔒 尚未登入」打回票
- ✨ **明細人話化**：完成後的「查看明細」用「就醫 12 筆 · 處方 88 筆 · 檢驗 412 筆」取代 `encounters=12/12`；技術計時收到「技術細節」子摺
- 🐞 **修正 Patient.id 雜湊不一致**：0.5.0 因為兩邊各自 salt 導致「📤 把本地檔案上傳到後端」之後查不到病人，已修
- 🎨 status pill 改名字優先（`陳O新 · P12345****`）、加 keyboard focus-visible 環

---

## 0.5.0 重點

這版是一次比較大的安全 + 隱私強化。

- 🔒 **所有 PHI 端點補上認證**：先前 `/fhir/*` 讀取與部分 `/sync/*` 路由可不需要任何驗證直接拿資料；現在統一強制 `X-Sync-API-Key` 或 SMART Bearer
- 🔒 **Dashboard 不再把 API key 編進前端**：改走 Next.js server proxy 注入；DevTools 看不到 key
- 🔒 **`Patient.id` 改為雜湊形式**：身分證從此不出現在 FHIR `Patient.id`、`subject.reference`、SMART token payload 或任何 URL；真實值只留在 `Patient.identifier[].value`
- 🔒 **設定改存 `chrome.storage.local`**：身分證 + API key 不再隨 Google 帳號同步到所有裝置
- 🔒 後端預設綁 `127.0.0.1`、`/smart/authorize` 拒絕無 launch token 的 standalone 登入、驗 `aud`、CORS 接受清單可由 `ALLOWED_EXTENSION_IDS` 收緊
- 🎨 病人資料卡簡化、模式切換 label 改、CTA 卡住時把原因 inline 顯示、Dashboard 在地化、release notes 大幅改寫

**破壞性變更**（從 0.4.x 升上來請看）：
- Patient.id 變雜湊形式 → 舊 backend DB 資料 orphan，建議 `docker compose down -v` 清掉再重 sync
- `optional_host_permissions` 收緊只允許 localhost；LAN 自架 backend 需自行改 `manifest.json`
- Dashboard PHI 路徑改走 `/api/backend/*` → docker-compose 用戶要 `docker compose up --build` 重建 frontend image

---

## 這個是什麼

一個 Chrome 擴充功能，可以把你在**健保存摺** (myhealthbank.nhi.gov.tw) 看到的就醫紀錄、用藥、檢驗報告、影像報告，**整理成 FHIR R4 標準格式的健康紀錄檔**。檔案可以：
- 下載到自己電腦（個人病歷備份、單次匯出、轉給其他醫療系統用）
- 或上傳到本機 Docker 後端，配合 Dashboard / SMART App 看資料

PHI 永遠不離開你機器。

---

## 🟢 安裝（純 Extension，最快 2 分鐘）

如果只是要**把健保資料下載成 FHIR 檔**，這條路就夠了，完全不用裝 Docker。

1. 下方下載 `nhi-fhir-bridge-extension-v0.6.5.zip`
2. 解壓到電腦任意位置（例如 `~/nhi-fhir-bridge/`）
3. Chrome 網址列輸入 `chrome://extensions/`
4. 右上角開啟「**開發人員模式**」
5. 左上角點「**載入未封裝項目**」→ 選擇剛解壓的 `dist/` 資料夾
6. **把圖示釘到工具列**（Chrome 預設不會自動釘）：
   點瀏覽器右上角的 🧩（擴充功能拼圖圖示）→ 找到 **NHI-FHIR Bridge** → 點旁邊的 📌 圖釘
7. 工具列就會看到 NHI-FHIR Bridge 圖示： <img src="https://raw.githubusercontent.com/voho0000/NHI-FHIR-BRIDGE/v0.6.5/extension/dist/icons/icon-48.png" width="28" height="28" align="middle" />

---

## 怎麼用

1. 開新分頁登入 https://myhealthbank.nhi.gov.tw/（沒登入的話，extension 會跳按鈕帶你過去）
2. 點 Chrome 工具列上的 NHI-FHIR Bridge 圖示打開小視窗
3. 病人資料卡填：
   - **性別**（必填，會寫進 FHIR Patient 資源，後端 / SMART App 判讀檢驗值參考區間會用到）
   - **出生年份**（建議填真實的，年齡會影響檢驗值判讀區間）
   - 姓名、完整生日可以隨便填假的
   - 身分證字號**不用填**，按下取得時 extension 會自動從健保存摺帶入
4. 按「**🔄 取得健保存摺資料**」— 通常 15–30 秒（看 NHI 速度）
5. 完成後會跳出「**📥 下載健康紀錄檔**」按鈕，按下去檔案就存到下載夾

檔名範例：`nhi-P12345XXXX-20250517-20260517.json`
- `P12345XXXX` ＝ 身分證半遮罩（前 6 碼可見、後 4 碼以 X 取代；避免下載夾被瞄到，檔案內容仍是真實值）
- `20250517-20260517` ＝ 這次抓的健保資料區間（起–訖日）

---

## 隱私說明（重要）

- 你輸入的姓名、生日 → **只存在你自己的瀏覽器**，extension 不會上傳給任何第三方
- 身分證字號 → **顯示時自動半遮罩**（`P12345****`），但檔案內容是真實值（FHIR 規範需要）
- 預設下載的健康紀錄檔**包含真實姓名**（民眾自用情境）
- 如要在多病人診間 / 教學展示用，可以打開「進階設定 → 對外輸出時遮罩病人姓名」，輸出檔的姓名就會變成 `郭O新` 之類遮罩版

---

## 🔵 進階：搭配 Backend + Dashboard

如果要：
- 多次同步累積在本地 FHIR Server
- 用 Dashboard 看多個病人
- 一鍵 launch SMART on FHIR App

那加跑後端（需要 [Docker Desktop](https://docs.docker.com/get-docker/)）：

```sh
git clone https://github.com/voho0000/NHI-FHIR-BRIDGE.git
cd $(basename voho0000/NHI-FHIR-BRIDGE)
docker compose up -d
```

然後 Extension popup 上方切到「**🏥 本機後端 (進階)**」即可。Dashboard 在 http://localhost:3010。

---

詳細說明、架構圖、FAQ 見 [README](https://github.com/voho0000/NHI-FHIR-BRIDGE#readme)。


**Full Changelog**: https://github.com/voho0000/NHI-FHIR-BRIDGE/compare/v0.6.4...v0.6.5

---

## 0.6.4 重點 — 2026-05-18

新功能
- 加抓「重大傷病」registry (IHKE3209S01)。NHI 官方審查通過的重大慢性疾病登錄（癌症、自體免疫、洗腎、移植後等），映射為 FHIR Condition + category=problem-list-item，餵 SMART app 的 problem list view。Popup 查看明細會多一行「重大傷病：N 筆」。
- mapCondition 支援 category 與 recordedDate 欄位。

UX 修補
- 失敗明細浮上來給使用者看：sync 後的「N 項失敗」之前要開 DevTools 才看得到具體訊息，現在收進「查看明細 → 失敗明細 (N)」摺疊區。

Bug fixes
- v0.6.3 refactor 漏掉 adaptEncounterFromMedExpense 的 import；每次 sync 在 encounter detail 階段炸一次。Re-import + 加靜態檢查測試防止再犯。
- 重新取得時 id_no 不更新：如果先在錯誤的 NHI 帳號下抓資料，stored id_no 變成 B 的 cid；切回 A 重新取得，原本會繼續用 B 的 cid。改成每次 sync 都從 NHI session 抓 cid (authoritative)，識別到 patient switch 也順手清掉舊的下載 bundle。

內部
- 測試 68 → 78，新增 ihke3209 fixture、background-imports 靜態防呆、condition mapper 4 個新 case。

---

## 0.6.3 重點

純 dev-side patch — 沒有使用者可見的功能變動，全部是 v0.6.2「補測試」工程的延伸。建議所有開發者升級，但一般民眾沒差。

**測試強度**
- 🧪 從 52 → 68 個 tests，3 個測試檔
- 📐 加 `vitest.config.js`：v8 coverage、threshold（lines 90% / functions 95% / branches 80% / statements 90%）由 CI 強制。目前實際達到 100% / 100% / 91% / 100%
- 📸 新增 `tests/fixtures.snapshot.test.js`：每個 adapter 跑活 fixture 後用 inline snapshot pin 整體形狀。如果 adapter 不小心多/少輸出欄位、改順序，CI 立刻紅燈

**更多 fixtures**
補上 4 個合成 fixture（之前只有 3 個活捕獲）：
- `ihke3303-encounter.json`（IHKE3303 醫療費用申報）
- `ihke3306s02-medication.json`（IHKE3306S02 處方藥品 detail，含 bilingual 欄位）
- `ihke3202-allergy.json`（IHKE3202 藥物過敏）
- `ihke3402-adult-preventive.json`（IHKE3402 成人預防保健，覆蓋 vitals + lipid + LFT + RFT + Hep B/C + 尿酸）

**再一輪結構性整理**
- 🗂️ **NHI endpoint registry 抽到 `nhi-endpoints.js`**：原本跟 service worker flow 邏輯混在一起，現在獨立成 module。
- ✅ **新增 `tests/endpoints.test.js`**：8 個 consistency tests，包含「每個 endpoint 都要有中文 label」「每個 page_type 必須在 mapper 認得的集合裡」「path 必須以 /api/ihke3000/ 開頭」等。新增 endpoint 時忘了補 label 會立刻被 CI 抓到。
- 🧹 imaging list 的內聯 `() => null` 改成具名的 `adaptImagingListStub`，跟 `adaptMedication` 風格一致，coverage 也跟上來
- 📄 新增 `extension/tests/README.md` 解釋測試架構 + 新增 adapter 的 step-by-step
- 📋 ARCHITECTURE.md 更新模組結構圖

**新 dev 指令**
- `npm test`（root）一次跑 backend-ts + extension
- `npm run test:coverage` 跑 coverage report
- `npm run verify-sync <file.json>` 對任意 FHIR Bundle 做 static QA

---

## 0.6.2 重點

**使用者可見**
- ⚠️ **加上資料正確性免責聲明**：popup 底部 + README 開頭都加上小型警示——本工具僅供參考，無法保證資料完全準確；臨床判讀請以健保署健康存摺顯示為主。NHI schema 偶有變動 + 任何 mapper bug 都可能造成輸出與真實情況不一致。

**內部品質工程**
這版底層做了一輪結構性投資，是 v0.6.1 那批「資料正確性 bug」事件後的根本反省：bug 之所以漏出來是 extension adapter 完全沒有 unit test，sit 在 SW context 裡無法隔離測試。這版花力氣補上：

- 🔧 **adapter 抽 module**：把 `extension/src/background.js` 裡的 12 個 `adapt*` + helper 函式抽到獨立的 `extension/src/nhi-adapters.js`，可以在 vitest 下純函式測試。background.js 從 1700 多行縮到 1400 多行。
- 🧪 **52 個 adapter 單元測試**：每個 adapter 至少測「正常路徑」、「缺欄位 fallback」、「null/型別防禦」、「日期欄位優先順序」。v0.6.1 那兩個 bug 都有對應 regression test，再犯立刻 CI 紅燈。
- 📦 **真實 NHI payload 作為測試 fixture**：把 IHKE3409（lab）、IHKE3408S02（imaging）、IHKE3301S05（procedure）三個 endpoint 的活捕獲 payload 收進 `extension/tests/fixtures/`，每次跑測試都會用真實資料形狀驗證 adapter 輸出。
- 🛠️ **`scripts/verify-sync.mjs` 偵錯工具**：對任何 FHIR JSON 跑啟發式檢查（日期 clustering、缺 meta tag、檔名 vs 實際資料 span），用來抓 v0.6.1 那種「住院期間檢驗全擠到一天」的 smell。`node scripts/verify-sync.mjs path/to/file.json` 一句搞定。
- 🤖 **CI 接上**：`backend-ts + extension` workflow 現在會跑 `npm run test --workspace extension`。

---

## 0.6.1 重點

資料正確性 patch — 修兩個系統性的「日期欄位選錯」bug，會影響有住院期間檢驗 / 影像的使用者。

**Bug 修正**
- 🩺 **實驗室檢驗用採檢日，不再用入院日**：NHI 的 lab row 同時帶 `funC_DATE`（就診/入院日）和 `reaL_INSPECT_DATE`（實際採檢日）。原本 adapter 只看 `funC_DATE`，結果**住院期間每一筆 lab 都被擠到入院當天**。例如使用者 5/18 入院、5/22 抽到 191 mg/dL 血糖 → FHIR 卻顯示在 5/18。改成 `reaL_INSPECT_DATE` 優先（缺則回落 `funC_DATE`）。影響 IHKE3409（其他檢驗）+ IHKE3404（癌篩）兩個 endpoint。
- 🖼️ **影像報告同樣的問題**：DiagnosticReport.effectiveDateTime 原本用 `func_DATE`，住院期間做的 CT/X-ray 全部錯標成入院日。同 pattern 修法（IHKE3408S02 detail adapter）。

**內部**
- 🧹 刪掉死碼 `adaptDiagReport`（定義但無 call site）
- 📋 對所有 adapter 跑了一次 date-field 系統性審查；其他 adapter（Encounter / 預防保健 / 過敏 / 處方 / 處置）的 date 欄位選擇 audit 過、語意正確

建議 reload extension 後重新「取得健保存摺資料」，新檔的 lab / imaging 日期就會對。

---

## 0.6.0 重點

這版是 extension 的**定位轉折**：從「附帶嵌入 SMART App 面板的開發者友善工具」收斂為「面向一般民眾、進階模式選擇性開啟」的健保資料下載工具。

**重大改動**
- ✂️ **拿掉嵌入式 SMART App 助理面板**：右側 pill + iframe 機制整套移除（-1.8k 行）。原因是 Chrome 的 Private Network Access 會擋 iframe（public origin）→ localhost backend 的 fetch，導致面板永遠卡在「Launching SMART…」。要打開 SMART App 改走 popup 既有的「開啟 SMART App」按鈕在新 tab 開啟（top-level browsing context 可繞 PNA 限制）。
- 🎛 **本機伺服器模式藏進進階設定**：預設只剩「下載到電腦」一條路。99% 民眾用不到 Docker backend，「伺服器」這個詞對非工程使用者來說容易誤解（以為資料會上傳到雲端）。需要 Dashboard / SMART App 的開發者勾選「啟用本機伺服器模式」即可解鎖既有 UI（mode toggle + Backend URL / API Key / SMART App URL 欄位）。
- ✋ **姓名升為必填**：跟 生日 / 性別 一致打紅星。step 2 的三個欄位現在都是真實必填。

**使用體驗修正**
- 🆙 **Step 1 banner 改寫**：以前只一句「請完成登入」，民眾常常在 NHI 分頁看起來「還在登入狀態」（其實 session 已逾時）→ 看到 popup 說沒登入會困惑「明明已經登入了」。新版分兩種情境條列，加一顆「前往登入頁面」按鈕一鍵帶到 NHI 登入畫面（不用懂 F5、不用記登入 URL）。
- 🎯 **Step 3 阻塞 strip 變跳轉按鈕**：CTA 被擋下時的 ⚠️ 警告整列可點，一鍵跳回該補的步驟（不用爬 stepper）。涵蓋「不在 NHI 分頁」、「未登入」、「基本資料未填」、「生日格式錯誤」四種狀況。
- 🆔 **隱藏 auto-XXXXXXXX 內部 ID**：第一次儲存（還沒同步）只顯示姓名；同步完從 NHI 拿到真實 cid 後，顯示半遮罩版本（`P12345****`）。
- 🧹 **Step 1 / Step 2 視覺一致化**：拿掉 🔗 🔒 ✅ 等 emoji；Step 1 三段 banner 改成白底 + 細色條，跟 Step 2 / 3 同調。
- 📛 **「本機後端」→「本機伺服器」** label 改名（降低工程術語感）。
- 🚀 **「開啟 SMART App」按鈕視覺升級**：從蒼白 outline 改為淡藍底 + 粗體字，明確讀作次要動作。

**Bug 修正**
- 🐞 **SMART App launch context patient_id 雜湊不一致**：v0.5.1 修了 popup 但漏修 sidebar，現在 sidebar 整個砍掉，等於問題自動消失（且 popup 那條路本來就是 hash 過的）。
- 🐞 **「開啟 SMART App」按鈕在拿掉身分證輸入框後永遠 disabled**：getPatientOverride() 不再包含 id_no 導致 launch 判斷失效，已改用模組級 cache。

**內部**
- 🧹 manifest.json 移除 content_scripts + web_accessible_resources 兩整塊（只為 sidebar.js 存在）
- 🧹 background.js 移除 syncRunning storage flag、onInstalled 重注入、sidebarEnabled migration key
- 🧹 popup.js 內 `derivePatientId` import 重新啟用（給流程一致化）
- 🧹 backend-ts biome 自動格式化收尾（v0.5.3 mapper 測試補的格式漂移）
- 🧹 死 CSS（`.data-state-card` / `.data-state-row` / `.data-state-value`）刪除
- 🧹 dist 產物從 3 個 bundle 降到 2 個（少了 sidebar.js）

---

## 0.5.4 重點

v0.5.3 的 popup UX 收尾 polish + 一個功能簡化。

**使用體驗修正**
- 🔢 Footer 版本號改為從 manifest 動態讀取（過去寫死在 v0.2.0）
- ⏳ CTA 按下後文字會變「取得中…」，比單純 disabled 更清楚有反應
- 🎨 「開啟健保存摺登入」按鈕回歸全站統一藍（先前是 out-of-palette 的 sky）
- 🔘 停止按鈕邊框加粗、加深，不會在 CTA 旁邊消失
- 🆗 Step 1 「步驟 ② 確認您的資料」變成可點的連結，直接帶進下一步
- 📛 模式「本機後端」改名「本機伺服器」(降低工程術語)

**Step 2 / Step 3 重新整理**
- ✂️ **拿掉身分證字號輸入框** — 取得時會從 NHI 自動帶入，過去 placeholder 已寫「留空 = 取得時自動帶入」。Step 2 現在就是三個真正需要決定的欄位：生日 / 性別 / 姓名
- 📝 姓名提示從兩行壓成一行（"填真名可協助遮罩報告內容；分享或展示時建議勾選遮罩"）
- 🚀 「開啟 SMART App」從蒼白白底改成淡藍底 + 粗體字，明確讀作次要動作（過去太像 disabled）
- 🎨 Step 1 三段 banner（需登入 / 已登入）改成白底 + 細色條，與 Step 2/3 視覺一致；移除 🔗 🔒 ✅ emoji
- 🗑 垃圾桶 tooltip 加註「不會刪除已下載到電腦的檔案」(醫療資料情境降焦慮)
- 🎛 「進階設定」只在 Step 3 + 本機伺服器模式下出現，不再浮在 Step 1/2 底下顯示空摺疊

**Bug 修正**
- 🐞 移除身分證欄位後，「開啟 SMART App」按鈕一度永遠 disabled — `getPatientOverride()` 不再包含 `id_no`，導致 launch 判斷邏輯失效。改用模組級快取從 storage 維持 `id_no`，背景在 sync 時將 placeholder 換成真實 cid 也會經由 `storage.onChanged` 自動更新

**內部**
- 🧹 刪除 dead CSS（`.data-state-card` / `.data-state-row` / `.data-state-value`，已被 `.state-rows` 取代）
- 🧹 popup.js 狀態訊息與 tooltip 引用按鈕標籤的舊 emoji 一併清掉

---

## 0.5.3 重點

這版主要是 popup UI 的大幅整理 + 一些 sync 流程的 bug 修正。

**UI 重新設計**
- 🪜 **3 步驟引導式 popup**：① 登入 → ② 您的資料 → ③ 取得
- 🎨 Step 3 從「動作卡 + 結果卡 + 下載卡 + Launch 卡」整併成**單一面板**，視覺壓力大幅降低
- 🎨 統一主色為藍色 (#2563eb)，綠色只用於成功狀態；SMART App 按鈕改 outline 藍框
- 🎨 Stepper 壓縮成 breadcrumb 形式（高度減半）
- 🪜 取得對象識別卡：step 3 頂端顯示「目前要抓誰」，點一下回 step 2 修改
- 🎨 取得 CTA 完成後自動降級為「重新取得」outline，讓下載按鈕變主動作
- 📋 完成後的明細從 dev jargon 改成中文（就醫 12 筆、處方 88 筆）

**病人資料 (step 2) 重新規劃**
- ⚠️ 必填欄位（生日、性別）放在最上方
- 🏥 姓名旁邊直接放遮罩 toggle + 說明（不再藏在進階設定）
- 💡 解釋填真名的好處：narrative 中的同名字串會自動一併遮罩
- 🆔 身分證移到最後（反正取得時自動帶入）

**Bug 修正**
- 🐞 NHI 沒回任何資料時不再顯示綠 ✅，改成 ⚠️ 警告 + 建議重新登入
- 🐞 Backend 模式 export URL 用 hashed Patient.id，不再永遠拿到空 bundle
- 🐞 Export 回 0 筆時不再覆蓋掉上傳的真實 total
- 🐞 Sync 進行中切回 popup，CTA 保持 disabled（不會被 onChanged 重設）
- 🐞 生日輸入到一半（只年份）會被攔下，不會 NaN 年齡
- 🐞 切換到 patient B 時，A 的下載 bundle / 狀態 / 後端 cache 都會清空
- 🐞 點 🗑 清除按鈕時，status banner 也跟著清掉
- 🐞 NHI 登入預檢：popup 一開就主動偵測 NHI 分頁 session 狀態
- 🐞 Sidebar 「📋 助理」面板 toggle 失效（讀錯 storage area）
- 🐞 Tombstone：sync 完自動清掉 NHI 已刪除的舊資料

**其他**
- 🧪 新增 80 個 mapper unit tests（從 107 → 187 tests）
- 📚 完整重寫 ARCHITECTURE.md（之前還是舊 Python 版內容）
- 🔒 Apache 2.0 license

---

## 0.5.2 重點

- 🐞 **生日驗證**：填到一半（例如只填年份）無法按「確定」或「取得」，避免下游年齡計算出現 NaN
- ✨ **Sidebar 助理 pill 更顯眼**：加大尺寸 + 開頁 3 秒微脈動，讓使用者一眼看到那是可點的按鈕
- 🧪 **Mapper 測試大幅補齊**：新增 80 個 unit test（107 → 187），覆蓋 allergy / procedure / encounter / diagnostic-report / linker / dispatch

---

## 0.5.1 重點（v0.5.0 之後的 polish）

- 🆕 **資料退場**：每次 sync 會自動清掉同 patient/page_type 但本次沒回傳的舊資料 — NHI 後端刪掉的紀錄不會再永留本機
- ✨ **登入預檢**：popup 一開就確認健保存摺分頁有效 session；沒登入會直接跳紅色 banner，不會讓你按完 CTA 才被「🔒 尚未登入」打回票
- ✨ **明細人話化**：完成後的「查看明細」用「就醫 12 筆 · 處方 88 筆 · 檢驗 412 筆」取代 `encounters=12/12`；技術計時收到「技術細節」子摺
- 🐞 **修正 Patient.id 雜湊不一致**：0.5.0 因為兩邊各自 salt 導致「📤 把本地檔案上傳到後端」之後查不到病人，已修
- 🎨 status pill 改名字優先（`陳O新 · P12345****`）、加 keyboard focus-visible 環

---

## 0.5.0 重點

這版是一次比較大的安全 + 隱私強化。

- 🔒 **所有 PHI 端點補上認證**：先前 `/fhir/*` 讀取與部分 `/sync/*` 路由可不需要任何驗證直接拿資料；現在統一強制 `X-Sync-API-Key` 或 SMART Bearer
- 🔒 **Dashboard 不再把 API key 編進前端**：改走 Next.js server proxy 注入；DevTools 看不到 key
- 🔒 **`Patient.id` 改為雜湊形式**：身分證從此不出現在 FHIR `Patient.id`、`subject.reference`、SMART token payload 或任何 URL；真實值只留在 `Patient.identifier[].value`
- 🔒 **設定改存 `chrome.storage.local`**：身分證 + API key 不再隨 Google 帳號同步到所有裝置
- 🔒 後端預設綁 `127.0.0.1`、`/smart/authorize` 拒絕無 launch token 的 standalone 登入、驗 `aud`、CORS 接受清單可由 `ALLOWED_EXTENSION_IDS` 收緊
- 🎨 病人資料卡簡化、模式切換 label 改、CTA 卡住時把原因 inline 顯示、Dashboard 在地化、release notes 大幅改寫

**破壞性變更**（從 0.4.x 升上來請看）：
- Patient.id 變雜湊形式 → 舊 backend DB 資料 orphan，建議 `docker compose down -v` 清掉再重 sync
- `optional_host_permissions` 收緊只允許 localhost；LAN 自架 backend 需自行改 `manifest.json`
- Dashboard PHI 路徑改走 `/api/backend/*` → docker-compose 用戶要 `docker compose up --build` 重建 frontend image

---

## 這個是什麼

一個 Chrome 擴充功能，可以把你在**健保存摺** (myhealthbank.nhi.gov.tw) 看到的就醫紀錄、用藥、檢驗報告、影像報告，**整理成 FHIR R4 標準格式的健康紀錄檔**。檔案可以：
- 下載到自己電腦（個人病歷備份、單次匯出、轉給其他醫療系統用）
- 或上傳到本機 Docker 後端，配合 Dashboard / SMART App 看資料

PHI 永遠不離開你機器。

---

## 🟢 安裝（純 Extension，最快 2 分鐘）

如果只是要**把健保資料下載成 FHIR 檔**，這條路就夠了，完全不用裝 Docker。

1. 下方下載 `nhi-fhir-bridge-extension-v0.6.4.zip`
2. 解壓到電腦任意位置（例如 `~/nhi-fhir-bridge/`）
3. Chrome 網址列輸入 `chrome://extensions/`
4. 右上角開啟「**開發人員模式**」
5. 左上角點「**載入未封裝項目**」→ 選擇剛解壓的 `dist/` 資料夾
6. **把圖示釘到工具列**（Chrome 預設不會自動釘）：
   點瀏覽器右上角的 🧩（擴充功能拼圖圖示）→ 找到 **NHI-FHIR Bridge** → 點旁邊的 📌 圖釘
7. 工具列就會看到 NHI-FHIR Bridge 圖示： <img src="https://raw.githubusercontent.com/voho0000/NHI-FHIR-BRIDGE/v0.6.4/extension/dist/icons/icon-48.png" width="28" height="28" align="middle" />

---

## 怎麼用

1. 開新分頁登入 https://myhealthbank.nhi.gov.tw/（沒登入的話，extension 會跳按鈕帶你過去）
2. 點 Chrome 工具列上的 NHI-FHIR Bridge 圖示打開小視窗
3. 病人資料卡填：
   - **性別**（必填，會寫進 FHIR Patient 資源，後端 / SMART App 判讀檢驗值參考區間會用到）
   - **出生年份**（建議填真實的，年齡會影響檢驗值判讀區間）
   - 姓名、完整生日可以隨便填假的
   - 身分證字號**不用填**，按下取得時 extension 會自動從健保存摺帶入
4. 按「**🔄 取得健保存摺資料**」— 通常 15–30 秒（看 NHI 速度）
5. 完成後會跳出「**📥 下載健康紀錄檔**」按鈕，按下去檔案就存到下載夾

檔名範例：`nhi-P12345XXXX-20250517-20260517.json`
- `P12345XXXX` ＝ 身分證半遮罩（前 6 碼可見、後 4 碼以 X 取代；避免下載夾被瞄到，檔案內容仍是真實值）
- `20250517-20260517` ＝ 這次抓的健保資料區間（起–訖日）

---

## 隱私說明（重要）

- 你輸入的姓名、生日 → **只存在你自己的瀏覽器**，extension 不會上傳給任何第三方
- 身分證字號 → **顯示時自動半遮罩**（`P12345****`），但檔案內容是真實值（FHIR 規範需要）
- 預設下載的健康紀錄檔**包含真實姓名**（民眾自用情境）
- 如要在多病人診間 / 教學展示用，可以打開「進階設定 → 對外輸出時遮罩病人姓名」，輸出檔的姓名就會變成 `郭O新` 之類遮罩版

---

## 🔵 進階：搭配 Backend + Dashboard

如果要：
- 多次同步累積在本地 FHIR Server
- 用 Dashboard 看多個病人
- 一鍵 launch SMART on FHIR App

那加跑後端（需要 [Docker Desktop](https://docs.docker.com/get-docker/)）：

```sh
git clone https://github.com/voho0000/NHI-FHIR-BRIDGE.git
cd $(basename voho0000/NHI-FHIR-BRIDGE)
docker compose up -d
```

然後 Extension popup 上方切到「**🏥 本機後端 (進階)**」即可。Dashboard 在 http://localhost:3010。

---

詳細說明、架構圖、FAQ 見 [README](https://github.com/voho0000/NHI-FHIR-BRIDGE#readme)。


**Full Changelog**: https://github.com/voho0000/NHI-FHIR-BRIDGE/compare/v0.6.3...v0.6.4

---

## 0.6.3 重點 — 2026-05-18

純 dev-side patch — 沒有使用者可見的功能變動，全部是 v0.6.2「補測試」工程的延伸。建議所有開發者升級，但一般民眾沒差。

**測試強度**
- 🧪 從 52 → 68 個 tests，3 個測試檔
- 📐 加 `vitest.config.js`：v8 coverage、threshold（lines 90% / functions 95% / branches 80% / statements 90%）由 CI 強制。目前實際達到 100% / 100% / 91% / 100%
- 📸 新增 `tests/fixtures.snapshot.test.js`：每個 adapter 跑活 fixture 後用 inline snapshot pin 整體形狀。如果 adapter 不小心多/少輸出欄位、改順序，CI 立刻紅燈

**更多 fixtures**
補上 4 個合成 fixture（之前只有 3 個活捕獲）：
- `ihke3303-encounter.json`（IHKE3303 醫療費用申報）
- `ihke3306s02-medication.json`（IHKE3306S02 處方藥品 detail，含 bilingual 欄位）
- `ihke3202-allergy.json`（IHKE3202 藥物過敏）
- `ihke3402-adult-preventive.json`（IHKE3402 成人預防保健，覆蓋 vitals + lipid + LFT + RFT + Hep B/C + 尿酸）

**再一輪結構性整理**
- 🗂️ **NHI endpoint registry 抽到 `nhi-endpoints.js`**：原本跟 service worker flow 邏輯混在一起，現在獨立成 module。
- ✅ **新增 `tests/endpoints.test.js`**：8 個 consistency tests，包含「每個 endpoint 都要有中文 label」「每個 page_type 必須在 mapper 認得的集合裡」「path 必須以 /api/ihke3000/ 開頭」等。新增 endpoint 時忘了補 label 會立刻被 CI 抓到。
- 🧹 imaging list 的內聯 `() => null` 改成具名的 `adaptImagingListStub`，跟 `adaptMedication` 風格一致，coverage 也跟上來
- 📄 新增 `extension/tests/README.md` 解釋測試架構 + 新增 adapter 的 step-by-step
- 📋 ARCHITECTURE.md 更新模組結構圖

**新 dev 指令**
- `npm test`（root）一次跑 backend-ts + extension
- `npm run test:coverage` 跑 coverage report
- `npm run verify-sync <file.json>` 對任意 FHIR Bundle 做 static QA

---

## 0.6.2 重點

**使用者可見**
- ⚠️ **加上資料正確性免責聲明**：popup 底部 + README 開頭都加上小型警示——本工具僅供參考，無法保證資料完全準確；臨床判讀請以健保署健康存摺顯示為主。NHI schema 偶有變動 + 任何 mapper bug 都可能造成輸出與真實情況不一致。

**內部品質工程**
這版底層做了一輪結構性投資，是 v0.6.1 那批「資料正確性 bug」事件後的根本反省：bug 之所以漏出來是 extension adapter 完全沒有 unit test，sit 在 SW context 裡無法隔離測試。這版花力氣補上：

- 🔧 **adapter 抽 module**：把 `extension/src/background.js` 裡的 12 個 `adapt*` + helper 函式抽到獨立的 `extension/src/nhi-adapters.js`，可以在 vitest 下純函式測試。background.js 從 1700 多行縮到 1400 多行。
- 🧪 **52 個 adapter 單元測試**：每個 adapter 至少測「正常路徑」、「缺欄位 fallback」、「null/型別防禦」、「日期欄位優先順序」。v0.6.1 那兩個 bug 都有對應 regression test，再犯立刻 CI 紅燈。
- 📦 **真實 NHI payload 作為測試 fixture**：把 IHKE3409（lab）、IHKE3408S02（imaging）、IHKE3301S05（procedure）三個 endpoint 的活捕獲 payload 收進 `extension/tests/fixtures/`，每次跑測試都會用真實資料形狀驗證 adapter 輸出。
- 🛠️ **`scripts/verify-sync.mjs` 偵錯工具**：對任何 FHIR JSON 跑啟發式檢查（日期 clustering、缺 meta tag、檔名 vs 實際資料 span），用來抓 v0.6.1 那種「住院期間檢驗全擠到一天」的 smell。`node scripts/verify-sync.mjs path/to/file.json` 一句搞定。
- 🤖 **CI 接上**：`backend-ts + extension` workflow 現在會跑 `npm run test --workspace extension`。

---

## 0.6.1 重點

資料正確性 patch — 修兩個系統性的「日期欄位選錯」bug，會影響有住院期間檢驗 / 影像的使用者。

**Bug 修正**
- 🩺 **實驗室檢驗用採檢日，不再用入院日**：NHI 的 lab row 同時帶 `funC_DATE`（就診/入院日）和 `reaL_INSPECT_DATE`（實際採檢日）。原本 adapter 只看 `funC_DATE`，結果**住院期間每一筆 lab 都被擠到入院當天**。例如使用者 5/18 入院、5/22 抽到 191 mg/dL 血糖 → FHIR 卻顯示在 5/18。改成 `reaL_INSPECT_DATE` 優先（缺則回落 `funC_DATE`）。影響 IHKE3409（其他檢驗）+ IHKE3404（癌篩）兩個 endpoint。
- 🖼️ **影像報告同樣的問題**：DiagnosticReport.effectiveDateTime 原本用 `func_DATE`，住院期間做的 CT/X-ray 全部錯標成入院日。同 pattern 修法（IHKE3408S02 detail adapter）。

**內部**
- 🧹 刪掉死碼 `adaptDiagReport`（定義但無 call site）
- 📋 對所有 adapter 跑了一次 date-field 系統性審查；其他 adapter（Encounter / 預防保健 / 過敏 / 處方 / 處置）的 date 欄位選擇 audit 過、語意正確

建議 reload extension 後重新「取得健保存摺資料」，新檔的 lab / imaging 日期就會對。

---

## 0.6.0 重點

這版是 extension 的**定位轉折**：從「附帶嵌入 SMART App 面板的開發者友善工具」收斂為「面向一般民眾、進階模式選擇性開啟」的健保資料下載工具。

**重大改動**
- ✂️ **拿掉嵌入式 SMART App 助理面板**：右側 pill + iframe 機制整套移除（-1.8k 行）。原因是 Chrome 的 Private Network Access 會擋 iframe（public origin）→ localhost backend 的 fetch，導致面板永遠卡在「Launching SMART…」。要打開 SMART App 改走 popup 既有的「開啟 SMART App」按鈕在新 tab 開啟（top-level browsing context 可繞 PNA 限制）。
- 🎛 **本機伺服器模式藏進進階設定**：預設只剩「下載到電腦」一條路。99% 民眾用不到 Docker backend，「伺服器」這個詞對非工程使用者來說容易誤解（以為資料會上傳到雲端）。需要 Dashboard / SMART App 的開發者勾選「啟用本機伺服器模式」即可解鎖既有 UI（mode toggle + Backend URL / API Key / SMART App URL 欄位）。
- ✋ **姓名升為必填**：跟 生日 / 性別 一致打紅星。step 2 的三個欄位現在都是真實必填。

**使用體驗修正**
- 🆙 **Step 1 banner 改寫**：以前只一句「請完成登入」，民眾常常在 NHI 分頁看起來「還在登入狀態」（其實 session 已逾時）→ 看到 popup 說沒登入會困惑「明明已經登入了」。新版分兩種情境條列，加一顆「前往登入頁面」按鈕一鍵帶到 NHI 登入畫面（不用懂 F5、不用記登入 URL）。
- 🎯 **Step 3 阻塞 strip 變跳轉按鈕**：CTA 被擋下時的 ⚠️ 警告整列可點，一鍵跳回該補的步驟（不用爬 stepper）。涵蓋「不在 NHI 分頁」、「未登入」、「基本資料未填」、「生日格式錯誤」四種狀況。
- 🆔 **隱藏 auto-XXXXXXXX 內部 ID**：第一次儲存（還沒同步）只顯示姓名；同步完從 NHI 拿到真實 cid 後，顯示半遮罩版本（`P12345****`）。
- 🧹 **Step 1 / Step 2 視覺一致化**：拿掉 🔗 🔒 ✅ 等 emoji；Step 1 三段 banner 改成白底 + 細色條，跟 Step 2 / 3 同調。
- 📛 **「本機後端」→「本機伺服器」** label 改名（降低工程術語感）。
- 🚀 **「開啟 SMART App」按鈕視覺升級**：從蒼白 outline 改為淡藍底 + 粗體字，明確讀作次要動作。

**Bug 修正**
- 🐞 **SMART App launch context patient_id 雜湊不一致**：v0.5.1 修了 popup 但漏修 sidebar，現在 sidebar 整個砍掉，等於問題自動消失（且 popup 那條路本來就是 hash 過的）。
- 🐞 **「開啟 SMART App」按鈕在拿掉身分證輸入框後永遠 disabled**：getPatientOverride() 不再包含 id_no 導致 launch 判斷失效，已改用模組級 cache。

**內部**
- 🧹 manifest.json 移除 content_scripts + web_accessible_resources 兩整塊（只為 sidebar.js 存在）
- 🧹 background.js 移除 syncRunning storage flag、onInstalled 重注入、sidebarEnabled migration key
- 🧹 popup.js 內 `derivePatientId` import 重新啟用（給流程一致化）
- 🧹 backend-ts biome 自動格式化收尾（v0.5.3 mapper 測試補的格式漂移）
- 🧹 死 CSS（`.data-state-card` / `.data-state-row` / `.data-state-value`）刪除
- 🧹 dist 產物從 3 個 bundle 降到 2 個（少了 sidebar.js）

---

## 0.5.4 重點

v0.5.3 的 popup UX 收尾 polish + 一個功能簡化。

**使用體驗修正**
- 🔢 Footer 版本號改為從 manifest 動態讀取（過去寫死在 v0.2.0）
- ⏳ CTA 按下後文字會變「取得中…」，比單純 disabled 更清楚有反應
- 🎨 「開啟健保存摺登入」按鈕回歸全站統一藍（先前是 out-of-palette 的 sky）
- 🔘 停止按鈕邊框加粗、加深，不會在 CTA 旁邊消失
- 🆗 Step 1 「步驟 ② 確認您的資料」變成可點的連結，直接帶進下一步
- 📛 模式「本機後端」改名「本機伺服器」(降低工程術語)

**Step 2 / Step 3 重新整理**
- ✂️ **拿掉身分證字號輸入框** — 取得時會從 NHI 自動帶入，過去 placeholder 已寫「留空 = 取得時自動帶入」。Step 2 現在就是三個真正需要決定的欄位：生日 / 性別 / 姓名
- 📝 姓名提示從兩行壓成一行（"填真名可協助遮罩報告內容；分享或展示時建議勾選遮罩"）
- 🚀 「開啟 SMART App」從蒼白白底改成淡藍底 + 粗體字，明確讀作次要動作（過去太像 disabled）
- 🎨 Step 1 三段 banner（需登入 / 已登入）改成白底 + 細色條，與 Step 2/3 視覺一致；移除 🔗 🔒 ✅ emoji
- 🗑 垃圾桶 tooltip 加註「不會刪除已下載到電腦的檔案」(醫療資料情境降焦慮)
- 🎛 「進階設定」只在 Step 3 + 本機伺服器模式下出現，不再浮在 Step 1/2 底下顯示空摺疊

**Bug 修正**
- 🐞 移除身分證欄位後，「開啟 SMART App」按鈕一度永遠 disabled — `getPatientOverride()` 不再包含 `id_no`，導致 launch 判斷邏輯失效。改用模組級快取從 storage 維持 `id_no`，背景在 sync 時將 placeholder 換成真實 cid 也會經由 `storage.onChanged` 自動更新

**內部**
- 🧹 刪除 dead CSS（`.data-state-card` / `.data-state-row` / `.data-state-value`，已被 `.state-rows` 取代）
- 🧹 popup.js 狀態訊息與 tooltip 引用按鈕標籤的舊 emoji 一併清掉

---

## 0.5.3 重點

這版主要是 popup UI 的大幅整理 + 一些 sync 流程的 bug 修正。

**UI 重新設計**
- 🪜 **3 步驟引導式 popup**：① 登入 → ② 您的資料 → ③ 取得
- 🎨 Step 3 從「動作卡 + 結果卡 + 下載卡 + Launch 卡」整併成**單一面板**，視覺壓力大幅降低
- 🎨 統一主色為藍色 (#2563eb)，綠色只用於成功狀態；SMART App 按鈕改 outline 藍框
- 🎨 Stepper 壓縮成 breadcrumb 形式（高度減半）
- 🪜 取得對象識別卡：step 3 頂端顯示「目前要抓誰」，點一下回 step 2 修改
- 🎨 取得 CTA 完成後自動降級為「重新取得」outline，讓下載按鈕變主動作
- 📋 完成後的明細從 dev jargon 改成中文（就醫 12 筆、處方 88 筆）

**病人資料 (step 2) 重新規劃**
- ⚠️ 必填欄位（生日、性別）放在最上方
- 🏥 姓名旁邊直接放遮罩 toggle + 說明（不再藏在進階設定）
- 💡 解釋填真名的好處：narrative 中的同名字串會自動一併遮罩
- 🆔 身分證移到最後（反正取得時自動帶入）

**Bug 修正**
- 🐞 NHI 沒回任何資料時不再顯示綠 ✅，改成 ⚠️ 警告 + 建議重新登入
- 🐞 Backend 模式 export URL 用 hashed Patient.id，不再永遠拿到空 bundle
- 🐞 Export 回 0 筆時不再覆蓋掉上傳的真實 total
- 🐞 Sync 進行中切回 popup，CTA 保持 disabled（不會被 onChanged 重設）
- 🐞 生日輸入到一半（只年份）會被攔下，不會 NaN 年齡
- 🐞 切換到 patient B 時，A 的下載 bundle / 狀態 / 後端 cache 都會清空
- 🐞 點 🗑 清除按鈕時，status banner 也跟著清掉
- 🐞 NHI 登入預檢：popup 一開就主動偵測 NHI 分頁 session 狀態
- 🐞 Sidebar 「📋 助理」面板 toggle 失效（讀錯 storage area）
- 🐞 Tombstone：sync 完自動清掉 NHI 已刪除的舊資料

**其他**
- 🧪 新增 80 個 mapper unit tests（從 107 → 187 tests）
- 📚 完整重寫 ARCHITECTURE.md（之前還是舊 Python 版內容）
- 🔒 Apache 2.0 license

---

## 0.5.2 重點

- 🐞 **生日驗證**：填到一半（例如只填年份）無法按「確定」或「取得」，避免下游年齡計算出現 NaN
- ✨ **Sidebar 助理 pill 更顯眼**：加大尺寸 + 開頁 3 秒微脈動，讓使用者一眼看到那是可點的按鈕
- 🧪 **Mapper 測試大幅補齊**：新增 80 個 unit test（107 → 187），覆蓋 allergy / procedure / encounter / diagnostic-report / linker / dispatch

---

## 0.5.1 重點（v0.5.0 之後的 polish）

- 🆕 **資料退場**：每次 sync 會自動清掉同 patient/page_type 但本次沒回傳的舊資料 — NHI 後端刪掉的紀錄不會再永留本機
- ✨ **登入預檢**：popup 一開就確認健保存摺分頁有效 session；沒登入會直接跳紅色 banner，不會讓你按完 CTA 才被「🔒 尚未登入」打回票
- ✨ **明細人話化**：完成後的「查看明細」用「就醫 12 筆 · 處方 88 筆 · 檢驗 412 筆」取代 `encounters=12/12`；技術計時收到「技術細節」子摺
- 🐞 **修正 Patient.id 雜湊不一致**：0.5.0 因為兩邊各自 salt 導致「📤 把本地檔案上傳到後端」之後查不到病人，已修
- 🎨 status pill 改名字優先（`陳O新 · P12345****`）、加 keyboard focus-visible 環

---

## 0.5.0 重點

這版是一次比較大的安全 + 隱私強化。

- 🔒 **所有 PHI 端點補上認證**：先前 `/fhir/*` 讀取與部分 `/sync/*` 路由可不需要任何驗證直接拿資料；現在統一強制 `X-Sync-API-Key` 或 SMART Bearer
- 🔒 **Dashboard 不再把 API key 編進前端**：改走 Next.js server proxy 注入；DevTools 看不到 key
- 🔒 **`Patient.id` 改為雜湊形式**：身分證從此不出現在 FHIR `Patient.id`、`subject.reference`、SMART token payload 或任何 URL；真實值只留在 `Patient.identifier[].value`
- 🔒 **設定改存 `chrome.storage.local`**：身分證 + API key 不再隨 Google 帳號同步到所有裝置
- 🔒 後端預設綁 `127.0.0.1`、`/smart/authorize` 拒絕無 launch token 的 standalone 登入、驗 `aud`、CORS 接受清單可由 `ALLOWED_EXTENSION_IDS` 收緊
- 🎨 病人資料卡簡化、模式切換 label 改、CTA 卡住時把原因 inline 顯示、Dashboard 在地化、release notes 大幅改寫

**破壞性變更**（從 0.4.x 升上來請看）：
- Patient.id 變雜湊形式 → 舊 backend DB 資料 orphan，建議 `docker compose down -v` 清掉再重 sync
- `optional_host_permissions` 收緊只允許 localhost；LAN 自架 backend 需自行改 `manifest.json`
- Dashboard PHI 路徑改走 `/api/backend/*` → docker-compose 用戶要 `docker compose up --build` 重建 frontend image

---

## 這個是什麼

一個 Chrome 擴充功能，可以把你在**健保存摺** (myhealthbank.nhi.gov.tw) 看到的就醫紀錄、用藥、檢驗報告、影像報告，**整理成 FHIR R4 標準格式的健康紀錄檔**。檔案可以：
- 下載到自己電腦（個人病歷備份、單次匯出、轉給其他醫療系統用）
- 或上傳到本機 Docker 後端，配合 Dashboard / SMART App 看資料

PHI 永遠不離開你機器。

---

## 🟢 安裝（純 Extension，最快 2 分鐘）

如果只是要**把健保資料下載成 FHIR 檔**，這條路就夠了，完全不用裝 Docker。

1. 下方下載 `nhi-fhir-bridge-extension-v0.6.3.zip`
2. 解壓到電腦任意位置（例如 `~/nhi-fhir-bridge/`）
3. Chrome 網址列輸入 `chrome://extensions/`
4. 右上角開啟「**開發人員模式**」
5. 左上角點「**載入未封裝項目**」→ 選擇剛解壓的 `dist/` 資料夾
6. **把圖示釘到工具列**（Chrome 預設不會自動釘）：
   點瀏覽器右上角的 🧩（擴充功能拼圖圖示）→ 找到 **NHI-FHIR Bridge** → 點旁邊的 📌 圖釘
7. 工具列就會看到 NHI-FHIR Bridge 圖示： <img src="https://raw.githubusercontent.com/voho0000/NHI-FHIR-BRIDGE/v0.6.3/extension/dist/icons/icon-48.png" width="28" height="28" align="middle" />

---

## 怎麼用

1. 開新分頁登入 https://myhealthbank.nhi.gov.tw/（沒登入的話，extension 會跳按鈕帶你過去）
2. 點 Chrome 工具列上的 NHI-FHIR Bridge 圖示打開小視窗
3. 病人資料卡填：
   - **性別**（必填，會寫進 FHIR Patient 資源，後端 / SMART App 判讀檢驗值參考區間會用到）
   - **出生年份**（建議填真實的，年齡會影響檢驗值判讀區間）
   - 姓名、完整生日可以隨便填假的
   - 身分證字號**不用填**，按下取得時 extension 會自動從健保存摺帶入
4. 按「**🔄 取得健保存摺資料**」— 通常 15–30 秒（看 NHI 速度）
5. 完成後會跳出「**📥 下載健康紀錄檔**」按鈕，按下去檔案就存到下載夾

檔名範例：`nhi-P12345XXXX-20250517-20260517.json`
- `P12345XXXX` ＝ 身分證半遮罩（前 6 碼可見、後 4 碼以 X 取代；避免下載夾被瞄到，檔案內容仍是真實值）
- `20250517-20260517` ＝ 這次抓的健保資料區間（起–訖日）

---

## 隱私說明（重要）

- 你輸入的姓名、生日 → **只存在你自己的瀏覽器**，extension 不會上傳給任何第三方
- 身分證字號 → **顯示時自動半遮罩**（`P12345****`），但檔案內容是真實值（FHIR 規範需要）
- 預設下載的健康紀錄檔**包含真實姓名**（民眾自用情境）
- 如要在多病人診間 / 教學展示用，可以打開「進階設定 → 對外輸出時遮罩病人姓名」，輸出檔的姓名就會變成 `郭O新` 之類遮罩版

---

## 🔵 進階：搭配 Backend + Dashboard

如果要：
- 多次同步累積在本地 FHIR Server
- 用 Dashboard 看多個病人
- 一鍵 launch SMART on FHIR App

那加跑後端（需要 [Docker Desktop](https://docs.docker.com/get-docker/)）：

```sh
git clone https://github.com/voho0000/NHI-FHIR-BRIDGE.git
cd $(basename voho0000/NHI-FHIR-BRIDGE)
docker compose up -d
```

然後 Extension popup 上方切到「**🏥 本機後端 (進階)**」即可。Dashboard 在 http://localhost:3010。

---

詳細說明、架構圖、FAQ 見 [README](https://github.com/voho0000/NHI-FHIR-BRIDGE#readme)。


**Full Changelog**: https://github.com/voho0000/NHI-FHIR-BRIDGE/compare/v0.6.2...v0.6.3

---

## 0.6.2 重點 — 2026-05-18

**使用者可見**
- ⚠️ **加上資料正確性免責聲明**：popup 底部 + README 開頭都加上小型警示——本工具僅供參考，無法保證資料完全準確；臨床判讀請以健保署健康存摺顯示為主。NHI schema 偶有變動 + 任何 mapper bug 都可能造成輸出與真實情況不一致。

**內部品質工程**
這版底層做了一輪結構性投資，是 v0.6.1 那批「資料正確性 bug」事件後的根本反省：bug 之所以漏出來是 extension adapter 完全沒有 unit test，sit 在 SW context 裡無法隔離測試。這版花力氣補上：

- 🔧 **adapter 抽 module**：把 `extension/src/background.js` 裡的 12 個 `adapt*` + helper 函式抽到獨立的 `extension/src/nhi-adapters.js`，可以在 vitest 下純函式測試。background.js 從 1700 多行縮到 1400 多行。
- 🧪 **52 個 adapter 單元測試**：每個 adapter 至少測「正常路徑」、「缺欄位 fallback」、「null/型別防禦」、「日期欄位優先順序」。v0.6.1 那兩個 bug 都有對應 regression test，再犯立刻 CI 紅燈。
- 📦 **真實 NHI payload 作為測試 fixture**：把 IHKE3409（lab）、IHKE3408S02（imaging）、IHKE3301S05（procedure）三個 endpoint 的活捕獲 payload 收進 `extension/tests/fixtures/`，每次跑測試都會用真實資料形狀驗證 adapter 輸出。
- 🛠️ **`scripts/verify-sync.mjs` 偵錯工具**：對任何 FHIR JSON 跑啟發式檢查（日期 clustering、缺 meta tag、檔名 vs 實際資料 span），用來抓 v0.6.1 那種「住院期間檢驗全擠到一天」的 smell。`node scripts/verify-sync.mjs path/to/file.json` 一句搞定。
- 🤖 **CI 接上**：`backend-ts + extension` workflow 現在會跑 `npm run test --workspace extension`。

---

## 0.6.1 重點

資料正確性 patch — 修兩個系統性的「日期欄位選錯」bug，會影響有住院期間檢驗 / 影像的使用者。

**Bug 修正**
- 🩺 **實驗室檢驗用採檢日，不再用入院日**：NHI 的 lab row 同時帶 `funC_DATE`（就診/入院日）和 `reaL_INSPECT_DATE`（實際採檢日）。原本 adapter 只看 `funC_DATE`，結果**住院期間每一筆 lab 都被擠到入院當天**。例如使用者 5/18 入院、5/22 抽到 191 mg/dL 血糖 → FHIR 卻顯示在 5/18。改成 `reaL_INSPECT_DATE` 優先（缺則回落 `funC_DATE`）。影響 IHKE3409（其他檢驗）+ IHKE3404（癌篩）兩個 endpoint。
- 🖼️ **影像報告同樣的問題**：DiagnosticReport.effectiveDateTime 原本用 `func_DATE`，住院期間做的 CT/X-ray 全部錯標成入院日。同 pattern 修法（IHKE3408S02 detail adapter）。

**內部**
- 🧹 刪掉死碼 `adaptDiagReport`（定義但無 call site）
- 📋 對所有 adapter 跑了一次 date-field 系統性審查；其他 adapter（Encounter / 預防保健 / 過敏 / 處方 / 處置）的 date 欄位選擇 audit 過、語意正確

建議 reload extension 後重新「取得健保存摺資料」，新檔的 lab / imaging 日期就會對。

---

## 0.6.0 重點

這版是 extension 的**定位轉折**：從「附帶嵌入 SMART App 面板的開發者友善工具」收斂為「面向一般民眾、進階模式選擇性開啟」的健保資料下載工具。

**重大改動**
- ✂️ **拿掉嵌入式 SMART App 助理面板**：右側 pill + iframe 機制整套移除（-1.8k 行）。原因是 Chrome 的 Private Network Access 會擋 iframe（public origin）→ localhost backend 的 fetch，導致面板永遠卡在「Launching SMART…」。要打開 SMART App 改走 popup 既有的「開啟 SMART App」按鈕在新 tab 開啟（top-level browsing context 可繞 PNA 限制）。
- 🎛 **本機伺服器模式藏進進階設定**：預設只剩「下載到電腦」一條路。99% 民眾用不到 Docker backend，「伺服器」這個詞對非工程使用者來說容易誤解（以為資料會上傳到雲端）。需要 Dashboard / SMART App 的開發者勾選「啟用本機伺服器模式」即可解鎖既有 UI（mode toggle + Backend URL / API Key / SMART App URL 欄位）。
- ✋ **姓名升為必填**：跟 生日 / 性別 一致打紅星。step 2 的三個欄位現在都是真實必填。

**使用體驗修正**
- 🆙 **Step 1 banner 改寫**：以前只一句「請完成登入」，民眾常常在 NHI 分頁看起來「還在登入狀態」（其實 session 已逾時）→ 看到 popup 說沒登入會困惑「明明已經登入了」。新版分兩種情境條列，加一顆「前往登入頁面」按鈕一鍵帶到 NHI 登入畫面（不用懂 F5、不用記登入 URL）。
- 🎯 **Step 3 阻塞 strip 變跳轉按鈕**：CTA 被擋下時的 ⚠️ 警告整列可點，一鍵跳回該補的步驟（不用爬 stepper）。涵蓋「不在 NHI 分頁」、「未登入」、「基本資料未填」、「生日格式錯誤」四種狀況。
- 🆔 **隱藏 auto-XXXXXXXX 內部 ID**：第一次儲存（還沒同步）只顯示姓名；同步完從 NHI 拿到真實 cid 後，顯示半遮罩版本（`P12345****`）。
- 🧹 **Step 1 / Step 2 視覺一致化**：拿掉 🔗 🔒 ✅ 等 emoji；Step 1 三段 banner 改成白底 + 細色條，跟 Step 2 / 3 同調。
- 📛 **「本機後端」→「本機伺服器」** label 改名（降低工程術語感）。
- 🚀 **「開啟 SMART App」按鈕視覺升級**：從蒼白 outline 改為淡藍底 + 粗體字，明確讀作次要動作。

**Bug 修正**
- 🐞 **SMART App launch context patient_id 雜湊不一致**：v0.5.1 修了 popup 但漏修 sidebar，現在 sidebar 整個砍掉，等於問題自動消失（且 popup 那條路本來就是 hash 過的）。
- 🐞 **「開啟 SMART App」按鈕在拿掉身分證輸入框後永遠 disabled**：getPatientOverride() 不再包含 id_no 導致 launch 判斷失效，已改用模組級 cache。

**內部**
- 🧹 manifest.json 移除 content_scripts + web_accessible_resources 兩整塊（只為 sidebar.js 存在）
- 🧹 background.js 移除 syncRunning storage flag、onInstalled 重注入、sidebarEnabled migration key
- 🧹 popup.js 內 `derivePatientId` import 重新啟用（給流程一致化）
- 🧹 backend-ts biome 自動格式化收尾（v0.5.3 mapper 測試補的格式漂移）
- 🧹 死 CSS（`.data-state-card` / `.data-state-row` / `.data-state-value`）刪除
- 🧹 dist 產物從 3 個 bundle 降到 2 個（少了 sidebar.js）

---

## 0.5.4 重點

v0.5.3 的 popup UX 收尾 polish + 一個功能簡化。

**使用體驗修正**
- 🔢 Footer 版本號改為從 manifest 動態讀取（過去寫死在 v0.2.0）
- ⏳ CTA 按下後文字會變「取得中…」，比單純 disabled 更清楚有反應
- 🎨 「開啟健保存摺登入」按鈕回歸全站統一藍（先前是 out-of-palette 的 sky）
- 🔘 停止按鈕邊框加粗、加深，不會在 CTA 旁邊消失
- 🆗 Step 1 「步驟 ② 確認您的資料」變成可點的連結，直接帶進下一步
- 📛 模式「本機後端」改名「本機伺服器」(降低工程術語)

**Step 2 / Step 3 重新整理**
- ✂️ **拿掉身分證字號輸入框** — 取得時會從 NHI 自動帶入，過去 placeholder 已寫「留空 = 取得時自動帶入」。Step 2 現在就是三個真正需要決定的欄位：生日 / 性別 / 姓名
- 📝 姓名提示從兩行壓成一行（"填真名可協助遮罩報告內容；分享或展示時建議勾選遮罩"）
- 🚀 「開啟 SMART App」從蒼白白底改成淡藍底 + 粗體字，明確讀作次要動作（過去太像 disabled）
- 🎨 Step 1 三段 banner（需登入 / 已登入）改成白底 + 細色條，與 Step 2/3 視覺一致；移除 🔗 🔒 ✅ emoji
- 🗑 垃圾桶 tooltip 加註「不會刪除已下載到電腦的檔案」(醫療資料情境降焦慮)
- 🎛 「進階設定」只在 Step 3 + 本機伺服器模式下出現，不再浮在 Step 1/2 底下顯示空摺疊

**Bug 修正**
- 🐞 移除身分證欄位後，「開啟 SMART App」按鈕一度永遠 disabled — `getPatientOverride()` 不再包含 `id_no`，導致 launch 判斷邏輯失效。改用模組級快取從 storage 維持 `id_no`，背景在 sync 時將 placeholder 換成真實 cid 也會經由 `storage.onChanged` 自動更新

**內部**
- 🧹 刪除 dead CSS（`.data-state-card` / `.data-state-row` / `.data-state-value`，已被 `.state-rows` 取代）
- 🧹 popup.js 狀態訊息與 tooltip 引用按鈕標籤的舊 emoji 一併清掉

---

## 0.5.3 重點

這版主要是 popup UI 的大幅整理 + 一些 sync 流程的 bug 修正。

**UI 重新設計**
- 🪜 **3 步驟引導式 popup**：① 登入 → ② 您的資料 → ③ 取得
- 🎨 Step 3 從「動作卡 + 結果卡 + 下載卡 + Launch 卡」整併成**單一面板**，視覺壓力大幅降低
- 🎨 統一主色為藍色 (#2563eb)，綠色只用於成功狀態；SMART App 按鈕改 outline 藍框
- 🎨 Stepper 壓縮成 breadcrumb 形式（高度減半）
- 🪜 取得對象識別卡：step 3 頂端顯示「目前要抓誰」，點一下回 step 2 修改
- 🎨 取得 CTA 完成後自動降級為「重新取得」outline，讓下載按鈕變主動作
- 📋 完成後的明細從 dev jargon 改成中文（就醫 12 筆、處方 88 筆）

**病人資料 (step 2) 重新規劃**
- ⚠️ 必填欄位（生日、性別）放在最上方
- 🏥 姓名旁邊直接放遮罩 toggle + 說明（不再藏在進階設定）
- 💡 解釋填真名的好處：narrative 中的同名字串會自動一併遮罩
- 🆔 身分證移到最後（反正取得時自動帶入）

**Bug 修正**
- 🐞 NHI 沒回任何資料時不再顯示綠 ✅，改成 ⚠️ 警告 + 建議重新登入
- 🐞 Backend 模式 export URL 用 hashed Patient.id，不再永遠拿到空 bundle
- 🐞 Export 回 0 筆時不再覆蓋掉上傳的真實 total
- 🐞 Sync 進行中切回 popup，CTA 保持 disabled（不會被 onChanged 重設）
- 🐞 生日輸入到一半（只年份）會被攔下，不會 NaN 年齡
- 🐞 切換到 patient B 時，A 的下載 bundle / 狀態 / 後端 cache 都會清空
- 🐞 點 🗑 清除按鈕時，status banner 也跟著清掉
- 🐞 NHI 登入預檢：popup 一開就主動偵測 NHI 分頁 session 狀態
- 🐞 Sidebar 「📋 助理」面板 toggle 失效（讀錯 storage area）
- 🐞 Tombstone：sync 完自動清掉 NHI 已刪除的舊資料

**其他**
- 🧪 新增 80 個 mapper unit tests（從 107 → 187 tests）
- 📚 完整重寫 ARCHITECTURE.md（之前還是舊 Python 版內容）
- 🔒 Apache 2.0 license

---

## 0.5.2 重點

- 🐞 **生日驗證**：填到一半（例如只填年份）無法按「確定」或「取得」，避免下游年齡計算出現 NaN
- ✨ **Sidebar 助理 pill 更顯眼**：加大尺寸 + 開頁 3 秒微脈動，讓使用者一眼看到那是可點的按鈕
- 🧪 **Mapper 測試大幅補齊**：新增 80 個 unit test（107 → 187），覆蓋 allergy / procedure / encounter / diagnostic-report / linker / dispatch

---

## 0.5.1 重點（v0.5.0 之後的 polish）

- 🆕 **資料退場**：每次 sync 會自動清掉同 patient/page_type 但本次沒回傳的舊資料 — NHI 後端刪掉的紀錄不會再永留本機
- ✨ **登入預檢**：popup 一開就確認健保存摺分頁有效 session；沒登入會直接跳紅色 banner，不會讓你按完 CTA 才被「🔒 尚未登入」打回票
- ✨ **明細人話化**：完成後的「查看明細」用「就醫 12 筆 · 處方 88 筆 · 檢驗 412 筆」取代 `encounters=12/12`；技術計時收到「技術細節」子摺
- 🐞 **修正 Patient.id 雜湊不一致**：0.5.0 因為兩邊各自 salt 導致「📤 把本地檔案上傳到後端」之後查不到病人，已修
- 🎨 status pill 改名字優先（`陳O新 · P12345****`）、加 keyboard focus-visible 環

---

## 0.5.0 重點

這版是一次比較大的安全 + 隱私強化。

- 🔒 **所有 PHI 端點補上認證**：先前 `/fhir/*` 讀取與部分 `/sync/*` 路由可不需要任何驗證直接拿資料；現在統一強制 `X-Sync-API-Key` 或 SMART Bearer
- 🔒 **Dashboard 不再把 API key 編進前端**：改走 Next.js server proxy 注入；DevTools 看不到 key
- 🔒 **`Patient.id` 改為雜湊形式**：身分證從此不出現在 FHIR `Patient.id`、`subject.reference`、SMART token payload 或任何 URL；真實值只留在 `Patient.identifier[].value`
- 🔒 **設定改存 `chrome.storage.local`**：身分證 + API key 不再隨 Google 帳號同步到所有裝置
- 🔒 後端預設綁 `127.0.0.1`、`/smart/authorize` 拒絕無 launch token 的 standalone 登入、驗 `aud`、CORS 接受清單可由 `ALLOWED_EXTENSION_IDS` 收緊
- 🎨 病人資料卡簡化、模式切換 label 改、CTA 卡住時把原因 inline 顯示、Dashboard 在地化、release notes 大幅改寫

**破壞性變更**（從 0.4.x 升上來請看）：
- Patient.id 變雜湊形式 → 舊 backend DB 資料 orphan，建議 `docker compose down -v` 清掉再重 sync
- `optional_host_permissions` 收緊只允許 localhost；LAN 自架 backend 需自行改 `manifest.json`
- Dashboard PHI 路徑改走 `/api/backend/*` → docker-compose 用戶要 `docker compose up --build` 重建 frontend image

---

## 這個是什麼

一個 Chrome 擴充功能，可以把你在**健保存摺** (myhealthbank.nhi.gov.tw) 看到的就醫紀錄、用藥、檢驗報告、影像報告，**整理成 FHIR R4 標準格式的健康紀錄檔**。檔案可以：
- 下載到自己電腦（個人病歷備份、單次匯出、轉給其他醫療系統用）
- 或上傳到本機 Docker 後端，配合 Dashboard / SMART App 看資料

PHI 永遠不離開你機器。

---

## 🟢 安裝（純 Extension，最快 2 分鐘）

如果只是要**把健保資料下載成 FHIR 檔**，這條路就夠了，完全不用裝 Docker。

1. 下方下載 `nhi-fhir-bridge-extension-v0.6.2.zip`
2. 解壓到電腦任意位置（例如 `~/nhi-fhir-bridge/`）
3. Chrome 網址列輸入 `chrome://extensions/`
4. 右上角開啟「**開發人員模式**」
5. 左上角點「**載入未封裝項目**」→ 選擇剛解壓的 `dist/` 資料夾
6. **把圖示釘到工具列**（Chrome 預設不會自動釘）：
   點瀏覽器右上角的 🧩（擴充功能拼圖圖示）→ 找到 **NHI-FHIR Bridge** → 點旁邊的 📌 圖釘
7. 工具列就會看到 NHI-FHIR Bridge 圖示： <img src="https://raw.githubusercontent.com/voho0000/NHI-FHIR-BRIDGE/v0.6.2/extension/dist/icons/icon-48.png" width="28" height="28" align="middle" />

---

## 怎麼用

1. 開新分頁登入 https://myhealthbank.nhi.gov.tw/（沒登入的話，extension 會跳按鈕帶你過去）
2. 點 Chrome 工具列上的 NHI-FHIR Bridge 圖示打開小視窗
3. 病人資料卡填：
   - **性別**（必填，會寫進 FHIR Patient 資源，後端 / SMART App 判讀檢驗值參考區間會用到）
   - **出生年份**（建議填真實的，年齡會影響檢驗值判讀區間）
   - 姓名、完整生日可以隨便填假的
   - 身分證字號**不用填**，按下取得時 extension 會自動從健保存摺帶入
4. 按「**🔄 取得健保存摺資料**」— 通常 15–30 秒（看 NHI 速度）
5. 完成後會跳出「**📥 下載健康紀錄檔**」按鈕，按下去檔案就存到下載夾

檔名範例：`nhi-P12345XXXX-20250517-20260517.json`
- `P12345XXXX` ＝ 身分證半遮罩（前 6 碼可見、後 4 碼以 X 取代；避免下載夾被瞄到，檔案內容仍是真實值）
- `20250517-20260517` ＝ 這次抓的健保資料區間（起–訖日）

---

## 隱私說明（重要）

- 你輸入的姓名、生日 → **只存在你自己的瀏覽器**，extension 不會上傳給任何第三方
- 身分證字號 → **顯示時自動半遮罩**（`P12345****`），但檔案內容是真實值（FHIR 規範需要）
- 預設下載的健康紀錄檔**包含真實姓名**（民眾自用情境）
- 如要在多病人診間 / 教學展示用，可以打開「進階設定 → 對外輸出時遮罩病人姓名」，輸出檔的姓名就會變成 `郭O新` 之類遮罩版

---

## 🔵 進階：搭配 Backend + Dashboard

如果要：
- 多次同步累積在本地 FHIR Server
- 用 Dashboard 看多個病人
- 一鍵 launch SMART on FHIR App

那加跑後端（需要 [Docker Desktop](https://docs.docker.com/get-docker/)）：

```sh
git clone https://github.com/voho0000/NHI-FHIR-BRIDGE.git
cd $(basename voho0000/NHI-FHIR-BRIDGE)
docker compose up -d
```

然後 Extension popup 上方切到「**🏥 本機後端 (進階)**」即可。Dashboard 在 http://localhost:3010。

---

詳細說明、架構圖、FAQ 見 [README](https://github.com/voho0000/NHI-FHIR-BRIDGE#readme)。


**Full Changelog**: https://github.com/voho0000/NHI-FHIR-BRIDGE/compare/v0.6.1...v0.6.2

---

## 0.6.1 重點 — 2026-05-18

資料正確性 patch — 修兩個系統性的「日期欄位選錯」bug，會影響有住院期間檢驗 / 影像的使用者。

**Bug 修正**
- 🩺 **實驗室檢驗用採檢日，不再用入院日**：NHI 的 lab row 同時帶 `funC_DATE`（就診/入院日）和 `reaL_INSPECT_DATE`（實際採檢日）。原本 adapter 只看 `funC_DATE`，結果**住院期間每一筆 lab 都被擠到入院當天**。例如使用者 5/18 入院、5/22 抽到 191 mg/dL 血糖 → FHIR 卻顯示在 5/18。改成 `reaL_INSPECT_DATE` 優先（缺則回落 `funC_DATE`）。影響 IHKE3409（其他檢驗）+ IHKE3404（癌篩）兩個 endpoint。
- 🖼️ **影像報告同樣的問題**：DiagnosticReport.effectiveDateTime 原本用 `func_DATE`，住院期間做的 CT/X-ray 全部錯標成入院日。同 pattern 修法（IHKE3408S02 detail adapter）。

**內部**
- 🧹 刪掉死碼 `adaptDiagReport`（定義但無 call site）
- 📋 對所有 adapter 跑了一次 date-field 系統性審查；其他 adapter（Encounter / 預防保健 / 過敏 / 處方 / 處置）的 date 欄位選擇 audit 過、語意正確

建議 reload extension 後重新「取得健保存摺資料」，新檔的 lab / imaging 日期就會對。

---

## 0.6.0 重點

這版是 extension 的**定位轉折**：從「附帶嵌入 SMART App 面板的開發者友善工具」收斂為「面向一般民眾、進階模式選擇性開啟」的健保資料下載工具。

**重大改動**
- ✂️ **拿掉嵌入式 SMART App 助理面板**：右側 pill + iframe 機制整套移除（-1.8k 行）。原因是 Chrome 的 Private Network Access 會擋 iframe（public origin）→ localhost backend 的 fetch，導致面板永遠卡在「Launching SMART…」。要打開 SMART App 改走 popup 既有的「開啟 SMART App」按鈕在新 tab 開啟（top-level browsing context 可繞 PNA 限制）。
- 🎛 **本機伺服器模式藏進進階設定**：預設只剩「下載到電腦」一條路。99% 民眾用不到 Docker backend，「伺服器」這個詞對非工程使用者來說容易誤解（以為資料會上傳到雲端）。需要 Dashboard / SMART App 的開發者勾選「啟用本機伺服器模式」即可解鎖既有 UI（mode toggle + Backend URL / API Key / SMART App URL 欄位）。
- ✋ **姓名升為必填**：跟 生日 / 性別 一致打紅星。step 2 的三個欄位現在都是真實必填。

**使用體驗修正**
- 🆙 **Step 1 banner 改寫**：以前只一句「請完成登入」，民眾常常在 NHI 分頁看起來「還在登入狀態」（其實 session 已逾時）→ 看到 popup 說沒登入會困惑「明明已經登入了」。新版分兩種情境條列，加一顆「前往登入頁面」按鈕一鍵帶到 NHI 登入畫面（不用懂 F5、不用記登入 URL）。
- 🎯 **Step 3 阻塞 strip 變跳轉按鈕**：CTA 被擋下時的 ⚠️ 警告整列可點，一鍵跳回該補的步驟（不用爬 stepper）。涵蓋「不在 NHI 分頁」、「未登入」、「基本資料未填」、「生日格式錯誤」四種狀況。
- 🆔 **隱藏 auto-XXXXXXXX 內部 ID**：第一次儲存（還沒同步）只顯示姓名；同步完從 NHI 拿到真實 cid 後，顯示半遮罩版本（`P12345****`）。
- 🧹 **Step 1 / Step 2 視覺一致化**：拿掉 🔗 🔒 ✅ 等 emoji；Step 1 三段 banner 改成白底 + 細色條，跟 Step 2 / 3 同調。
- 📛 **「本機後端」→「本機伺服器」** label 改名（降低工程術語感）。
- 🚀 **「開啟 SMART App」按鈕視覺升級**：從蒼白 outline 改為淡藍底 + 粗體字，明確讀作次要動作。

**Bug 修正**
- 🐞 **SMART App launch context patient_id 雜湊不一致**：v0.5.1 修了 popup 但漏修 sidebar，現在 sidebar 整個砍掉，等於問題自動消失（且 popup 那條路本來就是 hash 過的）。
- 🐞 **「開啟 SMART App」按鈕在拿掉身分證輸入框後永遠 disabled**：getPatientOverride() 不再包含 id_no 導致 launch 判斷失效，已改用模組級 cache。

**內部**
- 🧹 manifest.json 移除 content_scripts + web_accessible_resources 兩整塊（只為 sidebar.js 存在）
- 🧹 background.js 移除 syncRunning storage flag、onInstalled 重注入、sidebarEnabled migration key
- 🧹 popup.js 內 `derivePatientId` import 重新啟用（給流程一致化）
- 🧹 backend-ts biome 自動格式化收尾（v0.5.3 mapper 測試補的格式漂移）
- 🧹 死 CSS（`.data-state-card` / `.data-state-row` / `.data-state-value`）刪除
- 🧹 dist 產物從 3 個 bundle 降到 2 個（少了 sidebar.js）

---

## 0.5.4 重點

v0.5.3 的 popup UX 收尾 polish + 一個功能簡化。

**使用體驗修正**
- 🔢 Footer 版本號改為從 manifest 動態讀取（過去寫死在 v0.2.0）
- ⏳ CTA 按下後文字會變「取得中…」，比單純 disabled 更清楚有反應
- 🎨 「開啟健保存摺登入」按鈕回歸全站統一藍（先前是 out-of-palette 的 sky）
- 🔘 停止按鈕邊框加粗、加深，不會在 CTA 旁邊消失
- 🆗 Step 1 「步驟 ② 確認您的資料」變成可點的連結，直接帶進下一步
- 📛 模式「本機後端」改名「本機伺服器」(降低工程術語)

**Step 2 / Step 3 重新整理**
- ✂️ **拿掉身分證字號輸入框** — 取得時會從 NHI 自動帶入，過去 placeholder 已寫「留空 = 取得時自動帶入」。Step 2 現在就是三個真正需要決定的欄位：生日 / 性別 / 姓名
- 📝 姓名提示從兩行壓成一行（"填真名可協助遮罩報告內容；分享或展示時建議勾選遮罩"）
- 🚀 「開啟 SMART App」從蒼白白底改成淡藍底 + 粗體字，明確讀作次要動作（過去太像 disabled）
- 🎨 Step 1 三段 banner（需登入 / 已登入）改成白底 + 細色條，與 Step 2/3 視覺一致；移除 🔗 🔒 ✅ emoji
- 🗑 垃圾桶 tooltip 加註「不會刪除已下載到電腦的檔案」(醫療資料情境降焦慮)
- 🎛 「進階設定」只在 Step 3 + 本機伺服器模式下出現，不再浮在 Step 1/2 底下顯示空摺疊

**Bug 修正**
- 🐞 移除身分證欄位後，「開啟 SMART App」按鈕一度永遠 disabled — `getPatientOverride()` 不再包含 `id_no`，導致 launch 判斷邏輯失效。改用模組級快取從 storage 維持 `id_no`，背景在 sync 時將 placeholder 換成真實 cid 也會經由 `storage.onChanged` 自動更新

**內部**
- 🧹 刪除 dead CSS（`.data-state-card` / `.data-state-row` / `.data-state-value`，已被 `.state-rows` 取代）
- 🧹 popup.js 狀態訊息與 tooltip 引用按鈕標籤的舊 emoji 一併清掉

---

## 0.5.3 重點

這版主要是 popup UI 的大幅整理 + 一些 sync 流程的 bug 修正。

**UI 重新設計**
- 🪜 **3 步驟引導式 popup**：① 登入 → ② 您的資料 → ③ 取得
- 🎨 Step 3 從「動作卡 + 結果卡 + 下載卡 + Launch 卡」整併成**單一面板**，視覺壓力大幅降低
- 🎨 統一主色為藍色 (#2563eb)，綠色只用於成功狀態；SMART App 按鈕改 outline 藍框
- 🎨 Stepper 壓縮成 breadcrumb 形式（高度減半）
- 🪜 取得對象識別卡：step 3 頂端顯示「目前要抓誰」，點一下回 step 2 修改
- 🎨 取得 CTA 完成後自動降級為「重新取得」outline，讓下載按鈕變主動作
- 📋 完成後的明細從 dev jargon 改成中文（就醫 12 筆、處方 88 筆）

**病人資料 (step 2) 重新規劃**
- ⚠️ 必填欄位（生日、性別）放在最上方
- 🏥 姓名旁邊直接放遮罩 toggle + 說明（不再藏在進階設定）
- 💡 解釋填真名的好處：narrative 中的同名字串會自動一併遮罩
- 🆔 身分證移到最後（反正取得時自動帶入）

**Bug 修正**
- 🐞 NHI 沒回任何資料時不再顯示綠 ✅，改成 ⚠️ 警告 + 建議重新登入
- 🐞 Backend 模式 export URL 用 hashed Patient.id，不再永遠拿到空 bundle
- 🐞 Export 回 0 筆時不再覆蓋掉上傳的真實 total
- 🐞 Sync 進行中切回 popup，CTA 保持 disabled（不會被 onChanged 重設）
- 🐞 生日輸入到一半（只年份）會被攔下，不會 NaN 年齡
- 🐞 切換到 patient B 時，A 的下載 bundle / 狀態 / 後端 cache 都會清空
- 🐞 點 🗑 清除按鈕時，status banner 也跟著清掉
- 🐞 NHI 登入預檢：popup 一開就主動偵測 NHI 分頁 session 狀態
- 🐞 Sidebar 「📋 助理」面板 toggle 失效（讀錯 storage area）
- 🐞 Tombstone：sync 完自動清掉 NHI 已刪除的舊資料

**其他**
- 🧪 新增 80 個 mapper unit tests（從 107 → 187 tests）
- 📚 完整重寫 ARCHITECTURE.md（之前還是舊 Python 版內容）
- 🔒 Apache 2.0 license

---

## 0.5.2 重點

- 🐞 **生日驗證**：填到一半（例如只填年份）無法按「確定」或「取得」，避免下游年齡計算出現 NaN
- ✨ **Sidebar 助理 pill 更顯眼**：加大尺寸 + 開頁 3 秒微脈動，讓使用者一眼看到那是可點的按鈕
- 🧪 **Mapper 測試大幅補齊**：新增 80 個 unit test（107 → 187），覆蓋 allergy / procedure / encounter / diagnostic-report / linker / dispatch

---

## 0.5.1 重點（v0.5.0 之後的 polish）

- 🆕 **資料退場**：每次 sync 會自動清掉同 patient/page_type 但本次沒回傳的舊資料 — NHI 後端刪掉的紀錄不會再永留本機
- ✨ **登入預檢**：popup 一開就確認健保存摺分頁有效 session；沒登入會直接跳紅色 banner，不會讓你按完 CTA 才被「🔒 尚未登入」打回票
- ✨ **明細人話化**：完成後的「查看明細」用「就醫 12 筆 · 處方 88 筆 · 檢驗 412 筆」取代 `encounters=12/12`；技術計時收到「技術細節」子摺
- 🐞 **修正 Patient.id 雜湊不一致**：0.5.0 因為兩邊各自 salt 導致「📤 把本地檔案上傳到後端」之後查不到病人，已修
- 🎨 status pill 改名字優先（`陳O新 · P12345****`）、加 keyboard focus-visible 環

---

## 0.5.0 重點

這版是一次比較大的安全 + 隱私強化。

- 🔒 **所有 PHI 端點補上認證**：先前 `/fhir/*` 讀取與部分 `/sync/*` 路由可不需要任何驗證直接拿資料；現在統一強制 `X-Sync-API-Key` 或 SMART Bearer
- 🔒 **Dashboard 不再把 API key 編進前端**：改走 Next.js server proxy 注入；DevTools 看不到 key
- 🔒 **`Patient.id` 改為雜湊形式**：身分證從此不出現在 FHIR `Patient.id`、`subject.reference`、SMART token payload 或任何 URL；真實值只留在 `Patient.identifier[].value`
- 🔒 **設定改存 `chrome.storage.local`**：身分證 + API key 不再隨 Google 帳號同步到所有裝置
- 🔒 後端預設綁 `127.0.0.1`、`/smart/authorize` 拒絕無 launch token 的 standalone 登入、驗 `aud`、CORS 接受清單可由 `ALLOWED_EXTENSION_IDS` 收緊
- 🎨 病人資料卡簡化、模式切換 label 改、CTA 卡住時把原因 inline 顯示、Dashboard 在地化、release notes 大幅改寫

**破壞性變更**（從 0.4.x 升上來請看）：
- Patient.id 變雜湊形式 → 舊 backend DB 資料 orphan，建議 `docker compose down -v` 清掉再重 sync
- `optional_host_permissions` 收緊只允許 localhost；LAN 自架 backend 需自行改 `manifest.json`
- Dashboard PHI 路徑改走 `/api/backend/*` → docker-compose 用戶要 `docker compose up --build` 重建 frontend image

---

## 這個是什麼

一個 Chrome 擴充功能，可以把你在**健保存摺** (myhealthbank.nhi.gov.tw) 看到的就醫紀錄、用藥、檢驗報告、影像報告，**整理成 FHIR R4 標準格式的健康紀錄檔**。檔案可以：
- 下載到自己電腦（個人病歷備份、單次匯出、轉給其他醫療系統用）
- 或上傳到本機 Docker 後端，配合 Dashboard / SMART App 看資料

PHI 永遠不離開你機器。

---

## 🟢 安裝（純 Extension，最快 2 分鐘）

如果只是要**把健保資料下載成 FHIR 檔**，這條路就夠了，完全不用裝 Docker。

1. 下方下載 `nhi-fhir-bridge-extension-v0.6.1.zip`
2. 解壓到電腦任意位置（例如 `~/nhi-fhir-bridge/`）
3. Chrome 網址列輸入 `chrome://extensions/`
4. 右上角開啟「**開發人員模式**」
5. 左上角點「**載入未封裝項目**」→ 選擇剛解壓的 `dist/` 資料夾
6. **把圖示釘到工具列**（Chrome 預設不會自動釘）：
   點瀏覽器右上角的 🧩（擴充功能拼圖圖示）→ 找到 **NHI-FHIR Bridge** → 點旁邊的 📌 圖釘
7. 工具列就會看到 NHI-FHIR Bridge 圖示： <img src="https://raw.githubusercontent.com/voho0000/NHI-FHIR-BRIDGE/v0.6.1/extension/dist/icons/icon-48.png" width="28" height="28" align="middle" />

---

## 怎麼用

1. 開新分頁登入 https://myhealthbank.nhi.gov.tw/（沒登入的話，extension 會跳按鈕帶你過去）
2. 點 Chrome 工具列上的 NHI-FHIR Bridge 圖示打開小視窗
3. 病人資料卡填：
   - **性別**（必填，會寫進 FHIR Patient 資源，後端 / SMART App 判讀檢驗值參考區間會用到）
   - **出生年份**（建議填真實的，年齡會影響檢驗值判讀區間）
   - 姓名、完整生日可以隨便填假的
   - 身分證字號**不用填**，按下取得時 extension 會自動從健保存摺帶入
4. 按「**🔄 取得健保存摺資料**」— 通常 15–30 秒（看 NHI 速度）
5. 完成後會跳出「**📥 下載健康紀錄檔**」按鈕，按下去檔案就存到下載夾

檔名範例：`nhi-P12345XXXX-20250517-20260517.json`
- `P12345XXXX` ＝ 身分證半遮罩（前 6 碼可見、後 4 碼以 X 取代；避免下載夾被瞄到，檔案內容仍是真實值）
- `20250517-20260517` ＝ 這次抓的健保資料區間（起–訖日）

---

## 隱私說明（重要）

- 你輸入的姓名、生日 → **只存在你自己的瀏覽器**，extension 不會上傳給任何第三方
- 身分證字號 → **顯示時自動半遮罩**（`P12345****`），但檔案內容是真實值（FHIR 規範需要）
- 預設下載的健康紀錄檔**包含真實姓名**（民眾自用情境）
- 如要在多病人診間 / 教學展示用，可以打開「進階設定 → 對外輸出時遮罩病人姓名」，輸出檔的姓名就會變成 `郭O新` 之類遮罩版

---

## 🔵 進階：搭配 Backend + Dashboard

如果要：
- 多次同步累積在本地 FHIR Server
- 用 Dashboard 看多個病人
- 一鍵 launch SMART on FHIR App

那加跑後端（需要 [Docker Desktop](https://docs.docker.com/get-docker/)）：

```sh
git clone https://github.com/voho0000/NHI-FHIR-BRIDGE.git
cd $(basename voho0000/NHI-FHIR-BRIDGE)
docker compose up -d
```

然後 Extension popup 上方切到「**🏥 本機後端 (進階)**」即可。Dashboard 在 http://localhost:3010。

---

詳細說明、架構圖、FAQ 見 [README](https://github.com/voho0000/NHI-FHIR-BRIDGE#readme)。


**Full Changelog**: https://github.com/voho0000/NHI-FHIR-BRIDGE/compare/v0.6.0...v0.6.1

---

## 0.6.0 重點 — 2026-05-18

這版是 extension 的**定位轉折**：從「附帶嵌入 SMART App 面板的開發者友善工具」收斂為「面向一般民眾、進階模式選擇性開啟」的健保資料下載工具。

**重大改動**
- ✂️ **拿掉嵌入式 SMART App 助理面板**：右側 pill + iframe 機制整套移除（-1.8k 行）。原因是 Chrome 的 Private Network Access 會擋 iframe（public origin）→ localhost backend 的 fetch，導致面板永遠卡在「Launching SMART…」。要打開 SMART App 改走 popup 既有的「開啟 SMART App」按鈕在新 tab 開啟（top-level browsing context 可繞 PNA 限制）。
- 🎛 **本機伺服器模式藏進進階設定**：預設只剩「下載到電腦」一條路。99% 民眾用不到 Docker backend，「伺服器」這個詞對非工程使用者來說容易誤解（以為資料會上傳到雲端）。需要 Dashboard / SMART App 的開發者勾選「啟用本機伺服器模式」即可解鎖既有 UI（mode toggle + Backend URL / API Key / SMART App URL 欄位）。
- ✋ **姓名升為必填**：跟 生日 / 性別 一致打紅星。step 2 的三個欄位現在都是真實必填。

**使用體驗修正**
- 🆙 **Step 1 banner 改寫**：以前只一句「請完成登入」，民眾常常在 NHI 分頁看起來「還在登入狀態」（其實 session 已逾時）→ 看到 popup 說沒登入會困惑「明明已經登入了」。新版分兩種情境條列，加一顆「前往登入頁面」按鈕一鍵帶到 NHI 登入畫面（不用懂 F5、不用記登入 URL）。
- 🎯 **Step 3 阻塞 strip 變跳轉按鈕**：CTA 被擋下時的 ⚠️ 警告整列可點，一鍵跳回該補的步驟（不用爬 stepper）。涵蓋「不在 NHI 分頁」、「未登入」、「基本資料未填」、「生日格式錯誤」四種狀況。
- 🆔 **隱藏 auto-XXXXXXXX 內部 ID**：第一次儲存（還沒同步）只顯示姓名；同步完從 NHI 拿到真實 cid 後，顯示半遮罩版本（`P12345****`）。
- 🧹 **Step 1 / Step 2 視覺一致化**：拿掉 🔗 🔒 ✅ 等 emoji；Step 1 三段 banner 改成白底 + 細色條，跟 Step 2 / 3 同調。
- 📛 **「本機後端」→「本機伺服器」** label 改名（降低工程術語感）。
- 🚀 **「開啟 SMART App」按鈕視覺升級**：從蒼白 outline 改為淡藍底 + 粗體字，明確讀作次要動作。

**Bug 修正**
- 🐞 **SMART App launch context patient_id 雜湊不一致**：v0.5.1 修了 popup 但漏修 sidebar，現在 sidebar 整個砍掉，等於問題自動消失（且 popup 那條路本來就是 hash 過的）。
- 🐞 **「開啟 SMART App」按鈕在拿掉身分證輸入框後永遠 disabled**：getPatientOverride() 不再包含 id_no 導致 launch 判斷失效，已改用模組級 cache。

**內部**
- 🧹 manifest.json 移除 content_scripts + web_accessible_resources 兩整塊（只為 sidebar.js 存在）
- 🧹 background.js 移除 syncRunning storage flag、onInstalled 重注入、sidebarEnabled migration key
- 🧹 popup.js 內 `derivePatientId` import 重新啟用（給流程一致化）
- 🧹 backend-ts biome 自動格式化收尾（v0.5.3 mapper 測試補的格式漂移）
- 🧹 死 CSS（`.data-state-card` / `.data-state-row` / `.data-state-value`）刪除
- 🧹 dist 產物從 3 個 bundle 降到 2 個（少了 sidebar.js）

---

## 0.5.4 重點

v0.5.3 的 popup UX 收尾 polish + 一個功能簡化。

**使用體驗修正**
- 🔢 Footer 版本號改為從 manifest 動態讀取（過去寫死在 v0.2.0）
- ⏳ CTA 按下後文字會變「取得中…」，比單純 disabled 更清楚有反應
- 🎨 「開啟健保存摺登入」按鈕回歸全站統一藍（先前是 out-of-palette 的 sky）
- 🔘 停止按鈕邊框加粗、加深，不會在 CTA 旁邊消失
- 🆗 Step 1 「步驟 ② 確認您的資料」變成可點的連結，直接帶進下一步
- 📛 模式「本機後端」改名「本機伺服器」(降低工程術語)

**Step 2 / Step 3 重新整理**
- ✂️ **拿掉身分證字號輸入框** — 取得時會從 NHI 自動帶入，過去 placeholder 已寫「留空 = 取得時自動帶入」。Step 2 現在就是三個真正需要決定的欄位：生日 / 性別 / 姓名
- 📝 姓名提示從兩行壓成一行（"填真名可協助遮罩報告內容；分享或展示時建議勾選遮罩"）
- 🚀 「開啟 SMART App」從蒼白白底改成淡藍底 + 粗體字，明確讀作次要動作（過去太像 disabled）
- 🎨 Step 1 三段 banner（需登入 / 已登入）改成白底 + 細色條，與 Step 2/3 視覺一致；移除 🔗 🔒 ✅ emoji
- 🗑 垃圾桶 tooltip 加註「不會刪除已下載到電腦的檔案」(醫療資料情境降焦慮)
- 🎛 「進階設定」只在 Step 3 + 本機伺服器模式下出現，不再浮在 Step 1/2 底下顯示空摺疊

**Bug 修正**
- 🐞 移除身分證欄位後，「開啟 SMART App」按鈕一度永遠 disabled — `getPatientOverride()` 不再包含 `id_no`，導致 launch 判斷邏輯失效。改用模組級快取從 storage 維持 `id_no`，背景在 sync 時將 placeholder 換成真實 cid 也會經由 `storage.onChanged` 自動更新

**內部**
- 🧹 刪除 dead CSS（`.data-state-card` / `.data-state-row` / `.data-state-value`，已被 `.state-rows` 取代）
- 🧹 popup.js 狀態訊息與 tooltip 引用按鈕標籤的舊 emoji 一併清掉

---

## 0.5.3 重點

這版主要是 popup UI 的大幅整理 + 一些 sync 流程的 bug 修正。

**UI 重新設計**
- 🪜 **3 步驟引導式 popup**：① 登入 → ② 您的資料 → ③ 取得
- 🎨 Step 3 從「動作卡 + 結果卡 + 下載卡 + Launch 卡」整併成**單一面板**，視覺壓力大幅降低
- 🎨 統一主色為藍色 (#2563eb)，綠色只用於成功狀態；SMART App 按鈕改 outline 藍框
- 🎨 Stepper 壓縮成 breadcrumb 形式（高度減半）
- 🪜 取得對象識別卡：step 3 頂端顯示「目前要抓誰」，點一下回 step 2 修改
- 🎨 取得 CTA 完成後自動降級為「重新取得」outline，讓下載按鈕變主動作
- 📋 完成後的明細從 dev jargon 改成中文（就醫 12 筆、處方 88 筆）

**病人資料 (step 2) 重新規劃**
- ⚠️ 必填欄位（生日、性別）放在最上方
- 🏥 姓名旁邊直接放遮罩 toggle + 說明（不再藏在進階設定）
- 💡 解釋填真名的好處：narrative 中的同名字串會自動一併遮罩
- 🆔 身分證移到最後（反正取得時自動帶入）

**Bug 修正**
- 🐞 NHI 沒回任何資料時不再顯示綠 ✅，改成 ⚠️ 警告 + 建議重新登入
- 🐞 Backend 模式 export URL 用 hashed Patient.id，不再永遠拿到空 bundle
- 🐞 Export 回 0 筆時不再覆蓋掉上傳的真實 total
- 🐞 Sync 進行中切回 popup，CTA 保持 disabled（不會被 onChanged 重設）
- 🐞 生日輸入到一半（只年份）會被攔下，不會 NaN 年齡
- 🐞 切換到 patient B 時，A 的下載 bundle / 狀態 / 後端 cache 都會清空
- 🐞 點 🗑 清除按鈕時，status banner 也跟著清掉
- 🐞 NHI 登入預檢：popup 一開就主動偵測 NHI 分頁 session 狀態
- 🐞 Sidebar 「📋 助理」面板 toggle 失效（讀錯 storage area）
- 🐞 Tombstone：sync 完自動清掉 NHI 已刪除的舊資料

**其他**
- 🧪 新增 80 個 mapper unit tests（從 107 → 187 tests）
- 📚 完整重寫 ARCHITECTURE.md（之前還是舊 Python 版內容）
- 🔒 Apache 2.0 license

---

## 0.5.2 重點

- 🐞 **生日驗證**：填到一半（例如只填年份）無法按「確定」或「取得」，避免下游年齡計算出現 NaN
- ✨ **Sidebar 助理 pill 更顯眼**：加大尺寸 + 開頁 3 秒微脈動，讓使用者一眼看到那是可點的按鈕
- 🧪 **Mapper 測試大幅補齊**：新增 80 個 unit test（107 → 187），覆蓋 allergy / procedure / encounter / diagnostic-report / linker / dispatch

---

## 0.5.1 重點（v0.5.0 之後的 polish）

- 🆕 **資料退場**：每次 sync 會自動清掉同 patient/page_type 但本次沒回傳的舊資料 — NHI 後端刪掉的紀錄不會再永留本機
- ✨ **登入預檢**：popup 一開就確認健保存摺分頁有效 session；沒登入會直接跳紅色 banner，不會讓你按完 CTA 才被「🔒 尚未登入」打回票
- ✨ **明細人話化**：完成後的「查看明細」用「就醫 12 筆 · 處方 88 筆 · 檢驗 412 筆」取代 `encounters=12/12`；技術計時收到「技術細節」子摺
- 🐞 **修正 Patient.id 雜湊不一致**：0.5.0 因為兩邊各自 salt 導致「📤 把本地檔案上傳到後端」之後查不到病人，已修
- 🎨 status pill 改名字優先（`陳O新 · P12345****`）、加 keyboard focus-visible 環

---

## 0.5.0 重點

這版是一次比較大的安全 + 隱私強化。

- 🔒 **所有 PHI 端點補上認證**：先前 `/fhir/*` 讀取與部分 `/sync/*` 路由可不需要任何驗證直接拿資料；現在統一強制 `X-Sync-API-Key` 或 SMART Bearer
- 🔒 **Dashboard 不再把 API key 編進前端**：改走 Next.js server proxy 注入；DevTools 看不到 key
- 🔒 **`Patient.id` 改為雜湊形式**：身分證從此不出現在 FHIR `Patient.id`、`subject.reference`、SMART token payload 或任何 URL；真實值只留在 `Patient.identifier[].value`
- 🔒 **設定改存 `chrome.storage.local`**：身分證 + API key 不再隨 Google 帳號同步到所有裝置
- 🔒 後端預設綁 `127.0.0.1`、`/smart/authorize` 拒絕無 launch token 的 standalone 登入、驗 `aud`、CORS 接受清單可由 `ALLOWED_EXTENSION_IDS` 收緊
- 🎨 病人資料卡簡化、模式切換 label 改、CTA 卡住時把原因 inline 顯示、Dashboard 在地化、release notes 大幅改寫

**破壞性變更**（從 0.4.x 升上來請看）：
- Patient.id 變雜湊形式 → 舊 backend DB 資料 orphan，建議 `docker compose down -v` 清掉再重 sync
- `optional_host_permissions` 收緊只允許 localhost；LAN 自架 backend 需自行改 `manifest.json`
- Dashboard PHI 路徑改走 `/api/backend/*` → docker-compose 用戶要 `docker compose up --build` 重建 frontend image

---

## 這個是什麼

一個 Chrome 擴充功能，可以把你在**健保存摺** (myhealthbank.nhi.gov.tw) 看到的就醫紀錄、用藥、檢驗報告、影像報告，**整理成 FHIR R4 標準格式的健康紀錄檔**。檔案可以：
- 下載到自己電腦（個人病歷備份、單次匯出、轉給其他醫療系統用）
- 或上傳到本機 Docker 後端，配合 Dashboard / SMART App 看資料

PHI 永遠不離開你機器。

---

## 🟢 安裝（純 Extension，最快 2 分鐘）

如果只是要**把健保資料下載成 FHIR 檔**，這條路就夠了，完全不用裝 Docker。

1. 下方下載 `nhi-fhir-bridge-extension-v0.6.0.zip`
2. 解壓到電腦任意位置（例如 `~/nhi-fhir-bridge/`）
3. Chrome 網址列輸入 `chrome://extensions/`
4. 右上角開啟「**開發人員模式**」
5. 左上角點「**載入未封裝項目**」→ 選擇剛解壓的 `dist/` 資料夾
6. **把圖示釘到工具列**（Chrome 預設不會自動釘）：
   點瀏覽器右上角的 🧩（擴充功能拼圖圖示）→ 找到 **NHI-FHIR Bridge** → 點旁邊的 📌 圖釘
7. 工具列就會看到 NHI-FHIR Bridge 圖示： <img src="https://raw.githubusercontent.com/voho0000/NHI-FHIR-BRIDGE/v0.6.0/extension/dist/icons/icon-48.png" width="28" height="28" align="middle" />

---

## 怎麼用

1. 開新分頁登入 https://myhealthbank.nhi.gov.tw/（沒登入的話，extension 會跳按鈕帶你過去）
2. 點 Chrome 工具列上的 NHI-FHIR Bridge 圖示打開小視窗
3. 病人資料卡填：
   - **性別**（必填，會寫進 FHIR Patient 資源，後端 / SMART App 判讀檢驗值參考區間會用到）
   - **出生年份**（建議填真實的，年齡會影響檢驗值判讀區間）
   - 姓名、完整生日可以隨便填假的
   - 身分證字號**不用填**，按下取得時 extension 會自動從健保存摺帶入
4. 按「**🔄 取得健保存摺資料**」— 通常 15–30 秒（看 NHI 速度）
5. 完成後會跳出「**📥 下載健康紀錄檔**」按鈕，按下去檔案就存到下載夾

檔名範例：`nhi-P12345XXXX-20250517-20260517.json`
- `P12345XXXX` ＝ 身分證半遮罩（前 6 碼可見、後 4 碼以 X 取代；避免下載夾被瞄到，檔案內容仍是真實值）
- `20250517-20260517` ＝ 這次抓的健保資料區間（起–訖日）

---

## 隱私說明（重要）

- 你輸入的姓名、生日 → **只存在你自己的瀏覽器**，extension 不會上傳給任何第三方
- 身分證字號 → **顯示時自動半遮罩**（`P12345****`），但檔案內容是真實值（FHIR 規範需要）
- 預設下載的健康紀錄檔**包含真實姓名**（民眾自用情境）
- 如要在多病人診間 / 教學展示用，可以打開「進階設定 → 對外輸出時遮罩病人姓名」，輸出檔的姓名就會變成 `郭O新` 之類遮罩版

---

## 🔵 進階：搭配 Backend + Dashboard

如果要：
- 多次同步累積在本地 FHIR Server
- 用 Dashboard 看多個病人
- 一鍵 launch SMART on FHIR App

那加跑後端（需要 [Docker Desktop](https://docs.docker.com/get-docker/)）：

```sh
git clone https://github.com/voho0000/NHI-FHIR-BRIDGE.git
cd $(basename voho0000/NHI-FHIR-BRIDGE)
docker compose up -d
```

然後 Extension popup 上方切到「**🏥 本機後端 (進階)**」即可。Dashboard 在 http://localhost:3010。

---

詳細說明、架構圖、FAQ 見 [README](https://github.com/voho0000/NHI-FHIR-BRIDGE#readme)。


**Full Changelog**: https://github.com/voho0000/NHI-FHIR-BRIDGE/compare/v0.5.4...v0.6.0

---

## 0.5.4 重點 — 2026-05-17

v0.5.3 的 popup UX 收尾 polish + 一個功能簡化。

**使用體驗修正**
- 🔢 Footer 版本號改為從 manifest 動態讀取（過去寫死在 v0.2.0）
- ⏳ CTA 按下後文字會變「取得中…」，比單純 disabled 更清楚有反應
- 🎨 「開啟健保存摺登入」按鈕回歸全站統一藍（先前是 out-of-palette 的 sky）
- 🔘 停止按鈕邊框加粗、加深，不會在 CTA 旁邊消失
- 🆗 Step 1 「步驟 ② 確認您的資料」變成可點的連結，直接帶進下一步
- 📛 模式「本機後端」改名「本機伺服器」(降低工程術語)

**Step 2 / Step 3 重新整理**
- ✂️ **拿掉身分證字號輸入框** — 取得時會從 NHI 自動帶入，過去 placeholder 已寫「留空 = 取得時自動帶入」。Step 2 現在就是三個真正需要決定的欄位：生日 / 性別 / 姓名
- 📝 姓名提示從兩行壓成一行（"填真名可協助遮罩報告內容；分享或展示時建議勾選遮罩"）
- 🚀 「開啟 SMART App」從蒼白白底改成淡藍底 + 粗體字，明確讀作次要動作（過去太像 disabled）
- 🎨 Step 1 三段 banner（需登入 / 已登入）改成白底 + 細色條，與 Step 2/3 視覺一致；移除 🔗 🔒 ✅ emoji
- 🗑 垃圾桶 tooltip 加註「不會刪除已下載到電腦的檔案」(醫療資料情境降焦慮)
- 🎛 「進階設定」只在 Step 3 + 本機伺服器模式下出現，不再浮在 Step 1/2 底下顯示空摺疊

**Bug 修正**
- 🐞 移除身分證欄位後，「開啟 SMART App」按鈕一度永遠 disabled — `getPatientOverride()` 不再包含 `id_no`，導致 launch 判斷邏輯失效。改用模組級快取從 storage 維持 `id_no`，背景在 sync 時將 placeholder 換成真實 cid 也會經由 `storage.onChanged` 自動更新

**內部**
- 🧹 刪除 dead CSS（`.data-state-card` / `.data-state-row` / `.data-state-value`，已被 `.state-rows` 取代）
- 🧹 popup.js 狀態訊息與 tooltip 引用按鈕標籤的舊 emoji 一併清掉

---

## 0.5.3 重點

這版主要是 popup UI 的大幅整理 + 一些 sync 流程的 bug 修正。

**UI 重新設計**
- 🪜 **3 步驟引導式 popup**：① 登入 → ② 您的資料 → ③ 取得
- 🎨 Step 3 從「動作卡 + 結果卡 + 下載卡 + Launch 卡」整併成**單一面板**，視覺壓力大幅降低
- 🎨 統一主色為藍色 (#2563eb)，綠色只用於成功狀態；SMART App 按鈕改 outline 藍框
- 🎨 Stepper 壓縮成 breadcrumb 形式（高度減半）
- 🪜 取得對象識別卡：step 3 頂端顯示「目前要抓誰」，點一下回 step 2 修改
- 🎨 取得 CTA 完成後自動降級為「重新取得」outline，讓下載按鈕變主動作
- 📋 完成後的明細從 dev jargon 改成中文（就醫 12 筆、處方 88 筆）

**病人資料 (step 2) 重新規劃**
- ⚠️ 必填欄位（生日、性別）放在最上方
- 🏥 姓名旁邊直接放遮罩 toggle + 說明（不再藏在進階設定）
- 💡 解釋填真名的好處：narrative 中的同名字串會自動一併遮罩
- 🆔 身分證移到最後（反正取得時自動帶入）

**Bug 修正**
- 🐞 NHI 沒回任何資料時不再顯示綠 ✅，改成 ⚠️ 警告 + 建議重新登入
- 🐞 Backend 模式 export URL 用 hashed Patient.id，不再永遠拿到空 bundle
- 🐞 Export 回 0 筆時不再覆蓋掉上傳的真實 total
- 🐞 Sync 進行中切回 popup，CTA 保持 disabled（不會被 onChanged 重設）
- 🐞 生日輸入到一半（只年份）會被攔下，不會 NaN 年齡
- 🐞 切換到 patient B 時，A 的下載 bundle / 狀態 / 後端 cache 都會清空
- 🐞 點 🗑 清除按鈕時，status banner 也跟著清掉
- 🐞 NHI 登入預檢：popup 一開就主動偵測 NHI 分頁 session 狀態
- 🐞 Sidebar 「📋 助理」面板 toggle 失效（讀錯 storage area）
- 🐞 Tombstone：sync 完自動清掉 NHI 已刪除的舊資料

**其他**
- 🧪 新增 80 個 mapper unit tests（從 107 → 187 tests）
- 📚 完整重寫 ARCHITECTURE.md（之前還是舊 Python 版內容）
- 🔒 Apache 2.0 license

---

## 0.5.2 重點

- 🐞 **生日驗證**：填到一半（例如只填年份）無法按「確定」或「取得」，避免下游年齡計算出現 NaN
- ✨ **Sidebar 助理 pill 更顯眼**：加大尺寸 + 開頁 3 秒微脈動，讓使用者一眼看到那是可點的按鈕
- 🧪 **Mapper 測試大幅補齊**：新增 80 個 unit test（107 → 187），覆蓋 allergy / procedure / encounter / diagnostic-report / linker / dispatch

---

## 0.5.1 重點（v0.5.0 之後的 polish）

- 🆕 **資料退場**：每次 sync 會自動清掉同 patient/page_type 但本次沒回傳的舊資料 — NHI 後端刪掉的紀錄不會再永留本機
- ✨ **登入預檢**：popup 一開就確認健保存摺分頁有效 session；沒登入會直接跳紅色 banner，不會讓你按完 CTA 才被「🔒 尚未登入」打回票
- ✨ **明細人話化**：完成後的「查看明細」用「就醫 12 筆 · 處方 88 筆 · 檢驗 412 筆」取代 `encounters=12/12`；技術計時收到「技術細節」子摺
- 🐞 **修正 Patient.id 雜湊不一致**：0.5.0 因為兩邊各自 salt 導致「📤 把本地檔案上傳到後端」之後查不到病人，已修
- 🎨 status pill 改名字優先（`陳O新 · P12345****`）、加 keyboard focus-visible 環

---

## 0.5.0 重點

這版是一次比較大的安全 + 隱私強化。

- 🔒 **所有 PHI 端點補上認證**：先前 `/fhir/*` 讀取與部分 `/sync/*` 路由可不需要任何驗證直接拿資料；現在統一強制 `X-Sync-API-Key` 或 SMART Bearer
- 🔒 **Dashboard 不再把 API key 編進前端**：改走 Next.js server proxy 注入；DevTools 看不到 key
- 🔒 **`Patient.id` 改為雜湊形式**：身分證從此不出現在 FHIR `Patient.id`、`subject.reference`、SMART token payload 或任何 URL；真實值只留在 `Patient.identifier[].value`
- 🔒 **設定改存 `chrome.storage.local`**：身分證 + API key 不再隨 Google 帳號同步到所有裝置
- 🔒 後端預設綁 `127.0.0.1`、`/smart/authorize` 拒絕無 launch token 的 standalone 登入、驗 `aud`、CORS 接受清單可由 `ALLOWED_EXTENSION_IDS` 收緊
- 🎨 病人資料卡簡化、模式切換 label 改、CTA 卡住時把原因 inline 顯示、Dashboard 在地化、release notes 大幅改寫

**破壞性變更**（從 0.4.x 升上來請看）：
- Patient.id 變雜湊形式 → 舊 backend DB 資料 orphan，建議 `docker compose down -v` 清掉再重 sync
- `optional_host_permissions` 收緊只允許 localhost；LAN 自架 backend 需自行改 `manifest.json`
- Dashboard PHI 路徑改走 `/api/backend/*` → docker-compose 用戶要 `docker compose up --build` 重建 frontend image

---

## 這個是什麼

一個 Chrome 擴充功能，可以把你在**健保存摺** (myhealthbank.nhi.gov.tw) 看到的就醫紀錄、用藥、檢驗報告、影像報告，**整理成 FHIR R4 標準格式的健康紀錄檔**。檔案可以：
- 下載到自己電腦（個人病歷備份、單次匯出、轉給其他醫療系統用）
- 或上傳到本機 Docker 後端，配合 Dashboard / SMART App 看資料

PHI 永遠不離開你機器。

---

## 🟢 安裝（純 Extension，最快 2 分鐘）

如果只是要**把健保資料下載成 FHIR 檔**，這條路就夠了，完全不用裝 Docker。

1. 下方下載 `nhi-fhir-bridge-extension-v0.5.4.zip`
2. 解壓到電腦任意位置（例如 `~/nhi-fhir-bridge/`）
3. Chrome 網址列輸入 `chrome://extensions/`
4. 右上角開啟「**開發人員模式**」
5. 左上角點「**載入未封裝項目**」→ 選擇剛解壓的 `dist/` 資料夾
6. **把圖示釘到工具列**（Chrome 預設不會自動釘）：
   點瀏覽器右上角的 🧩（擴充功能拼圖圖示）→ 找到 **NHI-FHIR Bridge** → 點旁邊的 📌 圖釘
7. 工具列就會看到 NHI-FHIR Bridge 圖示： <img src="https://raw.githubusercontent.com/voho0000/NHI-FHIR-BRIDGE/v0.5.4/extension/dist/icons/icon-48.png" width="28" height="28" align="middle" />

---

## 怎麼用

1. 開新分頁登入 https://myhealthbank.nhi.gov.tw/（沒登入的話，extension 會跳按鈕帶你過去）
2. 點 Chrome 工具列上的 NHI-FHIR Bridge 圖示打開小視窗
3. 病人資料卡填：
   - **性別**（必填，會寫進 FHIR Patient 資源，後端 / SMART App 判讀檢驗值參考區間會用到）
   - **出生年份**（建議填真實的，年齡會影響檢驗值判讀區間）
   - 姓名、完整生日可以隨便填假的
   - 身分證字號**不用填**，按下取得時 extension 會自動從健保存摺帶入
4. 按「**🔄 取得健保存摺資料**」— 通常 15–30 秒（看 NHI 速度）
5. 完成後會跳出「**📥 下載健康紀錄檔**」按鈕，按下去檔案就存到下載夾

檔名範例：`nhi-P12345XXXX-20250517-20260517.json`
- `P12345XXXX` ＝ 身分證半遮罩（前 6 碼可見、後 4 碼以 X 取代；避免下載夾被瞄到，檔案內容仍是真實值）
- `20250517-20260517` ＝ 這次抓的健保資料區間（起–訖日）

---

## 隱私說明（重要）

- 你輸入的姓名、生日 → **只存在你自己的瀏覽器**，extension 不會上傳給任何第三方
- 身分證字號 → **顯示時自動半遮罩**（`P12345****`），但檔案內容是真實值（FHIR 規範需要）
- 預設下載的健康紀錄檔**包含真實姓名**（民眾自用情境）
- 如要在多病人診間 / 教學展示用，可以打開「進階設定 → 對外輸出時遮罩病人姓名」，輸出檔的姓名就會變成 `郭O新` 之類遮罩版

---

## 🔵 進階：搭配 Backend + Dashboard

如果要：
- 多次同步累積在本地 FHIR Server
- 用 Dashboard 看多個病人
- 一鍵 launch SMART on FHIR App

那加跑後端（需要 [Docker Desktop](https://docs.docker.com/get-docker/)）：

```sh
git clone https://github.com/voho0000/NHI-FHIR-BRIDGE.git
cd $(basename voho0000/NHI-FHIR-BRIDGE)
docker compose up -d
```

然後 Extension popup 上方切到「**🏥 本機後端 (進階)**」即可。Dashboard 在 http://localhost:3010。

---

詳細說明、架構圖、FAQ 見 [README](https://github.com/voho0000/NHI-FHIR-BRIDGE#readme)。


**Full Changelog**: https://github.com/voho0000/NHI-FHIR-BRIDGE/compare/v0.5.3...v0.5.4

---

## 0.5.3 重點 — 2026-05-17

這版主要是 popup UI 的大幅整理 + 一些 sync 流程的 bug 修正。

**UI 重新設計**
- 🪜 **3 步驟引導式 popup**：① 登入 → ② 您的資料 → ③ 取得
- 🎨 Step 3 從「動作卡 + 結果卡 + 下載卡 + Launch 卡」整併成**單一面板**，視覺壓力大幅降低
- 🎨 統一主色為藍色 (#2563eb)，綠色只用於成功狀態；SMART App 按鈕改 outline 藍框
- 🎨 Stepper 壓縮成 breadcrumb 形式（高度減半）
- 🪜 取得對象識別卡：step 3 頂端顯示「目前要抓誰」，點一下回 step 2 修改
- 🎨 取得 CTA 完成後自動降級為「重新取得」outline，讓下載按鈕變主動作
- 📋 完成後的明細從 dev jargon 改成中文（就醫 12 筆、處方 88 筆）

**病人資料 (step 2) 重新規劃**
- ⚠️ 必填欄位（生日、性別）放在最上方
- 🏥 姓名旁邊直接放遮罩 toggle + 說明（不再藏在進階設定）
- 💡 解釋填真名的好處：narrative 中的同名字串會自動一併遮罩
- 🆔 身分證移到最後（反正取得時自動帶入）

**Bug 修正**
- 🐞 NHI 沒回任何資料時不再顯示綠 ✅，改成 ⚠️ 警告 + 建議重新登入
- 🐞 Backend 模式 export URL 用 hashed Patient.id，不再永遠拿到空 bundle
- 🐞 Export 回 0 筆時不再覆蓋掉上傳的真實 total
- 🐞 Sync 進行中切回 popup，CTA 保持 disabled（不會被 onChanged 重設）
- 🐞 生日輸入到一半（只年份）會被攔下，不會 NaN 年齡
- 🐞 切換到 patient B 時，A 的下載 bundle / 狀態 / 後端 cache 都會清空
- 🐞 點 🗑 清除按鈕時，status banner 也跟著清掉
- 🐞 NHI 登入預檢：popup 一開就主動偵測 NHI 分頁 session 狀態
- 🐞 Sidebar 「📋 助理」面板 toggle 失效（讀錯 storage area）
- 🐞 Tombstone：sync 完自動清掉 NHI 已刪除的舊資料

**其他**
- 🧪 新增 80 個 mapper unit tests（從 107 → 187 tests）
- 📚 完整重寫 ARCHITECTURE.md（之前還是舊 Python 版內容）
- 🔒 Apache 2.0 license

---

## 0.5.2 重點

- 🐞 **生日驗證**：填到一半（例如只填年份）無法按「確定」或「取得」，避免下游年齡計算出現 NaN
- ✨ **Sidebar 助理 pill 更顯眼**：加大尺寸 + 開頁 3 秒微脈動，讓使用者一眼看到那是可點的按鈕
- 🧪 **Mapper 測試大幅補齊**：新增 80 個 unit test（107 → 187），覆蓋 allergy / procedure / encounter / diagnostic-report / linker / dispatch

---

## 0.5.1 重點（v0.5.0 之後的 polish）

- 🆕 **資料退場**：每次 sync 會自動清掉同 patient/page_type 但本次沒回傳的舊資料 — NHI 後端刪掉的紀錄不會再永留本機
- ✨ **登入預檢**：popup 一開就確認健保存摺分頁有效 session；沒登入會直接跳紅色 banner，不會讓你按完 CTA 才被「🔒 尚未登入」打回票
- ✨ **明細人話化**：完成後的「查看明細」用「就醫 12 筆 · 處方 88 筆 · 檢驗 412 筆」取代 `encounters=12/12`；技術計時收到「技術細節」子摺
- 🐞 **修正 Patient.id 雜湊不一致**：0.5.0 因為兩邊各自 salt 導致「📤 把本地檔案上傳到後端」之後查不到病人，已修
- 🎨 status pill 改名字優先（`陳O新 · P12345****`）、加 keyboard focus-visible 環

---

## 0.5.0 重點

這版是一次比較大的安全 + 隱私強化。

- 🔒 **所有 PHI 端點補上認證**：先前 `/fhir/*` 讀取與部分 `/sync/*` 路由可不需要任何驗證直接拿資料；現在統一強制 `X-Sync-API-Key` 或 SMART Bearer
- 🔒 **Dashboard 不再把 API key 編進前端**：改走 Next.js server proxy 注入；DevTools 看不到 key
- 🔒 **`Patient.id` 改為雜湊形式**：身分證從此不出現在 FHIR `Patient.id`、`subject.reference`、SMART token payload 或任何 URL；真實值只留在 `Patient.identifier[].value`
- 🔒 **設定改存 `chrome.storage.local`**：身分證 + API key 不再隨 Google 帳號同步到所有裝置
- 🔒 後端預設綁 `127.0.0.1`、`/smart/authorize` 拒絕無 launch token 的 standalone 登入、驗 `aud`、CORS 接受清單可由 `ALLOWED_EXTENSION_IDS` 收緊
- 🎨 病人資料卡簡化、模式切換 label 改、CTA 卡住時把原因 inline 顯示、Dashboard 在地化、release notes 大幅改寫

**破壞性變更**（從 0.4.x 升上來請看）：
- Patient.id 變雜湊形式 → 舊 backend DB 資料 orphan，建議 `docker compose down -v` 清掉再重 sync
- `optional_host_permissions` 收緊只允許 localhost；LAN 自架 backend 需自行改 `manifest.json`
- Dashboard PHI 路徑改走 `/api/backend/*` → docker-compose 用戶要 `docker compose up --build` 重建 frontend image

---

## 這個是什麼

一個 Chrome 擴充功能，可以把你在**健保存摺** (myhealthbank.nhi.gov.tw) 看到的就醫紀錄、用藥、檢驗報告、影像報告，**整理成 FHIR R4 標準格式的健康紀錄檔**。檔案可以：
- 下載到自己電腦（個人病歷備份、單次匯出、轉給其他醫療系統用）
- 或上傳到本機 Docker 後端，配合 Dashboard / SMART App 看資料

PHI 永遠不離開你機器。

---

## 🟢 安裝（純 Extension，最快 2 分鐘）

如果只是要**把健保資料下載成 FHIR 檔**，這條路就夠了，完全不用裝 Docker。

1. 下方下載 `nhi-fhir-bridge-extension-v0.5.3.zip`
2. 解壓到電腦任意位置（例如 `~/nhi-fhir-bridge/`）
3. Chrome 網址列輸入 `chrome://extensions/`
4. 右上角開啟「**開發人員模式**」
5. 左上角點「**載入未封裝項目**」→ 選擇剛解壓的 `dist/` 資料夾
6. **把圖示釘到工具列**（Chrome 預設不會自動釘）：
   點瀏覽器右上角的 🧩（擴充功能拼圖圖示）→ 找到 **NHI-FHIR Bridge** → 點旁邊的 📌 圖釘
7. 工具列就會看到 NHI-FHIR Bridge 圖示： <img src="https://raw.githubusercontent.com/voho0000/NHI-FHIR-BRIDGE/v0.5.3/extension/dist/icons/icon-48.png" width="28" height="28" align="middle" />

---

## 怎麼用

1. 開新分頁登入 https://myhealthbank.nhi.gov.tw/（沒登入的話，extension 會跳按鈕帶你過去）
2. 點 Chrome 工具列上的 NHI-FHIR Bridge 圖示打開小視窗
3. 病人資料卡填：
   - **性別**（必填，會寫進 FHIR Patient 資源，後端 / SMART App 判讀檢驗值參考區間會用到）
   - **出生年份**（建議填真實的，年齡會影響檢驗值判讀區間）
   - 姓名、完整生日可以隨便填假的
   - 身分證字號**不用填**，按下取得時 extension 會自動從健保存摺帶入
4. 按「**🔄 取得健保存摺資料**」— 通常 15–30 秒（看 NHI 速度）
5. 完成後會跳出「**📥 下載健康紀錄檔**」按鈕，按下去檔案就存到下載夾

檔名範例：`nhi-P12345XXXX-20250517-20260517.json`
- `P12345XXXX` ＝ 身分證半遮罩（前 6 碼可見、後 4 碼以 X 取代；避免下載夾被瞄到，檔案內容仍是真實值）
- `20250517-20260517` ＝ 這次抓的健保資料區間（起–訖日）

---

## 隱私說明（重要）

- 你輸入的姓名、生日 → **只存在你自己的瀏覽器**，extension 不會上傳給任何第三方
- 身分證字號 → **顯示時自動半遮罩**（`P12345****`），但檔案內容是真實值（FHIR 規範需要）
- 預設下載的健康紀錄檔**包含真實姓名**（民眾自用情境）
- 如要在多病人診間 / 教學展示用，可以打開「進階設定 → 對外輸出時遮罩病人姓名」，輸出檔的姓名就會變成 `郭O新` 之類遮罩版

---

## 🔵 進階：搭配 Backend + Dashboard

如果要：
- 多次同步累積在本地 FHIR Server
- 用 Dashboard 看多個病人
- 一鍵 launch SMART on FHIR App

那加跑後端（需要 [Docker Desktop](https://docs.docker.com/get-docker/)）：

```sh
git clone https://github.com/voho0000/NHI-FHIR-BRIDGE.git
cd $(basename voho0000/NHI-FHIR-BRIDGE)
docker compose up -d
```

然後 Extension popup 上方切到「**🏥 本機後端 (進階)**」即可。Dashboard 在 http://localhost:3010。

---

詳細說明、架構圖、FAQ 見 [README](https://github.com/voho0000/NHI-FHIR-BRIDGE#readme)。


**Full Changelog**: https://github.com/voho0000/NHI-FHIR-BRIDGE/compare/v0.5.2...v0.5.3

---

## 0.5.2 重點 — 2026-05-17

- 🐞 **生日驗證**：填到一半（例如只填年份）無法按「確定」或「取得」，避免下游年齡計算出現 NaN
- ✨ **Sidebar 助理 pill 更顯眼**：加大尺寸 + 開頁 3 秒微脈動，讓使用者一眼看到那是可點的按鈕
- 🧪 **Mapper 測試大幅補齊**：新增 80 個 unit test（107 → 187），覆蓋 allergy / procedure / encounter / diagnostic-report / linker / dispatch

---

## 0.5.1 重點（v0.5.0 之後的 polish）

- 🆕 **資料退場**：每次 sync 會自動清掉同 patient/page_type 但本次沒回傳的舊資料 — NHI 後端刪掉的紀錄不會再永留本機
- ✨ **登入預檢**：popup 一開就確認健保存摺分頁有效 session；沒登入會直接跳紅色 banner，不會讓你按完 CTA 才被「🔒 尚未登入」打回票
- ✨ **明細人話化**：完成後的「查看明細」用「就醫 12 筆 · 處方 88 筆 · 檢驗 412 筆」取代 `encounters=12/12`；技術計時收到「技術細節」子摺
- 🐞 **修正 Patient.id 雜湊不一致**：0.5.0 因為兩邊各自 salt 導致「📤 把本地檔案上傳到後端」之後查不到病人，已修
- 🎨 status pill 改名字優先（`陳O新 · P12345****`）、加 keyboard focus-visible 環

---

## 0.5.0 重點

這版是一次比較大的安全 + 隱私強化。

- 🔒 **所有 PHI 端點補上認證**：先前 `/fhir/*` 讀取與部分 `/sync/*` 路由可不需要任何驗證直接拿資料；現在統一強制 `X-Sync-API-Key` 或 SMART Bearer
- 🔒 **Dashboard 不再把 API key 編進前端**：改走 Next.js server proxy 注入；DevTools 看不到 key
- 🔒 **`Patient.id` 改為雜湊形式**：身分證從此不出現在 FHIR `Patient.id`、`subject.reference`、SMART token payload 或任何 URL；真實值只留在 `Patient.identifier[].value`
- 🔒 **設定改存 `chrome.storage.local`**：身分證 + API key 不再隨 Google 帳號同步到所有裝置
- 🔒 後端預設綁 `127.0.0.1`、`/smart/authorize` 拒絕無 launch token 的 standalone 登入、驗 `aud`、CORS 接受清單可由 `ALLOWED_EXTENSION_IDS` 收緊
- 🎨 病人資料卡簡化、模式切換 label 改、CTA 卡住時把原因 inline 顯示、Dashboard 在地化、release notes 大幅改寫

**破壞性變更**（從 0.4.x 升上來請看）：
- Patient.id 變雜湊形式 → 舊 backend DB 資料 orphan，建議 `docker compose down -v` 清掉再重 sync
- `optional_host_permissions` 收緊只允許 localhost；LAN 自架 backend 需自行改 `manifest.json`
- Dashboard PHI 路徑改走 `/api/backend/*` → docker-compose 用戶要 `docker compose up --build` 重建 frontend image

---

## 這個是什麼

一個 Chrome 擴充功能，可以把你在**健保存摺** (myhealthbank.nhi.gov.tw) 看到的就醫紀錄、用藥、檢驗報告、影像報告，**整理成 FHIR R4 標準格式的健康紀錄檔**。檔案可以：
- 下載到自己電腦（個人病歷備份、單次匯出、轉給其他醫療系統用）
- 或上傳到本機 Docker 後端，配合 Dashboard / SMART App 看資料

PHI 永遠不離開你機器。

---

## 🟢 安裝（純 Extension，最快 2 分鐘）

如果只是要**把健保資料下載成 FHIR 檔**，這條路就夠了，完全不用裝 Docker。

1. 下方下載 `nhi-fhir-bridge-extension-v0.5.2.zip`
2. 解壓到電腦任意位置（例如 `~/nhi-fhir-bridge/`）
3. Chrome 網址列輸入 `chrome://extensions/`
4. 右上角開啟「**開發人員模式**」
5. 左上角點「**載入未封裝項目**」→ 選擇剛解壓的 `dist/` 資料夾
6. **把圖示釘到工具列**（Chrome 預設不會自動釘）：
   點瀏覽器右上角的 🧩（擴充功能拼圖圖示）→ 找到 **NHI-FHIR Bridge** → 點旁邊的 📌 圖釘
7. 工具列就會看到 NHI-FHIR Bridge 圖示： <img src="https://raw.githubusercontent.com/voho0000/NHI-FHIR-BRIDGE/v0.5.2/extension/dist/icons/icon-48.png" width="28" height="28" align="middle" />

---

## 怎麼用

1. 開新分頁登入 https://myhealthbank.nhi.gov.tw/（沒登入的話，extension 會跳按鈕帶你過去）
2. 點 Chrome 工具列上的 NHI-FHIR Bridge 圖示打開小視窗
3. 病人資料卡填：
   - **性別**（必填，會寫進 FHIR Patient 資源，後端 / SMART App 判讀檢驗值參考區間會用到）
   - **出生年份**（建議填真實的，年齡會影響檢驗值判讀區間）
   - 姓名、完整生日可以隨便填假的
   - 身分證字號**不用填**，按下取得時 extension 會自動從健保存摺帶入
4. 按「**🔄 取得健保存摺資料**」— 通常 15–30 秒（看 NHI 速度）
5. 完成後會跳出「**📥 下載健康紀錄檔**」按鈕，按下去檔案就存到下載夾

檔名範例：`nhi-P12345XXXX-20250517-20260517.json`
- `P12345XXXX` ＝ 身分證半遮罩（前 6 碼可見、後 4 碼以 X 取代；避免下載夾被瞄到，檔案內容仍是真實值）
- `20250517-20260517` ＝ 這次抓的健保資料區間（起–訖日）

---

## 隱私說明（重要）

- 你輸入的姓名、生日 → **只存在你自己的瀏覽器**，extension 不會上傳給任何第三方
- 身分證字號 → **顯示時自動半遮罩**（`P12345****`），但檔案內容是真實值（FHIR 規範需要）
- 預設下載的健康紀錄檔**包含真實姓名**（民眾自用情境）
- 如要在多病人診間 / 教學展示用，可以打開「進階設定 → 對外輸出時遮罩病人姓名」，輸出檔的姓名就會變成 `郭O新` 之類遮罩版

---

## 🔵 進階：搭配 Backend + Dashboard

如果要：
- 多次同步累積在本地 FHIR Server
- 用 Dashboard 看多個病人
- 一鍵 launch SMART on FHIR App

那加跑後端（需要 [Docker Desktop](https://docs.docker.com/get-docker/)）：

```sh
git clone https://github.com/voho0000/NHI-FHIR-BRIDGE.git
cd $(basename voho0000/NHI-FHIR-BRIDGE)
docker compose up -d
```

然後 Extension popup 上方切到「**🏥 本機後端 (進階)**」即可。Dashboard 在 http://localhost:3010。

---

詳細說明、架構圖、FAQ 見 [README](https://github.com/voho0000/NHI-FHIR-BRIDGE#readme)。


**Full Changelog**: https://github.com/voho0000/NHI-FHIR-BRIDGE/compare/v0.5.1...v0.5.2

---

## 0.5.1 重點（v0.5.0 之後的 polish） — 2026-05-17

- 🆕 **資料退場**：每次 sync 會自動清掉同 patient/page_type 但本次沒回傳的舊資料 — NHI 後端刪掉的紀錄不會再永留本機
- ✨ **登入預檢**：popup 一開就確認健保存摺分頁有效 session；沒登入會直接跳紅色 banner，不會讓你按完 CTA 才被「🔒 尚未登入」打回票
- ✨ **明細人話化**：完成後的「查看明細」用「就醫 12 筆 · 處方 88 筆 · 檢驗 412 筆」取代 `encounters=12/12`；技術計時收到「技術細節」子摺
- 🐞 **修正 Patient.id 雜湊不一致**：0.5.0 因為兩邊各自 salt 導致「📤 把本地檔案上傳到後端」之後查不到病人，已修
- 🎨 status pill 改名字優先（`陳O新 · P12345****`）、加 keyboard focus-visible 環

---

## 0.5.0 重點

這版是一次比較大的安全 + 隱私強化。

- 🔒 **所有 PHI 端點補上認證**：先前 `/fhir/*` 讀取與部分 `/sync/*` 路由可不需要任何驗證直接拿資料；現在統一強制 `X-Sync-API-Key` 或 SMART Bearer
- 🔒 **Dashboard 不再把 API key 編進前端**：改走 Next.js server proxy 注入；DevTools 看不到 key
- 🔒 **`Patient.id` 改為雜湊形式**：身分證從此不出現在 FHIR `Patient.id`、`subject.reference`、SMART token payload 或任何 URL；真實值只留在 `Patient.identifier[].value`
- 🔒 **設定改存 `chrome.storage.local`**：身分證 + API key 不再隨 Google 帳號同步到所有裝置
- 🔒 後端預設綁 `127.0.0.1`、`/smart/authorize` 拒絕無 launch token 的 standalone 登入、驗 `aud`、CORS 接受清單可由 `ALLOWED_EXTENSION_IDS` 收緊
- 🎨 病人資料卡簡化、模式切換 label 改、CTA 卡住時把原因 inline 顯示、Dashboard 在地化、release notes 大幅改寫

**破壞性變更**（從 0.4.x 升上來請看）：
- Patient.id 變雜湊形式 → 舊 backend DB 資料 orphan，建議 `docker compose down -v` 清掉再重 sync
- `optional_host_permissions` 收緊只允許 localhost；LAN 自架 backend 需自行改 `manifest.json`
- Dashboard PHI 路徑改走 `/api/backend/*` → docker-compose 用戶要 `docker compose up --build` 重建 frontend image

---

## 這個是什麼

一個 Chrome 擴充功能，可以把你在**健保存摺** (myhealthbank.nhi.gov.tw) 看到的就醫紀錄、用藥、檢驗報告、影像報告，**整理成 FHIR R4 標準格式的健康紀錄檔**。檔案可以：
- 下載到自己電腦（個人病歷備份、單次匯出、轉給其他醫療系統用）
- 或上傳到本機 Docker 後端，配合 Dashboard / SMART App 看資料

PHI 永遠不離開你機器。

---

## 🟢 安裝（純 Extension，最快 2 分鐘）

如果只是要**把健保資料下載成 FHIR 檔**，這條路就夠了，完全不用裝 Docker。

1. 下方下載 `nhi-fhir-bridge-extension-v0.5.1.zip`
2. 解壓到電腦任意位置（例如 `~/nhi-fhir-bridge/`）
3. Chrome 網址列輸入 `chrome://extensions/`
4. 右上角開啟「**開發人員模式**」
5. 左上角點「**載入未封裝項目**」→ 選擇剛解壓的 `dist/` 資料夾
6. **把圖示釘到工具列**（Chrome 預設不會自動釘）：
   點瀏覽器右上角的 🧩（擴充功能拼圖圖示）→ 找到 **NHI-FHIR Bridge** → 點旁邊的 📌 圖釘
7. 工具列就會看到 NHI-FHIR Bridge 圖示： <img src="https://raw.githubusercontent.com/voho0000/NHI-FHIR-BRIDGE/v0.5.1/extension/dist/icons/icon-48.png" width="28" height="28" align="middle" />

---

## 怎麼用

1. 開新分頁登入 https://myhealthbank.nhi.gov.tw/（沒登入的話，extension 會跳按鈕帶你過去）
2. 點 Chrome 工具列上的 NHI-FHIR Bridge 圖示打開小視窗
3. 病人資料卡填：
   - **性別**（必填，會寫進 FHIR Patient 資源，後端 / SMART App 判讀檢驗值參考區間會用到）
   - **出生年份**（建議填真實的，年齡會影響檢驗值判讀區間）
   - 姓名、完整生日可以隨便填假的
   - 身分證字號**不用填**，按下取得時 extension 會自動從健保存摺帶入
4. 按「**🔄 取得健保存摺資料**」— 通常 15–30 秒（看 NHI 速度）
5. 完成後會跳出「**📥 下載健康紀錄檔**」按鈕，按下去檔案就存到下載夾

檔名範例：`nhi-P12345XXXX-20250517-20260517.json`
- `P12345XXXX` ＝ 身分證半遮罩（前 6 碼可見、後 4 碼以 X 取代；避免下載夾被瞄到，檔案內容仍是真實值）
- `20250517-20260517` ＝ 這次抓的健保資料區間（起–訖日）

---

## 隱私說明（重要）

- 你輸入的姓名、生日 → **只存在你自己的瀏覽器**，extension 不會上傳給任何第三方
- 身分證字號 → **顯示時自動半遮罩**（`P12345****`），但檔案內容是真實值（FHIR 規範需要）
- 預設下載的健康紀錄檔**包含真實姓名**（民眾自用情境）
- 如要在多病人診間 / 教學展示用，可以打開「進階設定 → 對外輸出時遮罩病人姓名」，輸出檔的姓名就會變成 `郭O新` 之類遮罩版

---

## 🔵 進階：搭配 Backend + Dashboard

如果要：
- 多次同步累積在本地 FHIR Server
- 用 Dashboard 看多個病人
- 一鍵 launch SMART on FHIR App

那加跑後端（需要 [Docker Desktop](https://docs.docker.com/get-docker/)）：

```sh
git clone https://github.com/voho0000/NHI-FHIR-BRIDGE.git
cd $(basename voho0000/NHI-FHIR-BRIDGE)
docker compose up -d
```

然後 Extension popup 上方切到「**🏥 本機後端 (進階)**」即可。Dashboard 在 http://localhost:3010。

---

詳細說明、架構圖、FAQ 見 [README](https://github.com/voho0000/NHI-FHIR-BRIDGE#readme)。


**Full Changelog**: https://github.com/voho0000/NHI-FHIR-BRIDGE/compare/v0.5.0...v0.5.1

---

## 0.5.0 重點 — 2026-05-17

這版是一次比較大的安全 + 隱私強化。

- 🔒 **所有 PHI 端點補上認證**：先前 `/fhir/*` 讀取與部分 `/sync/*` 路由可不需要任何驗證直接拿資料；現在統一強制 `X-Sync-API-Key` 或 SMART Bearer
- 🔒 **Dashboard 不再把 API key 編進前端**：改走 Next.js server proxy 注入；DevTools 看不到 key
- 🔒 **`Patient.id` 改為雜湊形式**：身分證從此不出現在 FHIR `Patient.id`、`subject.reference`、SMART token payload 或任何 URL；真實值只留在 `Patient.identifier[].value`
- 🔒 **設定改存 `chrome.storage.local`**：身分證 + API key 不再隨 Google 帳號同步到所有裝置
- 🔒 後端預設綁 `127.0.0.1`、`/smart/authorize` 拒絕無 launch token 的 standalone 登入、驗 `aud`、CORS 接受清單可由 `ALLOWED_EXTENSION_IDS` 收緊
- 🎨 病人資料卡簡化、模式切換 label 改、CTA 卡住時把原因 inline 顯示、Dashboard 在地化、release notes 大幅改寫

**破壞性變更**（從 0.4.x 升上來請看）：
- Patient.id 變雜湊形式 → 舊 backend DB 資料 orphan，建議 `docker compose down -v` 清掉再重 sync
- `optional_host_permissions` 收緊只允許 localhost；LAN 自架 backend 需自行改 `manifest.json`
- Dashboard PHI 路徑改走 `/api/backend/*` → docker-compose 用戶要 `docker compose up --build` 重建 frontend image

---

## 這個是什麼

一個 Chrome 擴充功能，可以把你在**健保存摺** (myhealthbank.nhi.gov.tw) 看到的就醫紀錄、用藥、檢驗報告、影像報告，**整理成 FHIR R4 標準格式的健康紀錄檔**。檔案可以：
- 下載到自己電腦（個人病歷備份、單次匯出、轉給其他醫療系統用）
- 或上傳到本機 Docker 後端，配合 Dashboard / SMART App 看資料

PHI 永遠不離開你機器。

---

## 🟢 安裝（純 Extension，最快 2 分鐘）

如果只是要**把健保資料下載成 FHIR 檔**，這條路就夠了，完全不用裝 Docker。

1. 下方下載 `nhi-fhir-bridge-extension-v0.5.0.zip`
2. 解壓到電腦任意位置（例如 `~/nhi-fhir-bridge/`）
3. Chrome 網址列輸入 `chrome://extensions/`
4. 右上角開啟「**開發人員模式**」
5. 左上角點「**載入未封裝項目**」→ 選擇剛解壓的 `dist/` 資料夾
6. **把圖示釘到工具列**（Chrome 預設不會自動釘）：
   點瀏覽器右上角的 🧩（擴充功能拼圖圖示）→ 找到 **NHI-FHIR Bridge** → 點旁邊的 📌 圖釘
7. 工具列就會看到 NHI-FHIR Bridge 圖示： <img src="https://raw.githubusercontent.com/voho0000/NHI-FHIR-BRIDGE/v0.5.0/extension/dist/icons/icon-48.png" width="28" height="28" align="middle" />

---

## 怎麼用

1. 開新分頁登入 https://myhealthbank.nhi.gov.tw/（沒登入的話，extension 會跳按鈕帶你過去）
2. 點 Chrome 工具列上的 NHI-FHIR Bridge 圖示打開小視窗
3. 病人資料卡填：
   - **性別**（必填，會寫進 FHIR Patient 資源，後端 / SMART App 判讀檢驗值參考區間會用到）
   - **出生年份**（建議填真實的，年齡會影響檢驗值判讀區間）
   - 姓名、完整生日可以隨便填假的
   - 身分證字號**不用填**，按下取得時 extension 會自動從健保存摺帶入
4. 按「**🔄 取得健保存摺資料**」— 通常 15–30 秒（看 NHI 速度）
5. 完成後會跳出「**📥 下載健康紀錄檔**」按鈕，按下去檔案就存到下載夾

檔名範例：`nhi-P12345XXXX-20250517-20260517.json`
- `P12345XXXX` ＝ 身分證半遮罩（前 6 碼可見、後 4 碼以 X 取代；避免下載夾被瞄到，檔案內容仍是真實值）
- `20250517-20260517` ＝ 這次抓的健保資料區間（起–訖日）

---

## 隱私說明（重要）

- 你輸入的姓名、生日 → **只存在你自己的瀏覽器**，extension 不會上傳給任何第三方
- 身分證字號 → **顯示時自動半遮罩**（`P12345****`），但檔案內容是真實值（FHIR 規範需要）
- 預設下載的健康紀錄檔**包含真實姓名**（民眾自用情境）
- 如要在多病人診間 / 教學展示用，可以打開「進階設定 → 對外輸出時遮罩病人姓名」，輸出檔的姓名就會變成 `郭O新` 之類遮罩版

---

## 🔵 進階：搭配 Backend + Dashboard

如果要：
- 多次同步累積在本地 FHIR Server
- 用 Dashboard 看多個病人
- 一鍵 launch SMART on FHIR App

那加跑後端（需要 [Docker Desktop](https://docs.docker.com/get-docker/)）：

```sh
git clone https://github.com/voho0000/NHI-FHIR-BRIDGE.git
cd $(basename voho0000/NHI-FHIR-BRIDGE)
docker compose up -d
```

然後 Extension popup 上方切到「**🏥 本機後端 (進階)**」即可。Dashboard 在 http://localhost:3010。

---

詳細說明、架構圖、FAQ 見 [README](https://github.com/voho0000/NHI-FHIR-BRIDGE#readme)。


**Full Changelog**: https://github.com/voho0000/NHI-FHIR-BRIDGE/compare/v0.4.1...v0.5.0

---

## 這個是什麼

一個 Chrome 擴充功能，可以把你在**健保存摺** (myhealthbank.nhi.gov.tw) 看到的就醫紀錄、用藥、檢驗報告、影像報告，**整理成 FHIR R4 標準格式的健康紀錄檔**。檔案可以：
- 下載到自己電腦（供臨床研究、AI 判讀、轉給其他醫療系統用）
- 或上傳到本機 Docker 後端，配合 Dashboard / SMART App 看資料

---

## 🟢 安裝（純 Extension，最快 2 分鐘）

如果只是要**把健保資料下載成 FHIR 檔**，這條路就夠了，完全不用裝 Docker。

1. 下方下載 `nhi-fhir-bridge-extension-v0.4.1.zip`
2. 解壓到電腦任意位置（例如 `~/nhi-fhir-bridge/`）
3. Chrome 網址列輸入 `chrome://extensions/`
4. 右上角開啟「**開發人員模式**」
5. 左上角點「**載入未封裝項目**」→ 選擇剛解壓的 `dist/` 資料夾
6. **把圖示釘到工具列**（Chrome 預設不會自動釘）：
   點瀏覽器右上角的 🧩（擴充功能拼圖圖示）→ 找到 **NHI-FHIR Bridge** → 點旁邊的 📌 圖釘
7. 工具列就會看到 NHI-FHIR Bridge 圖示： <img src="https://raw.githubusercontent.com/voho0000/NHI-FHIR-BRIDGE/v0.4.1/extension/dist/icons/icon-48.png" width="28" height="28" align="middle" />

---

## 怎麼用

1. 開新分頁登入 https://myhealthbank.nhi.gov.tw/（沒登入的話，extension 會跳按鈕帶你過去）
2. 點 Chrome 工具列上的 NHI-FHIR Bridge 圖示打開小視窗
3. 病人資料卡填：
   - **性別**（必填，會寫進 FHIR Patient 資源，後端 / SMART App 判讀檢驗值參考區間會用到）
   - **出生年份**（建議填真實的，年齡會影響檢驗值判讀區間）
   - 姓名、完整生日可以隨便填假的
   - 身分證字號**不用填**，按下取得時 extension 會自動從健保存摺帶入
4. 按「**🔄 取得健保存摺資料**」— 通常 15–30 秒（看 NHI 速度）
5. 完成後會跳出「**📥 下載健康紀錄檔**」按鈕，按下去檔案就存到下載夾

檔名範例：`nhi-P12345XXXX-20250517-20260517.json`
- `P12345****` ＝ 身分證後 4 碼半遮罩（避免下載夾被瞄到）
- `20250517-20260517` ＝ 這次抓的健保資料區間（起–訖日）

---

## 隱私說明（重要）

- 你輸入的姓名、生日 → **只存在你自己的瀏覽器**，extension 不會上傳給任何第三方
- 身分證字號 → **顯示時自動半遮罩**（`P12345****`），但檔案內容是真實值（FHIR 規範需要）
- 預設下載的健康紀錄檔**包含真實姓名**（民眾自用情境）
- 如要在多病人診間 / 教學展示用，可以打開「進階設定 → 對外輸出時遮罩病人姓名」，輸出檔的姓名就會變成 `郭O新` 之類遮罩版

---

## 🔵 進階：搭配 Backend + Dashboard

如果要：
- 多次同步累積在本地 FHIR Server
- 用 Dashboard 看多個病人
- 一鍵 launch SMART on FHIR App

那加跑後端（需要 [Docker Desktop](https://docs.docker.com/get-docker/)）：

```sh
git clone https://github.com/voho0000/NHI-FHIR-BRIDGE.git
cd $(basename voho0000/NHI-FHIR-BRIDGE)
docker compose up -d
```

然後 Extension popup 上方切到「**☁️ 上傳後端**」即可。Dashboard 在 http://localhost:3010。

---

詳細說明、架構圖、FAQ 見 [README](https://github.com/voho0000/NHI-FHIR-BRIDGE#readme)。


**Full Changelog**: https://github.com/voho0000/NHI-FHIR-BRIDGE/compare/v0.4.0...v0.4.1

---

## 這個是什麼

一個 Chrome 擴充功能，可以把你在**健保存摺** (myhealthbank.nhi.gov.tw) 看到的就醫紀錄、用藥、檢驗報告、影像報告，**整理成 FHIR R4 標準格式的健康紀錄檔**。檔案可以：
- 下載到自己電腦（供臨床研究、AI 判讀、轉給其他醫療系統用）
- 或上傳到本機 Docker 後端，配合 Dashboard / SMART App 看資料

---

## 🟢 安裝（純 Extension，最快 2 分鐘）

如果只是要**把健保資料下載成 FHIR 檔**，這條路就夠了，完全不用裝 Docker。

1. 下方下載 `nhi-fhir-bridge-extension-v0.4.0.zip`
2. 解壓到電腦任意位置（例如 `~/nhi-fhir-bridge/`）
3. Chrome 網址列輸入 `chrome://extensions/`
4. 右上角開啟「**開發人員模式**」
5. 左上角點「**載入未封裝項目**」→ 選擇剛解壓的 `dist/` 資料夾
6. **把圖示釘到工具列**（Chrome 預設不會自動釘）：
   點瀏覽器右上角的 🧩（擴充功能拼圖圖示）→ 找到 **NHI-FHIR Bridge** → 點旁邊的 📌 圖釘
7. 工具列就會看到 NHI-FHIR Bridge 圖示： <img src="https://raw.githubusercontent.com/voho0000/NHI-FHIR-BRIDGE/v0.4.0/extension/dist/icons/icon-48.png" width="28" height="28" align="middle" />

---

## 怎麼用

1. 開新分頁登入 https://myhealthbank.nhi.gov.tw/（若沒登入，extension 會帶按鈕提示你開）
2. 點 Chrome 工具列上的 NHI-FHIR Bridge 圖示
3. 病人資料卡填**姓名 + 出生年份**（性別、完整生日可選；身分證字號會自動從健保存摺帶入）
4. 按「**🔄 取得健保存摺資料**」— 通常 15–30 秒，看 NHI 那邊速度
5. 跑完後出現「**📥 下載健康紀錄檔**」按鈕，按下去檔案就到你的下載夾

檔名格式：`nhi-P12345XXXX-20260517-1430.json`（身分證後 4 碼半遮罩防止外洩）

---

## 隱私說明（重要）

- 你輸入的姓名、生日 → **只存在你自己的瀏覽器**，extension 不會上傳給任何第三方
- 身分證字號 → **顯示時自動半遮罩**（`P12345****`），但檔案內容是真實值（FHIR 規範需要）
- 預設下載的健康紀錄檔**包含真實姓名**（民眾自用情境）
- 如要在多病人診間 / 教學展示用，可以打開「進階設定 → 對外輸出時遮罩病人姓名」，輸出檔的姓名就會變成 `郭O新` 之類遮罩版

---

## 🔵 進階：搭配 Backend + Dashboard

如果要：
- 多次同步累積在本地 FHIR Server
- 用 Dashboard 看多個病人
- 一鍵 launch SMART on FHIR App

那加跑後端（需要 [Docker Desktop](https://docs.docker.com/get-docker/)）：

```sh
git clone https://github.com/voho0000/NHI-FHIR-BRIDGE.git
cd $(basename voho0000/NHI-FHIR-BRIDGE)
docker compose up -d
```

然後 Extension popup 上方切到「**☁️ 上傳後端**」即可。Dashboard 在 http://localhost:3010。

---

詳細說明、架構圖、FAQ 見 [README](https://github.com/voho0000/NHI-FHIR-BRIDGE#readme)。


**Full Changelog**: https://github.com/voho0000/NHI-FHIR-BRIDGE/compare/v0.3.0...v0.4.0

---

## 🚀 快速開始

### 🟢 純 Extension（本地模式，不需後端）

1. 在下方下載 `nhi-fhir-bridge-extension-v0.3.0.zip`。
2. 解壓到任意位置（例如 `~/nhi-fhir-bridge/`）。
3. Chrome 網址列輸入 `chrome://extensions/` → 右上角開啟「**開發人員模式**」→ 左上角點「**載入未封裝項目**」→ 選擇剛解壓出來的 **`dist/` 資料夾**。
4. 開健康存摺登入 → 點工具列 🏥 圖示 → 填身分證字號 → 按「**📥 同步健保存摺資料**」→ 跑完後按「**📥 下載 FHIR Bundle**」把檔案存到電腦。

### 🔵 Extension + Backend（含 Dashboard / SMART App）

需要 [Docker Desktop](https://docs.docker.com/get-docker/)。

```sh
git clone https://github.com/voho0000/NHI-FHIR-BRIDGE.git
cd NHI-FHIR-BRIDGE
docker compose up -d
```

然後 Extension popup 上方「輸出方式」切到「**上傳後端**」即可。
Dashboard 在 http://localhost:3010 ，可以多病人瀏覽 + 一鍵 launch SMART app。

詳細說明見 [README](https://github.com/voho0000/NHI-FHIR-BRIDGE#readme)。

**Full Changelog**: https://github.com/voho0000/NHI-FHIR-BRIDGE/compare/v0.2.0...v0.3.0

---

## Quick start

**Extension only (本地模式, 不需後端):**
1. Download `nhi-fhir-bridge-extension-v0.2.0.zip` below.
2. Unzip somewhere (e.g. `~/nhi-fhir-bridge/`).
3. Chrome → `chrome://extensions/` → enable Developer mode → **Load unpacked** → select the unzipped `dist/` folder.
4. Open NHI 健康存摺, fill in patient ID, click 「📥 同步健保存摺資料」. A FHIR JSON file downloads to your machine.

**With dashboard + SMART app (後端模式):**
```sh
git clone https://github.com/voho0000/NHI-FHIR-BRIDGE.git
cd $(basename voho0000/NHI-FHIR-BRIDGE)
docker compose up -d
```
Then in the extension popup, switch to 「上傳後端」mode.


**Full Changelog**: https://github.com/voho0000/NHI-FHIR-BRIDGE/commits/v0.2.0

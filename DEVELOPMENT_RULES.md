# Development Rules / 開發規範

NHI-FHIR Bridge 把台灣健保署「健康存摺」的資料轉成 HL7 FHIR R4。因為處理的是
真實民眾的健康資料、且輸出可能被其他 SMART app 消費，本專案有幾條**不可妥協**的
工程規範。送 PR 前請通讀本文件;與 [CONTRIBUTING.md](CONTRIBUTING.md) 並行。

---

## 1. 測試資料：禁止真實身分證

- **committed 檔案中禁止 checksum-valid 的台灣身分證。**
- 測試假資料一律用 **checksum 故意無效**的合成碼（如 `F223456789`、
  `P123456789`、`B223456789`）。唯一允許的 checksum-valid 例外是眾所周知的
  規格書範例 `A123456789`（列在 guard 的 allowlist）。
- CI gate：[`scripts/check-no-real-twid.mjs`](scripts/check-no-real-twid.mjs)
  （在 `backend-ts.yml` 第一個 step）掃描所有 git-tracked 檔案，比對
  `[A-Z][12]\d{8}` 且通過官方 checksum 即 fail。
- 文件／註解／fixtures 引用病人案例時，用通用占位符（如「probe patient」、
  `王小明`）。fixtures 不可用真實擷取原樣 commit：日期逐檔平移、小型院所／藥局／
  電話改合成值、標明 sanitized。
- 要可展示的資料，用 [`demo/synthetic-fhir-bundle.json`](demo/synthetic-fhir-bundle.json)
  （見 [`docs/DEMO_SYNTHETIC_BUNDLE.md`](docs/DEMO_SYNTHETIC_BUNDLE.md)）。

---

## 2. Faithful transport（忠實搬運）

- **病人數值／日期／醫院／單位：絕不修改。** 不能亂加健康存摺上沒有的 data，
  也不能亂改。
- **LOINC 對應修正：允許**（須經第 4 節的查證）。
- **`code.text` 標籤正規化：允許**（FHIR R4 `CodeableConcept.text` 是 free-form）。
- **過濾非病人列：允許且必要**（QC 控制值、檢體品質旗標如溶血／脂血／icterus、
  純敘述／備註列 —— 這些在 FHIR R4 下本就不該被 model 成 Observation）。

不能「明明 UI 顯示一筆、你抓了兩筆」，也不能憑自己的臨床判斷亂刪資料（見第 7 節）。

---

## 3. FHIR R4 compliance —— 每次改 mapper 都要對照

任何對 mapper／observation pipeline／coding 欄位／resource 建構的改動，commit 前
都要對照 FHIR R4 spec 自我稽核：

1. **`Coding.display` 必須遵循該 code system 的規則。**
   - LOINC：用 loinc.org 的 canonical **Long Common Name**。
   - NHI 醫令碼系統：用 **NHI 目錄正式名稱原文**（含全形／半形選擇），不得正規化、
     改寫或替換。
2. **`CodeableConcept.text` 是 free-form**，bridge 可自由 override／正規化（乾淨臨床
   標籤、全形→半形、panel 名 fallback 等）。
3. **`Resource.id` 語法限制**：`[A-Za-z0-9\-\.]{1,64}`；`stableId` 雜湊輸入是 bridge
   的自由，只要內容不變時跨 rerun 穩定即可。
4. **`Observation` 只給病人量測值**：QC 控制、檢體品質旗標、敘述列都要在
   `filterLabRows` 丟掉，不可變成共用宿主 LOINC 的病人 Observation。
5. **panel-default LOINC 在 Observation 輸出要被抑制**：當 panel 子項顯示名對不到
   任何 analyte key，內部 grouping 仍可用 panel LOINC（`cleanMatch=false`），但
   `isPanelDefaultFallback()` 會把它從 emit 的 `Observation.code.coding` 拿掉，避免
   把 panel code 誤掛在單一 analyte 上。panel LOINC 仍掛在 `DiagnosticReport.code`
   （DR 本身就是 panel，正確）。

---

## 4. 新增 LOINC 對應 → 先 WebFetch loinc.org 查證

- 確認 Component / Property / System / Method 符合預期的 NHI 計費情境，把發現寫成
  inline code comment。
- 同時補 `LOINC_DISPLAY`（Long Common Name）；若會出現在 DR 標題／`code.text`
  override，也補 `LOINC_SHORT_TEXT`。
- **負面也要查證**：在「因為沒有合適 LOINC 而留空」之前，必須先 WebFetch 搜尋
  loinc.org 該 Component 確認真的沒有。多軸選擇：Scale（Qn count vs Ord）+ System
  （Urine vs Urine sed）+ Method 要對到實際結果型態，也要跟同 panel 其他 analyte
  既有的編碼方式一致。

---

## 5. NHI 醫令碼是 dual-source signal —— 不可只信一邊

> 只靠 name 會有錯誤，只靠 NHI 碼會有錯誤 —— 要同時看兩個。

- **NHI 醫令碼 → 提供 panel context**（碼屬哪個家族：06=尿液、08=血液、09=生化；
  單項碼的 LOINC default 走 `NHI_TO_LOINC`；檢體 default 走
  `NHI_CODE_PREFIX_SPECIMEN`）。
- **Display → 提供 analyte specificity + override**（子項路由走 `PANEL_LOINC_MAP`；
  當 LIS 出的 display 與 NHI 目錄 default 牴觸時 override，如「肌酸酐(尿液)」掛在
  血液 default 碼下）。
- **Cross-reference 順序**：明確 display marker／panel-key alias → 其他檢體規則 →
  NHI 碼 default → display／order_name regex fallback。
- **下游任何 cross-reference 邏輯都要 reuse 同一個 routing function**
  （`findLoincDetailed`），不可各自維護平行 alias 表 —— 平行表一定會 drift。

### 先確認 NHI 碼的「碼義 / 單項 vs panel」

新增或修改 `NHI_TO_LOINC`／`DISPLAY_FIRST_CODES`／`PANEL_LOINC_MAP` 前，先確認該
billing code 實際計費的是**單一 analyte 還是多項 panel**：

1. 先讀 `order_NAME`。出現「一般檢查／常規／分類計數／包括…等／panel／profile」
   等字眼 → 不是單一 analyte，給它單一 LOINC 是錯的。
2. 對照 NHI 支付標準／web search 確認 scope。
3. panel code 必須在 `DISPLAY_FIRST_CODES` 且有 `PANEL_LOINC_MAP` 子項表；它的
   `NHI_TO_LOINC` 只能是 **panel-level** LOINC 當 best-effort fallback
   （保持 `cleanMatch=false`，讓 mis-tag canary 仍可見）。

---

## 6. Silent-bug CI gate practice

Silent bug 的特徵：FHIR validator 不抓、runtime 不報錯，只有人工對 bundle 才看得到
（例如 specimen mis-tag、LOINC routing 錯、Qn 值配到 Ord LOINC）。對每一個這類
invariant：

- 列出 **(input, expected output) 表**（如 (NHI 碼, display) → 期望 specimen）。
- 對每列跑 bridge，assert 輸出符合期望;失敗訊息**聚合**成一則（一次 CI run 看到
  所有違反，而非一個個 fail/pass）。
- 每發現一個新的 silent-bug case 就**往表裡加一列**（表單調遞增）。

範例見 `backend-ts/tests/unit/bundle-quality.test.ts` 的 CI invariant 區塊。

---

## 7. 多讀數保留 + 針對性 dedup

bundle 是給一般 SMART app 消費的，**dedup 責任不能丟給 consumer**。bridge 對每個
**邏輯量測**只產一個 Observation。

- **必須 dedup 的**：NHI 多通道結構性重複（A+B 同量測對）。同一邏輯量測 NHI 會經
  通道 A（不定期上傳）與通道 B（定期上傳）各送一列;當 (醫令碼, 日期, 醫院, 值,
  單位) 全同且剛好 1 個 A + 1 個 B → 保留 A、丟 B（`dedupNhiCrossChannelPairs()`）。
  保留的 Observation 用 `meta.tag` 標來源通道（informational，不再作為進一步 dedup
  訊號）。
- **禁止的 dedup**：依 bridge 自己的臨床判斷刪資料 —— 例如 same-source 同值列
  （ICU 連抽是真的）、「結構上不可能」的值、或只因 placeholder 單位編碼不同就合併。
- **允許的例外**：LOINC 對應修正（重新路由到正確 LOINC，無資料遺失）、檢體品質旗標
  過濾、`Quantity.unit` 的 placeholder 清理（發生在 dedup 之後，不影響筆數）。

`stableId` 包含 `value` + `unit` + `nhi_source_channel`，讓不同讀數不會 collapse。

---

## 8. 去識別化 Patient.id 派生

de-identify toggle 開啟時，`Patient.id` 必須由**半遮後** ID 派生
（`effectiveFhirPatientId(idNo, deidentify)`，mapper 單一真相來源）—— 因 TWID 空間
僅 ~3×10⁸，無鹽 SHA-1(全碼) 可秒級暴力還原。本機 bundle、backend 上傳、popup 查詢、
SMART launch 四條路徑走同一派生;新增跨路徑 patient-key 邏輯時不可另起爐灶。

---

## 9. Release 需明確同意

**沒有使用者明確同意就不能 release。** 即使是小修也一樣。流程：

1. 顯示 preview / diff 摘要（UI 變更附截圖或 live demo）。
2. 取得明確 OK。
3. 才 commit + push + tag（tag 觸發 `release.yml` 自動打包）。

commit message 遵循 Conventional Commits。push 後請確認**所有** CI job 綠燈
（`release.yml` + `backend-ts.yml` 的 test/frontend job + pages），不要只看一個。

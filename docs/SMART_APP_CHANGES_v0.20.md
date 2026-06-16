# SMART App 對接變更 — v0.19 → v0.20.7

對接 NHI-FHIR-Bridge 的 SMART app 開發者請看這份。涵蓋 v0.19.0 ~ v0.20.7 之間**消費端看得到**的 FHIR 變更(承接 [SMART_APP_CHANGES_v0.18.14.md](SMART_APP_CHANGES_v0.18.14.md))。完整逐版說明見 [CHANGELOG.md](../CHANGELOG.md)。

`Bundle.meta.tag`(system `https://github.com/voho0000/NHI-FHIR-BRIDGE/bridge-version`)帶產生的 bridge 版本,可據此判斷是否吃得到以下變更。

---

## 1. 就醫關聯重構(v0.20.0–0.20.4)—— 用藥/檢驗現在會指到正確的就醫

**這是這批最大的對接變更。** 以「分組顯示就醫」「依就醫展開用藥/檢驗」的 app 會看到新的關聯與新的 Encounter。

### 1a. 入院當天的門診/急診就醫不再被刪
- 舊版有個 `dedupAdmissionDayAmb`,會把「入院當天、同院」的門診/急診 Encounter 當成住院的重複而刪掉。**已移除**。
- 原因:那筆其實是「病人就醫 → 被醫師收住院」的**源頭就醫**(常與住院不同診斷),不是重複。
- **影響**:同一個住院日現在可能同時有「門診/急診(AMB/EMER)」+「住院(IMP)」兩筆 Encounter。這是正確的(與健康存摺 UI 一致)。

### 1b. 急診分類(EMER)
- 就醫型別常被 NHI 報成「西醫」即使實為急診。現在會看處置碼(急診檢傷分類診察費)把它正確分類為 `class=EMER`。

### 1c. 用藥 → 就醫:用 NHI 申報型別精準掛載(不靠診斷)
- 每筆 `MedicationRequest` 依 NHI 申報的就醫型別(住院/門診/急診)掛到對應 `class` 的 Encounter。
- **為何不用診斷**:同一天的門診與住院可以是同一個診斷碼(因肺炎就醫 → 因肺炎收住院),診斷分不開。
- **注意**:NHI 用藥端沒有「急診」型別 —— 急診看診開的藥被標為「門診」。所以門診型別的藥可掛到同日的門診(AMB)**或**急診(EMER)gateway;住院藥掛住院(IMP)。
- 模糊時保守留空(不亂掛)。

### 1d. 檢驗 → 就醫:用採檢日
- `Observation` 以採檢日(`effectiveDateTime` = `reaL_INSPECT_DATE`)掛到就醫精確日 / 住院區間。入院當天的 workup 掛源頭門診/急診,住院後續日掛住院。

**App 端建議**:用 `resource.encounter.reference` 分組;入院當天若同時出現 AMB/EMER + IMP,屬正常。

---

## 2. 住院手術現在會擷取成 Procedure(v0.20.5–0.20.7)

先前 Procedure 只來自手術清單(IHKE3301S05),**漏掉住院期間做的手術**(那些記在住院明細 IHKE3309S02 的 `op_CODE` / `opcode_data`)。現在補上:

- 住院手術 → `Procedure`,coding 為 **ICD-10-PCS**(`system = http://hl7.org/fhir/sid/icd-10-pcs`)。
- **沒有 NHI 醫令碼**:住院明細只有 ICD-10-PCS,所以這些 Procedure 的 `code.coding` 只有一個 PCS coding(不像手術清單來源那筆同時有 NHI 醫令碼 + PCS)。
- **沒有 reasonCode**:住院明細只有「住院主診斷」(為何住院,例如 J18.9 肺炎),那不是「為何做這台手術」。掛上去會誤導,所以住院手術**不帶 reasonCode**。完整住院診斷在所連的住院 `Encounter.reasonCode` 上。
- **掛到住院 Encounter**:`Procedure.encounter` 指向該次住院(IMP)。
- **主/次處置以 `Procedure.partOf` 串接** ↓

### 2a. 主/次處置分組(`Procedure.partOf`)
- 同一場手術的**次處置**(NHI 住院明細的 `opcode_data`,NHI 自己標「次處置1/2/3」)的 `partOf` 指向**主處置**(`op_CODE`)的 Procedure。
- 主處置沒有 `partOf`(它是主)。沒有次處置的手術是 standalone(無 children)。
- **App 端**:對每個沒有 `partOf` 的 Procedure 當主,收集 `partOf` 指向它的當子,做可展開分組。不要再用「同天+同就醫」猜分組(不可靠 —— 同日可能有兩件不相關處置)。
- 去重:同一台刀若同時出現在手術清單(NHI 醫令+PCS)與住院明細(只 PCS),保留資訊較完整的手術清單那筆;次處置的 `partOf` 會自動改指到保留的那筆(不會懸空)。

---

## 3. 檢驗判讀用 NHI 異常旗標校正(v0.20.6)

- `Observation.interpretation` 先前只從參考範圍自己算 H/L/正常。某些檢驗的範圍是**文字描述**(例如 eGFR 的 CKD 分期「`[N:≧60,s3:30~59,…]`」),硬算會**算錯** —— eGFR 32/33(第 3 期腎病)被標成「正常(N)」。
- 現在讀 NHI 自帶的異常旗標(`assaY_MARK`)校正:bridge 算出的 H/L/A 等具方向性判讀保留(較細),只有 bridge 算成「正常」或算不出時才由 NHI 旗標決定(1→異常 A、0→正常 N),絕不把已判的異常降級。
- **影響**:`Observation.interpretation` 更可靠;腎功能等「範圍非數值」的檢驗不再「明明異常卻顯示正常」。

---

## 4. 去重相關(v0.19.1, v0.20.1)

- **住院同藥不同診斷/數量不再被誤併**(v0.19.1):去重鍵納入數量 + 診斷碼,兩筆不同醫令各自保留。
- **凝血 PT 的 A/B 去重**(v0.20.1):NHI B 管道把 PT 的中文寫成「凝血**脢**原時間」(脢 是 酶 的異體字),先前路由不到 LOINC 5902-2 而沒跟 A 管道的「P.T」併;已修,A+B 正常併成一筆。

---

## 不變的東西(對接合約穩定)
- 既有的 `Encounter.type`(kind + channel 雙維度,`coding.system` 規範)契約不變 —— 見 [SMART_APP_INTEGRATION_v0.9.2.md](SMART_APP_INTEGRATION_v0.9.2.md)。
- LOINC / NHI 醫令碼 / `code.text` 的「display follows the system」原則不變。
- 忠實搬運原則不變(不改病人數值/日期/院所/單位)。

# SMART on FHIR 對接變更通知 — v0.18.9（2026-06-13）

對接方：MediPrisma（醫析）及其他消費本 bridge bundle 的 SMART on FHIR App。

本版新增兩類**先前不存在或無法判讀**的資料。皆向後相容（新增欄位/資源，不更動既有結構），但若你的 App 想呈現這些資料，需要讀取下列欄位。

> ### ⚠️ 最低 bundle 版本：**0.18.9**
> 請以 **0.18.9（含）以後**的 bundle 測試。版本可從 `Bundle.meta.tag` 讀取：`{system:".../bridge-version", code:"0.18.9"}`。
> 演進（避免你用到舊 bundle 困惑）：
> - **0.18.7**：癌症篩檢開始擷取（先前抓錯端點、完全沒有）。
> - **0.18.8**：補上 `source-program` `meta.tag`（0.18.7 因分組路徑瑕疵漏掉）。
> - **0.18.9**：癌症篩檢**中英雙語化** —— 篩檢名稱英文 `display`、結果改 `valueCodeableConcept`（雙語）+ interpretation 旗標。**本通知描述的是 0.18.9 形狀。**

---

## 1. 🆕 癌症篩檢結果（先前完全沒有 → 現在是 Observation）

### 背景
v0.18.7 之前，bridge 因為抓錯 NHI 端點（只抓到分類選單頁），**癌症篩檢一筆都沒有匯入**。現在 7 種篩檢都會擷取：大腸癌、口腔癌、乳癌、子宮頸癌、肺癌、婦女 HPV、胃幽門桿菌（HPSA）。

### FHIR 形狀（v0.18.9 中英雙語）
每一筆篩檢紀錄 → 一個 **`Observation`**。實際範例（大腸癌「無異常」）：

```json
{
  "resourceType": "Observation",
  "status": "final",
  "meta": {
    "tag": [
      { "system": "http://nhi-fhir-bridge/source-program", "code": "cancer-screening" }
    ]
  },
  "category": [{
    "coding": [{
      "system": "http://terminology.hl7.org/CodeSystem/observation-category",
      "code": "laboratory", "display": "Laboratory"
    }]
  }],
  "code": {
    "coding": [{
      "system": "https://nhi-fhir-bridge.github.io/CodeSystem/cancer-screening",
      "code": "大腸癌篩檢",
      "display": "Colorectal Cancer Screening (FOBT)"
    }],
    "text": "大腸癌篩檢"
  },
  "subject": { "reference": "Patient/<hashed-id>" },
  "effectiveDateTime": "2023-04-20T00:00:00+08:00",
  "performer": [{ "display": "新北市聯醫" }],
  "valueCodeableConcept": {
    "coding": [{
      "system": "https://nhi-fhir-bridge.github.io/CodeSystem/cancer-screening-result",
      "code": "無異常",
      "display": "No abnormality detected"
    }],
    "text": "無異常"
  },
  "interpretation": [{
    "coding": [{
      "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
      "code": "N", "display": "Normal"
    }]
  }]
}
```

> 乳攝 BI-RADS／抹片等**自由文字敘述**改放 `note[0].text`（中文原樣，**不翻譯**），不再折進結果。

### 對接重點（請你的 App 這樣處理）

| 欄位 | 內容 | 說明 |
|---|---|---|
| **如何辨識這是癌篩** | `meta.tag` 內有 `{system:".../source-program", code:"cancer-screening"}` | **唯一可靠的篩選依據。** 把癌篩 Observation 歸到「癌症篩檢」區塊。 |
| **是哪一種癌篩（中/英）** | `code.coding[0].display`（**英文**）＋ `code.text`（**中文**） | 英文版顯示 display、中文版顯示 text。`code.coding[0].code` 是中文 key（7 種其一）。 |
| **結果（中/英）** | `valueCodeableConcept.coding[0].display`（**英文**）＋ `.text`（**中文**） | 常見結果有雙語；**查無對照的少見結果**會改用 `valueString`（中文原樣），App 請 fallback 顯示之。 |
| **正常/異常旗標** | `interpretation.coding[0].code` | `N`＝正常、`A`＝異常、`POS`＝陽性、`NEG`＝陰性。**語言中性**，做紅/綠標示用這個，不用 parse 文字。 |
| **詳細報告（自由文字）** | `note[0].text` | 乳攝 BI-RADS／抹片碼等，**中文原樣**（部分 NHI 本來就英文）。當「原始報告」區塊顯示。 |
| **日期 / 院所** | `effectiveDateTime` / `performer[0].display` | 篩檢日（含 `+08:00`）／院所名 |

### 需注意的 caveats

1. **結果有兩種形態**：常見結果 → `valueCodeableConcept`（雙語）；少見/未對照結果 → `valueString`（中文原樣）。**App 請兩者都處理**（先看 valueCodeableConcept，沒有再看 valueString）。bridge **絕不臆測翻譯** —— 沒把握的就給原文。
2. **code / result 的 `system` 是 bridge 本地碼系統**（`.../CodeSystem/cancer-screening`、`.../cancer-screening-result`），**不是 LOINC**。癌篩 LOINC（FOBT 2335-8、Pap 47527-7…）列為後續（依專案規則需逐一 WebFetch 驗證）。請用 display/text 顯示，不要假設有 LOINC。
3. **不適用的篩檢類型不會出現**（例：男性不會有子宮頸／乳癌／HPV）—— 屬正常。
4. **同一癌別可能有多筆**（不同年度），各自獨立 Observation、各有 `effectiveDateTime`。
5. **`note` 是原始中文敘述,不翻譯** —— 醫療敘述機器翻譯有誤譯風險,且本 bridge 承諾 PHI 不出本機(不接翻譯 API)。英文版 App 可標示為「原始報告（中文）」。

---

## 2. 🆕 成人健檢「正常／異常」判讀 → 現在有標準 interpretation 代碼

### 背景
成人預防保健（成人健檢）的異常項目，NHI 原始資料是中文字串（`正常`／`異常，建議：請洽詢醫師`）。v0.18.7 之前 bridge 只把它放進 `interpretation.text`，**App 無法程式化判斷正常與否**。現在會額外帶上 FHIR 標準 interpretation 代碼。

### FHIR 形狀
以一筆異常的成人健檢檢驗（如 eGFR、Creatinine）為例：

```json
{
  "resourceType": "Observation",
  "meta": {
    "tag": [
      { "system": "http://nhi-fhir-bridge/source-program", "code": "adult-preventive" }
    ]
  },
  "interpretation": [{
    "coding": [{
      "system": "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
      "code": "A", "display": "Abnormal"
    }],
    "text": "異常，建議：請洽詢醫師"
  }]
}
```

### 對接重點

| 情境 | `interpretation.coding[0].code` | 來源 NHI 文字（保留在 `interpretation.text`） |
|---|---|---|
| 異常 | `A`（Abnormal） | `異常，建議：請洽詢醫師` |
| 正常 | `N`（Normal） | `正常` |

- **system** = `http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation`（FHIR 標準）。
- 原始中文建議文字仍保留在 `interpretation.text`，可直接顯示給病人。
- 這項變更適用於所有帶中文 `正常/異常` 判讀的 Observation（主要是 `source_program = adult-preventive` 的成人健檢項目）。**先前若你 fallback 讀 `interpretation.text`，仍可運作；現在多了 `.coding` 可做紅/綠標示。**

---

## 3. ℹ️ 用藥「用法／頻次」—— 確認 NHI 不提供（非缺陷）

經 2026-06-13 對健保存摺實際 API 逐欄位查核：NHI 的處方藥品明細端點（IHKE3306S02）**不提供結構化用法／頻次／劑量**（回傳欄位只有藥品代碼、藥名、給藥日數、數量、藥理分類）。因此 `MedicationRequest.dosageInstruction` 維持空白屬正常，**並非 bridge 漏抓**。若貴 App 有顯示用法的需求，此資料源頭即無。

---

## 摘要：你的 App 要動的地方

1. **新增「癌症篩檢」區塊**：以 `meta.tag` 的 `source-program = cancer-screening` 篩出 Observation；癌別用 `code.coding[0].display`（英）/`code.text`（中）；結果用 `valueCodeableConcept`（雙語，沒有再 fallback `valueString`）；正常/異常標示用 `interpretation.coding[0].code`；自由文字看 `note[0].text`；`effectiveDateTime` 排序。
2. **成人健檢標紅**（選用）：讀 `interpretation.coding[0].code`（`A`/`N`）做視覺標示，文字仍用 `interpretation.text`。
3. 兩者都向後相容，不接也不會壞 —— 既有欄位皆未更動。

有任何 shape 上的疑問或想要某個癌別的真實樣本，跟我們說。

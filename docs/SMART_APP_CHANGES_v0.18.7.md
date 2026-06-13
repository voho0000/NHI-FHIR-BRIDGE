# SMART on FHIR 對接變更通知 — v0.18.7（2026-06-13）

對接方：MediPrisma（醫析）及其他消費本 bridge bundle 的 SMART on FHIR App。

本版新增兩類**先前不存在或無法判讀**的資料。皆向後相容（新增欄位/資源，不更動既有結構），但若你的 App 想呈現這些資料，需要讀取下列欄位。

---

## 1. 🆕 癌症篩檢結果（先前完全沒有 → 現在是 Observation）

### 背景
v0.18.7 之前，bridge 因為抓錯 NHI 端點（只抓到分類選單頁），**癌症篩檢一筆都沒有匯入**。現在 7 種篩檢都會擷取：大腸癌、口腔癌、乳癌、子宮頸癌、肺癌、婦女 HPV、胃幽門桿菌（HPSA）。

### FHIR 形狀
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
      "system": "https://nhi-fhir-bridge.local/CodeSystem/his-local-lab",
      "code": "大腸癌篩檢", "display": "大腸癌篩檢"
    }],
    "text": "大腸癌篩檢"
  },
  "subject": { "reference": "Patient/<hashed-id>" },
  "effectiveDateTime": "2023-04-20T00:00:00+08:00",
  "performer": [{ "display": "新北市聯醫" }],
  "valueString": "無異常"
}
```

### 對接重點（請你的 App 這樣處理）

| 欄位 | 內容 | 說明 |
|---|---|---|
| **如何辨識這是癌篩** | `meta.tag` 內有 `{system:"http://nhi-fhir-bridge/source-program", code:"cancer-screening"}` | **這是唯一可靠的篩選依據。** 用它把癌篩 Observation 從一般檢驗中分出來、歸到「癌症篩檢」區塊。 |
| **是哪一種癌篩** | `code.text`（也＝`code.coding[0].code`/`display`） | 值為 7 種其中之一：`大腸癌篩檢`／`口腔癌篩檢`／`乳癌篩檢`／`子宮頸癌篩檢`／`肺癌篩檢`／`婦女HPV檢測`／`胃幽門桿菌篩檢` |
| **結果** | **`valueString`**（注意：**不是** valueQuantity） | 質性結果，例：`無異常`、`異常`。乳攝 BI-RADS／抹片細胞病理碼會折進括號，例：`無異常（良性發現；建議每年定期檢查）` |
| **日期** | `effectiveDateTime` | 篩檢日（含 `+08:00`） |
| **院所** | `performer[0].display` | 篩檢院所名稱 |
| **分類** | `category = laboratory` | 與一般檢驗同類；務必用上面的 `meta.tag` 再細分 |

### 需注意的 caveats

1. **`code.coding[0].system` 是 bridge 的本地碼系統** `https://nhi-fhir-bridge.local/CodeSystem/his-local-lab`，**不是 LOINC**。目前癌篩 code 沒有 LOINC（依專案規則，加 LOINC 需逐一 WebFetch 驗證，列為後續）。請以 `code.text` 顯示，**不要假設有 LOINC**。
2. **結果是 `valueString`，不要嘗試 parse 成數值。** 請用字串顯示，或自行判斷「無異常 vs 異常」做 UI 標示。
3. **不適用的篩檢類型不會出現**（例：男性不會有子宮頸／乳癌／HPV）。NHI 對「無紀錄」回空陣列、bridge 直接略過，bundle 裡就不會有那筆 —— 屬正常。
4. **同一癌別可能有多筆**（不同年度的篩檢），各自獨立 Observation、各有 `effectiveDateTime`。

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

1. **新增「癌症篩檢」區塊**：以 `meta.tag` 的 `source-program = cancer-screening` 篩出 Observation，用 `code.text` 分癌別、`valueString` 顯示結果、`effectiveDateTime` 排序。
2. **成人健檢標紅**（選用）：讀 `interpretation.coding[0].code`（`A`/`N`）做視覺標示，文字仍用 `interpretation.text`。
3. 兩者都向後相容，不接也不會壞 —— 既有欄位皆未更動。

有任何 shape 上的疑問或想要某個癌別的真實樣本，跟我們說。

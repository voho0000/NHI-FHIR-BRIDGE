# SMART on FHIR 對接變更通知 — v0.18.14（2026-06-14）

對接方：MediPrisma（醫析）及其他消費本 bridge bundle 的 SMART on FHIR App。

本版**修正手術／處置（Procedure）的資料模型**。手術醫令（NHI 醫令碼）先前被埋在 `Procedure.note` 自由文字、App 無法判讀（顯示「0 項」），現在抬成**結構化 coding**，且**每個手術醫令各自成為一個 `Procedure`**。

> ### ⚠️ 這是**破壞性變更**（非單純新增）— 請看第 4 節「遷移注意」
> 受影響的只有 **`Procedure`** 資源。其餘資源（Observation／DiagnosticReport／Immunization／Condition…）不受影響。
> 最低 bundle 版本 **0.18.14**；版本可從 `Bundle.meta.tag` 讀取：`{system:".../bridge-version", code:"0.18.14"}`。

> ### 🔄 v0.18.16 更新：診斷理由改為結構化雙語 `reasonCode`
> 手術的 icd9cm 診斷理由先前放在 `Procedure.note` 的英文自由文字（`Reason: …`）。**0.18.16 起改為結構化的 `Procedure.reasonCode[]`**（與 `Encounter.reasonCode` 同一套雙語慣例）：`coding` 掛 ICD-10-CM（有點碼）＋英文 `display`、中文放 `text` —— 讓 App 能對診斷做中英切換。**`Procedure.note` 不再帶診斷理由**（請改讀 `reasonCode`）。本文件下方範例與欄位表已更新為 0.18.16 形狀。

> ### ➕ v0.18.17 更新：ICD-10-PCS coding 補上中文（純加法，非破壞性）
> PCS 分類碼（`code.coding[1]`）的中文先前無處可放（`display` 是英文、`code.text` 是手術名）。**0.18.17 起在 PCS coding 上加 FHIR 標準的 `_display` translation extension** 帶中文：
> ```json
> "_display": { "extension": [{ "url": "http://hl7.org/fhir/StructureDefinition/translation",
>   "extension": [{"url":"lang","valueCode":"zh-TW"},{"url":"content","valueString":"經皮左側玻璃體部分切除術"}]}]}
> ```
> **`coding.display` 仍是英文、不變** —— 純加法,不讀 extension 的 App 完全不受影響;要中文的 App 讀 `coding[1]._display.extension[translation].content`。只有 PCS 這一個 coding 加;NHI 醫令 coding / `code.text` / LOINC / 其它碼皆不動（它們的中文已在 `code.text` 或別的 coding）。

---

## 1. 問題（v0.18.14 之前）

NHI 處置／手術的 detail 端點（`IHKE3308S02`）每一列含：

- `op_CODE` — ICD-10-PCS 處置**分類碼**（如 `08B53ZZ`）
- `sp_IHKE3308S04_data_list[]` — **實際施作的健保醫令**（如 `86412B 微創玻璃體黃斑部手術`）；一處置可含多筆

bridge 其實有抓到這些醫令，但：

- 只把它們寫進 `Procedure.note` 的自由文字（`施作: … (NHI …)`）
- `Procedure` 的標題（`code.text` / `coding[0].display`）用的是 `op_CODE` 的**分類名**，不是手術名

結果：App 拿不到可數、可顯示的結構化手術項目 → 畫面顯示「**0 項**」，也看不到真正的手術名稱。

---

## 2. 修正後（v0.18.14）

**規則：`sp_IHKE3308S04_data_list` 的每一筆醫令 → 一個 `Procedure`。**

- `code.coding[0]` = **NHI 醫令碼**（主碼，實際施作的手術）
- `code.coding[1]` = **ICD-10-PCS `op_CODE`**（次要分類碼，同一列的處置分類，多筆醫令共用）
- `code.text` = **手術名（繁中）**
- `reasonCode[]` = icd9cm 診斷理由（雙語；v0.18.16 起，原為 `note`）
- 一處置含 2-3 筆醫令 → **2-3 個 `Procedure`**（App 的「N 項」即為 Procedure 個數）

### 實際範例（你提供的真實兩筆）

**案例一（住院・臺北榮總・2016-09-23）**

```json
{
  "resourceType": "Procedure",
  "status": "completed",
  "subject": { "reference": "Patient/<id>" },
  "code": {
    "coding": [
      {
        "system": "https://twcore.mohw.gov.tw/CodeSystem/nhi-medical-order-code",
        "code": "86412B",
        "display": "Microincision vitreomacular surgery"
      },
      {
        "system": "http://hl7.org/fhir/sid/icd-10-pcs",
        "code": "08B53ZZ",
        "display": "Excision of Left Vitreous, Percutaneous Approach"
      }
    ],
    "text": "微創玻璃體黃斑部手術"
  },
  "performedDateTime": "2016-09-23T00:00:00+08:00",
  "reasonCode": [{
    "coding": [{
      "system": "http://hl7.org/fhir/sid/icd-10-cm",
      "code": "H35.372",
      "display": "Puckering of macula, left eye"
    }],
    "text": "左側眼黃斑部皺褶"
  }],
  "performer": [{ "actor": { "display": "臺北榮總" } }]
}
```

**案例二（門診・嘉基醫院・2016-01-14；NHI 只給診斷碼、無病名 → `reasonCode` 只有 `coding.code`）**

```json
{
  "resourceType": "Procedure",
  "status": "completed",
  "subject": { "reference": "Patient/<id>" },
  "code": {
    "coding": [
      {
        "system": "https://twcore.mohw.gov.tw/CodeSystem/nhi-medical-order-code",
        "code": "86201C",
        "display": "Intravitreous injection"
      },
      {
        "system": "http://hl7.org/fhir/sid/icd-10-pcs",
        "code": "3E0C3GC",
        "display": "Introduction of Other Therapeutic Substance into Eye, Percutaneous Approach"
      }
    ],
    "text": "玻璃體內注射"
  },
  "reasonCode": [{
    "coding": [{ "system": "http://hl7.org/fhir/sid/icd-10-cm", "code": "H40.11X0" }]
  }],
  "performedDateTime": "2016-01-14T00:00:00+08:00",
  "performer": [{ "actor": { "display": "嘉基醫院" } }]
}
```

---

## 3. 欄位對應（NHI 來源 → FHIR）

| FHIR 欄位 | 來源 | 說明 |
|---|---|---|
| `code.coding[0].system` | （固定） | `https://twcore.mohw.gov.tw/CodeSystem/nhi-medical-order-code` |
| `code.coding[0].code` | `sp_IHKE3308S04_data_list[].order_CODE` | NHI 醫令碼，主碼 |
| `code.coding[0].display` | `order_CODE_NAME`（英文半） | 手術英文名 |
| `code.coding[1].system` | （固定） | `http://hl7.org/fhir/sid/icd-10-pcs` |
| `code.coding[1].code` | `op_CODE` | ICD-10-PCS 分類碼（次要；同列醫令共用） |
| `code.coding[1].display` | `op_CODE_CNAME`（英文半，去 `<碼>/` 前綴） | 分類英文名 |
| `code.text` | `order_CODE_NAME`（中文半） | **手術繁中名（建議拿來當標題）** |
| `performedDateTime` | `sp_…[].exe_S_DATE`（無則 `func_DATE`） | 執行日（含時區 `+08:00`） |
| `reasonCode[].coding[0]` | `icd9cm_CODE` + `icd9cm_CODE_CNAME` | 診斷理由(v0.18.16 起)。system `http://hl7.org/fhir/sid/icd-10-cm`、`code` 為有點碼(H35372→H35.372)、`display` 英文病名 |
| `reasonCode[].text` | `icd9cm_CODE_CNAME`(中文半) | 診斷中文病名(供中英切換)。NHI 只給碼無病名時 → 無 `text`、只有 `coding.code` |
| `performer[].actor.display` | `hosp_ABBR` | 院所（display-only，未鑄 Organization 資源） |

> **`code.coding` 的順序語意**：`[0]` 一律是 NHI 醫令碼（最具體的手術碼），`[1]` 是 PCS 分類碼。建議顯示時優先用 `[0]` 或 `code.text`。

---

## 4. ⚠️ 遷移注意（請務必處理）

這版改動 `Procedure` 的內容，**不是純新增**：

1. **`Procedure.id` 會改變。** id 由內容雜湊派生，主碼從 `op_CODE` 換成 `order_CODE`，所以**同一台手術在新版會得到不同的 resource id**。
   - 若你的 App 以 `Procedure.id` 做 upsert／dedup：重新匯入時舊、新 id 不相符 → **可能新舊並存**。
   - **建議**：使用者重新匯入前，**先清掉該病人既有的 `Procedure` 資源**，再吃新 bundle。
2. **`code.text` 由「PCS 分類名」變成「手術名」**（如「經皮左側玻璃體部分切除術」→「微創玻璃體黃斑部手術」）。若你有快取或顯示文字，會跟著變。
3. **資源數量可能變多**：一個處置若含多筆醫令，會從 1 個 Procedure 變成 N 個。

不受影響：其它資源型別、`subject`、`performedDateTime` 的時區格式、`performer` 形狀皆不變。

---

## 5. 邊界情況（已測試）

- **單台手術**（你目前所有 case）→ 1 個 Procedure，含 NHI + PCS 兩個 coding。✓
- **一處置多台手術** → N 個 Procedure（`order_CODE` 各異），共用同一個 `op_CODE` 次要 coding。✓
- **detail 無醫令子項**（罕見）→ fallback 為 1 個 Procedure，主碼用 `op_CODE`（ICD-10-PCS）。✓
- **NHI 只給診斷碼、無病名**（`icd9cm_CODE_CNAME: null`，如案例二）→ `reasonCode` 只帶 `coding.code`（無 `display` / `text`），App 可自行用 ICD-10-CM 解析病名。✓
- bridge 仍會擋掉「只有 display、無任何醫令碼」的 NHI 清單 stub（如歷史上的偽 procedure「Vaginal ultrasound」），避免污染。

---

## 6. 程式碼系統一覽

| system URI | 用途 |
|---|---|
| `https://twcore.mohw.gov.tw/CodeSystem/nhi-medical-order-code` | NHI 健保醫令碼（手術主碼；與檢驗醫令同一命名空間） |
| `http://hl7.org/fhir/sid/icd-10-pcs` | ICD-10-PCS 處置分類碼（次要） |

有任何顯示／對接問題，回報時附上 `Bundle.meta.tag` 的 bridge 版本即可。

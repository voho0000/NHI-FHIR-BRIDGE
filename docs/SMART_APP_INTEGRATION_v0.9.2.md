# SMART App Integration — Bridge v0.9.2 `Encounter.type` 升級

**Date**: 2026-05-27  ·  **Audience**: 「醫析 MediPrisma」(及其他第三方 SMART app) 開發者

---

## TL;DR

`Encounter.type` 從**單一字串**改成**FHIR-conformant 雙維度 array**：每個 entry 自帶 `coding.system` 標明是 **kind**（分類）還是 **channel**（資料來源），SMART app **不要依賴 array 順序**，應該用 `coding.system` 找對應 entry。

---

## 背景

Bridge v0.9.1 及以前的 `Encounter.type` 把兩個獨立維度擠在同一個 `text` 欄位：

```json
"type": [{ "text": "IC卡資料" }]   // 可能是 IC卡資料 / 申報資料 / 藥局 / 住院
```

→ SMART app 拿到「藥局」時，無法知道這筆 refill 是 IC 卡來源還是申報來源。詳見原 bug report 2026-05-26。

---

## v0.9.2 新 contract

兩個維度拆成兩個 CodeableConcept，每個帶**自描述的 `coding.system`**：

```json
"type": [
  {
    "text": "門診",
    "coding": [{
      "system": "https://nhi-fhir-bridge.github.io/CodeSystem/encounter-kind",
      "code": "outpatient",
      "display": "門診"
    }]
  },
  {
    "text": "IC卡資料",
    "coding": [{
      "system": "https://nhi-fhir-bridge.github.io/CodeSystem/encounter-channel",
      "code": "ic-card",
      "display": "IC卡資料"
    }]
  }
]
```

### 為什麼用 `coding.system` 不用陣列順序

FHIR R4 `Encounter.type` 是 `0..*`，**spec 完全沒定義 entry 順序**。任何 conforming FHIR consumer 都不該假設 `type[0]` 是 kind、`type[1]` 是 channel。用各自的 `coding.system` 標識 dimension 才是 idiomatic FHIR 寫法 — self-describing、跟位置無關、generic SMART app 也能 parse。

---

## Bridge 端 Code System 定義

### `https://nhi-fhir-bridge.github.io/CodeSystem/encounter-kind`

| `coding.code` | `coding.display` / `text` |
|---|---|
| `outpatient` | 門診 |
| `emergency` | 急診 |
| `inpatient` | 住院 |
| `pharmacy` | 藥局 |

### `https://nhi-fhir-bridge.github.io/CodeSystem/encounter-channel`

| `coding.code` | `coding.display` / `text` |
|---|---|
| `claims` | 申報資料 |
| `ic-card` | IC卡資料 |

**未知值處理**：若 NHI 將來新增 kind / channel 值（例如「夜診」），bridge 仍會 emit `coding`，但**省略 `coding.code`**，只保留 `system` + `display`。SMART app 用 `system` 仍能定位正確 dimension。

---

## SMART app 端 client code（建議）

```ts
const ENCOUNTER_KIND_SYSTEM =
  "https://nhi-fhir-bridge.github.io/CodeSystem/encounter-kind";
const ENCOUNTER_CHANNEL_SYSTEM =
  "https://nhi-fhir-bridge.github.io/CodeSystem/encounter-channel";

function findTypeBySystem(encounter: any, system: string) {
  return encounter.type?.find(
    (t: any) => t.coding?.some((c: any) => c.system === system)
  );
}

// 拿 kind（門診/住院/急診/藥局）
const kindEntry = findTypeBySystem(encounter, ENCOUNTER_KIND_SYSTEM);
const kindCode = kindEntry?.coding?.[0]?.code;        // "outpatient" | "inpatient" | ...
const kindDisplay = kindEntry?.text;                  // 「門診」「住院」...

// 拿 channel（IC卡資料/申報資料）
const channelEntry = findTypeBySystem(encounter, ENCOUNTER_CHANNEL_SYSTEM);
const channelDisplay = channelEntry?.text;            // 「IC卡資料」「申報資料」
```

---

## MediPrisma 具體要改的地方

### 1. `features/clinical-summary/visit-history/hooks/useVisitHistory.ts` (department / subtitle 來源)

**現況問題**：讀 `type[0].text` 然後 strip kind 字串，期望剩下 channel — v0.9.2 後 type[0] 永遠只是 kind 字，strip 完一定空字串、subtitle 消失。

**建議方向**：
- 用上面的 `findTypeBySystem` helper 拿 channel entry
- Fallback 到舊邏輯（讀 type[0]、strip kind）以相容 v0.9.1 及以前的 bridge bundle

```ts
const v092Channel = findTypeBySystem(encounter, ENCOUNTER_CHANNEL_SYSTEM)?.text || ''
let department = v092Channel ||
                encounter.type?.[0]?.coding?.[0]?.display ||
                encounter.type?.[0]?.text ||
                encounter.serviceType?.coding?.[0]?.display ||
                ''
department = department.replace(/門診|住院|急診|藥局/g, '').trim()
```

### 2. `src/infrastructure/ai/tools/fhir-tools.ts` (`encounterDeptText`)

**現況問題**：只讀 `type[0]`，AI agent `department` filter 搜「IC卡資料」會找不到（在 type[1]）。

**建議方向**：把所有 `type[]` entries 的 text 合併成一條 searchable string（同時包含 kind + channel）。

```ts
function encounterDeptText(enc: any): string {
  const typeJoined = Array.isArray(enc.type)
    ? enc.type.map((t: any) => t?.text || t?.coding?.[0]?.display).filter(Boolean).join(' ')
    : ''
  return typeJoined || pickName(enc.serviceType) || ''
}
```

`classifyEncounterType` 走 substring match 找 kind keyword（急診/住院/藥局/門診）— v0.9.2 後仍正常運作（因為 type[0] 就是 kind 字本身）。

---

## 向後相容 / 升級期過渡

| Bundle 來源 | `Encounter.type` 形狀 | SMART app 處理 |
|------------|---------------------|---------------|
| Bridge **v0.9.2+** | 兩個 CodeableConcept，各帶 `coding.system` | `findTypeBySystem` 拿到 kind / channel；理想情況 |
| Bridge **v0.9.1 及以前** | 一個 text-only CodeableConcept | `findTypeBySystem` 回 undefined → fallback 到舊邏輯（讀 `type[0]` 並 strip kind） |
| 混合（user 之前 sync 過舊版 bridge、新版 bundle import 進來） | 兩種都可能 | 同上 fallback 路徑兼容 |

---

## 4 個 regression case（建議測試）

```ts
// case A — 門診 / IC卡（user 截圖的「長庚嘉義」）
{
  type: [
    { text: "門診", coding: [{ system: ENCOUNTER_KIND_SYSTEM, code: "outpatient", display: "門診" }] },
    { text: "IC卡資料", coding: [{ system: ENCOUNTER_CHANNEL_SYSTEM, code: "ic-card", display: "IC卡資料" }] }
  ],
  class: { code: "AMB" }
}
// 期望：tag = 門診 (blue) · subtitle = IC卡資料

// case B — 藥局 / IC卡（user 截圖的「安心大藥局」）
{
  type: [
    { text: "藥局", coding: [{ system: ENCOUNTER_KIND_SYSTEM, code: "pharmacy", display: "藥局" }] },
    { text: "IC卡資料", coding: [{ system: ENCOUNTER_CHANNEL_SYSTEM, code: "ic-card", display: "IC卡資料" }] }
  ],
  class: { code: "AMB" }
}
// 期望：tag = 藥局 · subtitle = IC卡資料

// case C — 住院 / 申報資料
{
  type: [
    { text: "住院", coding: [{ system: ENCOUNTER_KIND_SYSTEM, code: "inpatient", display: "住院" }] },
    { text: "申報資料", coding: [{ system: ENCOUNTER_CHANNEL_SYSTEM, code: "claims", display: "申報資料" }] }
  ],
  class: { code: "IMP" }
}
// 期望：tag = 住院 · subtitle = 申報資料

// case D — 舊 bridge 向後相容
{ type: [{ text: "IC卡資料" }], class: { code: "AMB" } }
// 期望：tag = 門診（從 class.code 推） · subtitle = IC卡資料
```

---

## 其他無需改的地方

- 既有「藥局」keyword detection（`typeText.includes('藥局')`）仍正常，因為 v0.9.2 後 type[0].text 就是「藥局」
- `class.code` 對 EMER / IMP / AMB 的 classification 不變
- 其他 resource type（MedicationRequest、Observation、Procedure 等）未動

---

## 一句話 SMART app dev 該做的事

把所有 `encounter.type?.[0]` / `encounter.type?.[1]` 的 hard-coded index 改成 `encounter.type.find(t => t.coding[0].system === ...)`，並 fallback 舊邏輯給 v0.9.1 bundle。

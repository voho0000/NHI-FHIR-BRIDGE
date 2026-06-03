# Changelog

All notable changes to NHI-FHIR-Bridge are documented here.
Newest first. GitHub Releases page keeps the latest version only; this file is the authoritative history.

## 0.13.5 重點 — 2026-06-03

**🩺 LOINC 修正 — 抗粒線體抗體 (AMA) 標錯成黴菌血清學；補上 IgM / 血氨 LOINC**

App 端（MediPrisma）回報 Observation LOINC 標註錯誤／缺漏，本版修正：

- **Bug A（高風險）— 12056B「粒線體抗體」(AMA, PBC 指標) 標錯**：原本對到 LOINC `16124-0`「Cryptococcus sp Ab」（隱球菌血清學，完全是另一個臨床意義）。改對到 **`20483-4`**（Mitochondria Ab [Titer] in Serum，method-independent）。同時移除已無人引用的 `16124-0` display 條目。
- **Bug B（中風險）— 補上定量分析物 LOINC**：
  - **IgM** `12028B`／`12029B` → **`2472-9`**（IgM [Mass/volume] in S/P），與 IgG `12025B`→`2465-3`、IgA→`2458-8` 對稱。
  - **血氨 (Ammonia)** `09037C`：回報建議的 `1827-1` **在 LOINC 並不存在**（已查證），改採實際代碼 — 預設 **`22763-7`**（Ammonia [Mass/volume] in Plasma，對 µg/dL）；當單位為 molar（µmol/L）時，經新增的 `ammoniaLoincFix()` 切換為 **`16362-6`**（Ammonia [Moles/volume] in Plasma），手法與既有 `urineProteinLoincFix()` 一致，避免 LOINC↔單位不一致。

所有 LOINC 均依規則 5 透過 loinc.org 查證 Component／Property／System／Method。依規則 8 為 AMA、IgM、血氨（質量／莫耳濃度切換）新增 silent-bug CI invariant 測試。

**忠實搬運：僅修正 LOINC 對應，未更動任何病人數值／日期／單位。** 驗證：backend-ts `tsc`／`biome`／`vitest` 457 綠、extension `build.mjs` 綠＋140 tests 綠。

本版同時收尾 clean-code 初始化：移除無用的 Python backend（PR3）、extension 全面遷移至 TypeScript + Biome（PR4，零行為變更）。

---

## 0.13.4 重點 — 2026-06-03

**🔴 工具列圖示紅點提示 — 同步完成有抓到資料時，圖示右上角浮出小紅點**

使用者需求：同步完成後就算關掉 popup，也能在 Chrome 工具列圖示上看到「有新資料」的提示（像手機 App 的通知點），點開 popup 後紅點消失。

行為：
- 同步成功且**有抓到資料**（count > 0）時，service worker 在圖示右上角疊一個白圈紅點（iOS 風格 `#d70015`，半徑為圖示的 0.17、白色細外框 0.05）
- 同步完成但**沒抓到任何資料**（count ≤ 0）時，**不顯示**紅點
- 打開 popup 即視為「已看過」→ popup 送 `markSyncSeen`，SW 還原原始圖示並清除旗標
- 開始新一次同步時先清掉殘留的舊紅點

實作（`extension/src/background/badge.js`，新模組）：
- 用 MV3 worker 內建的 `OffscreenCanvas` + `createImageBitmap` 在執行期把紅點合成到既有圖示上，再以 `chrome.action.setIcon` 換上 — **不需額外 PNG 資產**、不需新權限（`action` manifest key 已足夠）
- 圖示替換屬瀏覽器端 UI：SW 自行 unload 後仍在，但**整個瀏覽器重啟不會留存** → 持久化 `unseenSyncResult` 布林旗標，SW 重新喚醒時（`restoreResultBadge`）重新套用，紅點得以撐過瀏覽器重啟，直到使用者打開 popup 為止

接線：
- `sync-orchestrator.js`：`phase: "init"` 後 `clearResultBadge()`、`phase: "done"` 後 `showResultBadge(total)`
- `background.js`（SW 入口）：新增 `markSyncSeen` 訊息 handler（→ `clearResultBadge`）、`onStartup` / top-level 呼叫 `restoreResultBadge()`
- `popup.js`：`init` 開頭送 `markSyncSeen`

**零 mapper / FHIR 輸出變更。** 驗證：`node build.mjs` 綠、extension 168 tests 綠。

---

## 0.13.3 重點 — 2026-06-03

**🧹 內部重構 — 拆分 `popup.js`（零行為變更）**

Clean-code 初始化的第二階段（PR2）：popup 的單一 2145 行 `popup.js` 拆成 12 個聚焦模組，**純搬移、不改任何行為、UI 與訊息流程完全一致**。延續 v0.13.2 background 拆分的同一手法。

拆分後結構（`extension/src/popup/`）：

| 模組 | 內容 |
|---|---|
| `constants.js` / `els.js` / `utils.js` | 共用常數、DOM 元素註冊表、純工具（`isNhiTab` / `getActiveTab` / fmt helpers）|
| `state.js` | 跨模組共用的 mutable `state`（bundle 後共用同一份）|
| `patient-form.js` | 病人覆寫表單（load/get/validate/save/clear/summary）|
| `connection.js` / `data-state.js` | backend 連線測試、本機 bundle 狀態卡 |
| `wizard.js` | 步驟 UI（conn banner / active step / button states / init wizard）|
| `status.js` | sync 狀態渲染 + 背景同步狀態橋接 |
| `bundle.js` | pending bundle 下載／清除／重整 |
| `sync-client.js` | `apiSyncNhi` / `launch` / 背景訊息 client |
| `tooltip.js` | help tooltip |

`popup.js` 入口縮成 `init` + 集中事件綁定。所有 `addEventListener` 收斂到單一入口（避免拆分時掉控制項）。

**安全網**：
- 新增 `tests/popup-imports.test.js` — 鏡像 `background-imports.test.js`，掃描 `popup.js` + `popup/*.js`，per-file 檢查跨模組呼叫 ⊆（本地定義 ∪ import 名稱），守住「呼叫了但沒 import」那類 silent bug
- 驗證：`node build.mjs` 綠、extension 168 tests 綠、手動逐一點擊每個 popup 控制項（wizard 步驟、存／清病人、backend 測試、模式切換、遮罩切換、同步、停止、下載 bundle、設定開關）確認無遺漏綁定

esbuild 仍打包成單一 `dist/popup.js` IIFE，`manifest.json` / `build.mjs` entry 不變。

---

## 0.13.2 重點 — 2026-06-02

**🧹 內部重構 — 拆分 `background.js`（零行為變更）**

Clean-code 初始化的第一階段（PR1）：service worker 的單一 2007 行 `background.js` 拆成 11 個聚焦模組，**不改任何行為、不動 mapper、FHIR 輸出完全一致**。

拆分後結構（`extension/src/background/`）：

| 模組 | 內容 |
|---|---|
| `constants.js` | 共用常數（STORAGE_KEY / NHI_HOST / *_ERROR / page-type order 等）|
| `sync-state.js` | `_cancelled` / `_activeSyncCtx` 單一持有者（bundle 後共用同一份狀態）|
| `sync-orchestrator.js` | `runNhiApiSync` 主流程（依序 phase 呼叫）|
| `nhi-list-fetch.js` | 並行 list 抓取（CONC=3、in-tab executeScript）|
| `nhi-detail-fetchers.js` | 6 個近乎相同的 `_fetch*DetailsInTab` 收斂成單一 config-driven `fetchDetailsInTab` + 6 份 serializable spec |
| `s02-detail.js` | S02 明細純函式（可單元測試）|
| `bundle.js` / `backend-upload.js` / `auth.js` / `patient-override.js` / `storage-migration.js` | local bundle 組裝、backend HTTP、登入探測、病人覆寫、storage 遷移 |

**安全網**：
- `tests/background-imports.test.js` 泛化成掃描每個 `background/*.js` 模組（per-file 檢查 adapter/endpoint 呼叫 ⊆ import；守住 v0.6.3 「呼叫了但沒 import」那類 silent bug）
- `tests/endpoints.test.js` 兩個 text-scan 測試改讀合併後的 SW source（detail URL 移到 `nhi-detail-fetchers.js`、`LOCAL_PAGE_TYPE_ORDER` 移到 `constants.js`）
- 驗證：`node build.mjs` 綠、extension 153 tests 綠、backend-ts 455 tests 綠、手動 golden-bundle 比對無異常

esbuild 仍打包成單一 `dist/background.js` IIFE，`manifest.json` / `build.mjs` entry 不變。

---

## 0.13.1 重點 — 2026-06-02

**🔧 修 v0.12.4 / v0.12.5 dedup architectural 漏洞 — 改用 LOINC 當 dedup key**

App dev 2026-05-30 follow-up audit 在 v0.13.0 bundle 找到 **98 個 A+B 結構性 pair** 在長庚嘉義沒被 dedup（CBC + 部分 chemistry / urinalysis）。Pre-fix 範例：MCV 787-2 @ 長庚嘉義 2026-01-14 有兩筆 obs（A row display "MCV"、B row display "平均紅血球容積"），value/unit/code/date/hospital 全相同、唯一不同是 refRange 編碼（A=numeric `[80][100]`、B=`[無]`）。

**Root cause (architectural gap)**：bridge 有**兩張 parallel 的 alias 表**：

| 用途 | 函式 | 用的表 | CBC EN+CJK alias |
|---|---|---|---|
| LOINC routing | `findLoinc` | `PANEL_LOINC_MAP["08011C"]` | ✅ 有 |
| Dedup key | `canonicalLabKey` | `CODE_SCOPED_SYNONYMS` | ❌ 只有 06013C，沒 08011C / 08013C |

兩張表 evolve 過程沒同步 → `findLoinc("08011C", "MCV")` 跟 `findLoinc("08011C", "平均紅血球容積")` 都對到 787-2（dedup 該抓），但 `canonicalLabKey` 給不同字串（`"mcv"` vs `"平均紅血球容積"`）→ dedup key 不同 → 永遠不同 group → 整個 CBC family 系統性 miss。這是 v0.13.0 CLAUDE.md rule #7 dual-source 原則的另一個 instance — 一個 helper 用 source A、另一個用 source B，drift 是時間問題。

**Fix**：`dedupNhiCrossChannelPairs` 直接用 `findLoincDetailed(code, display).loinc` 當 key 的一部分，跟 buildObservation 用同一個 source of truth。新 key：`(code, loinc, date, hospital, value, unit)`，不再用 canonical。

```
v0.12.5 key: code | date | hospital | value | unit | canonical
v0.13.1 key: code | loinc | date | hospital | value
```
（`unit` 也拿掉 — 見下方第 2 個 silent bug。）

**Why LOINC 是對的 discriminator**：
- Panel codes（CBC、urinalysis）：每 row 對到具體 sub-analyte 的 LOINC（787-2 MCV ≠ 786-4 MCHC ≠ 4544-3 HCT），同 sub-analyte 的 A+B 一定同 LOINC → 同 group → dedup ✓
- Single-analyte codes（09021C 鈉、09013C 尿酸）：path A 從 NHI_TO_LOINC 拿，所有 row 同 LOINC → 跟 v0.12.5 行為一致
- Path-C fallback（display 認不得）：A、B 都掉到 panel default LOINC → 同 group → dedup（correct）
- A、B 路由到不同 LOINC（routing 不一致 bug）：不同 group → 不 dedup（correct，inconsistency 該保留可見）

**順手 bug fix（尿生化 06013C EN/CJK alias parity，2026-06-02 app dev audit）**：新 LOINC-based dedup 暴露了 routing 不一致 — A channel 英文 display 跟 B channel 中文 display 對到**不同** LOINC，所以該 collapse 的 pair 反而留兩筆、還帶錯碼。修了 4 個缺漏 alias（全部 WebFetch loinc.org 查證過）：

| 缺的 key | 之前錯誤路由 | 修正後 | LOINC 驗證（loinc.org 2026-06-02）|
|---|---|---|---|
| `濁度`（B，A 是 `Turbidity`）| path-C panel default `24356-8` ✗ | `5767-9` ✓ | Appearance of Urine（System Urine）|
| `酸鹼值`（B，A 是 `pH`；注意 ≠ 已登錄的 `酸鹼度`）| path-C panel default `24356-8` ✗ | `5803-2` ✓ | pH of Urine by Test strip |
| `CREA(U)(半定量)`（A，B 是 `肌酸酐(尿液)`）| global `crea` → `2160-0` **血清** ✗ | `2161-8` ✓ | Creatinine [Mass/volume] in Urine |
| bare `膽紅素`（之前只有帶 prefix 的 `尿膽紅素`）| fallback | `5770-3` ✓ | Bilirubin.total [Presence] in Urine by Test strip |

> ⚠️ 這幾個是 **silent bug**（CLAUDE.md rule #8）：FHIR validator 不會抓、runtime 不報錯，只有人工對 bundle 才看得到。只有 A、B 兩 channel 都路由到**同一** LOINC 時 v0.13.1 的 A+B dedup 才會 fire，所以 alias parity 是 dedup 正確性的前提。

**第 2 個 silent bug（unit 編碼差異擋住 cross-channel dedup，user report 2026-06-02）**：LOINC routing 修好後，定性尿液項目（Color / Turbidity / SP.Gravity / pH / LE / OCCULT）還是出現英文重複兩筆。Root cause：`dedupNhiCrossChannelPairs` 的 group key 含**原始 unit 字串**。NHI channel A 這些定性項目 ship `unit=""`，但 channel B ship placeholder 編碼（`空白空白` / `無` / `-`）；其他 pair 則差在大小寫 / UCUM 格式（`mg/dl` vs `mg/dL`、`10^3/uL` vs `10*3/uL`）— 兩邊 key 不同 → A+B 落不同 group → cross-channel dedup 永遠不 fire。

| 項目 | A unit | B unit | pre-fix | post-fix |
|---|---|---|---|---|
| Color / 顏色 | `""` | `-` | ❌ 2 obs | ✅ 1 obs |
| SP.Gravity / 比重 | `""` | `空白空白` | ❌ 2 obs | ✅ 1 obs |
| pH / 酸鹼值 | `""` | `無` | ❌ 2 obs | ✅ 1 obs |

**Fix（user decision 2026-06-02）**：cross-channel grouping key **直接拿掉 unit**，改成 `(code, loinc, date, hospital, value)`。A+B 是同一筆 logical measurement 走兩個上傳 channel，unit 欄位正是 per-channel 編碼雜訊；`value` + `LOINC` 已經唯一 pin 住 measurement identity（同 LOINC = 同 analyte = 同 unit dimension，同組內真的不同 reading 會帶不同 `value`）。拿掉 unit 一次處理掉**所有** unit 編碼變異（placeholder / 大小寫 / UCUM 格式 / 全形），不用枚舉。

**不違反 CLAUDE.md rule #9**（rule #9 的 raw-unit 要求 scope 在 **same-source** 比較，這個 function 不是）：

- 純 A / 純 B group 一律走 `else` 分支保留全部 row，跟 grouping 無關 — 只有真的偵測到 cross-channel A+B 才 drop B
- `stableId`（buildObservation）仍用 raw unit 字串 → 同源 A+A / B+B 只差 placeholder 編碼的 row 下游維持 distinct
- A+B collapse 時保留的 A row 帶自己（較乾淨）的 unit + numeric refRange

### 改了什麼

| 檔案 | 內容 |
|---|---|
| `packages/mapper/src/observation.ts` | `dedupNhiCrossChannelPairs` 改用 `findLoincDetailed` 算 LOINC、key 從 `(code, date, hospital, value, unit, canonical)` 改成 `(code, loinc, date, hospital, value)`；移除 `isPanel` + `canonical` + **`unit`**（unit 是 cross-channel 編碼雜訊，value+LOINC 已 pin 住 measurement）|
| `packages/mapper/src/loinc-tables.ts` | `PANEL_LOINC_MAP["06013C"]` 補 `濁度`→5767-9、`酸鹼值`→5803-2、`crea(u`/`crea(urine`→2161-8、bare `膽紅素`→5770-3（4 個 LOINC 全 WebFetch 查證，inline comment 記錄）；`crea(u` 同步補進 `09015C` block |
| `backend-ts/tests/unit/bundle-quality.test.ts` | 加 5 個 dedup-key lockdown + 4 個尿生化 EN/CJK parity lockdown + 4 個 unit-agnostic dedup lockdown（A `""`+B placeholder → 1 obs、real unit 仍 dedup、A real+B placeholder collapse 且保留 A 的 unit、同源純 B 保留）|
| 4 個 version files | `0.13.0` → `0.13.1` |

### 驗證

- ✅ Extension test: **142/142 passed**
- ✅ Backend-ts test: **455/455 passed**（v0.13.0 baseline 442 + 5 dedup-key + 4 EN/CJK parity + 4 placeholder-unit dedup 新 lockdown）
- ✅ App dev 98-pair case：MCV / MCHC / RDW / HCT / Platelet / RBC / 等 CBC analytes 在長庚嘉義 A+B 自動 collapse 到 1 obs each
- ✅ User 2026-06-02 定性尿液重複 case：Color / Turbidity / SP.Gravity / pH / LE / OCCULT（A `unit=""` + B placeholder）A+B 自動 collapse 到 1 obs each
- ✅ FHIR R4 compliance：純內部 grouping logic 改動，沒動任何 spec 欄位 / Coding / value / unit
- ✅ Backward compat：所有 v0.12.5 dedup 行為 case（單分析 code、06013C 3A+3B sub-analytes）保持一樣

### Architectural lesson (CLAUDE.md rule #7 加強)

> **Two parallel alias tables = structural problem**：若一個 helper 用 PANEL_LOINC_MAP、另一個用 CODE_SCOPED_SYNONYMS、第三個 hard-code 自己的 list — 三方 evolve 過程一定有 drift。任何 cross-reference 的下游 logic 應該 reuse 唯一 source-of-truth function（例：findLoincDetailed 同時供 dedup 跟 build 使用）。

不影響其他 SMART app — dedup 只 collapse「同 LOINC + 同 value + 同 unit + 同 date + 同 hospital + 1A+1B」的結構性重複，不違反 v0.12.4 strict-faithful 原則。

---

## 0.13.0 重點 — 2026-05-30

**🩺 三項 metadata 修補：specimen mis-tag 修掉 + CBC LOINC code.text 統一 + NHI 就醫日期 (funC_DATE) 保留**

第 1 項是 **bug fix**（v0.6.x 就有的潛在問題、app dev 2026-05-29 follow-up 報告抓到）。第 2、3 項是新增 metadata signal — 都用 **FHIR 標準欄位** 帶 extra info 給下游 SMART app，**沒動現有任何欄位語義**、**Coding 完全不動**、**effectiveDateTime 完全不動**。

### 🔴 ① Specimen mis-tag fix — `inferSpecimen` 改成跟 LOINC 同 architecture (NHI 醫令碼 authoritative)

**Bug**：SMART app dev follow-up 2026-05-29 audit 在 v0.12.6 bundle 發現 39 筆 blood-analyte Observation 被 silently 標 `specimen.display='Urine'`，導致 SMART app 把那些 obs 路由到 urinalysis tab、從化學常規 cumulative report 消失 — 而且**沒有任何視覺警示**，臨床端只看到空欄位。

**Root cause (architectural gap)**：bridge 早就有 `NHI_TO_LOINC["09013C"] = "3084-1"` 這張表幫 LOINC routing（用 NHI 醫令碼當 authoritative source），但 `inferSpecimen` 從來沒沿用這套架構 — 它**從頭到尾只看 display / order_name 字串**，靠 `SPECIMEN_RULES[0] = [/尿|urine|urinaly/i, "Urine"]` 這條 bare-substring 規則。結果：

| NHI 醫令碼 | NHI 名稱 | LOINC | 修前 specimen | 受影響 records |
|---|---|---|---|---|
| 09013C | 尿酸 (UA blood) | 3084-1 (Urate Ser/Plas) | `Urine` ❌ | 13 |
| 09002C | 血中尿素氮 (BUN) | 3094-0 (BUN Ser/Plas) | `Urine` ❌ | 22 |
| 09015C | 肌酸酐(尿液) variant | 2160-0 | `Urine` ✓（巧合對） | 4 |

bare `尿` 撞 `尿酸` / `尿素`：bridge 在隔壁 LOINC 表就知道 09013C 是血液 urate，但 specimen pipeline 沒問就直接用 substring 猜。**LOINC 路徑跟 specimen 路徑當年沒做一致性審查 — 這是 design-time gap**。

**Fix — 把 specimen pipeline 對齊 LOINC 架構**（`packages/mapper/src/observation.ts`）：

1. **新加 `NHI_CODE_PREFIX_SPECIMEN`** — NHI 醫令碼 2-char prefix → default specimen：
   - `06` → Urine（urinalysis 系列：06013C 尿生化 / 06014C 尿沉渣 ...）
   - `08` → Blood（CBC / hematology：08003C / 08004C / 08011C / 08013C ...）
   - `09` → Blood（chemistry — 絕大多數血液 / serum）
   - `11` → Blood（blood typing：ABO / RH / antibody）
   - `12` → Blood（immunology / serology / tumor markers）
   - `13` / `14` / `24` / `27` → Blood（specialty serum）
2. **新加 `NHI_CODE_SPECIMEN_OVERRIDE`** — 特定 code 例外（目前只有 `09016C: Urine` 對應「肌酐、尿」NHI 官方 urine-creatinine code）
3. **新加 `URINE_MARKERS_RE`** — 拿掉 bare `尿`，只 match 具體 markers：`尿液 / 尿道 / 尿沉渣 / 尿生化 / 尿常規 / 尿糖 / 尿蛋白 / 尿微量白蛋白 / 小便 / (尿) / (尿液) / urinaly / urinal / urine（word boundary） / u-malb / u-acr / u-cre / u-mab / u-pcr`
4. **新 priority order**：
   1. Display URINE marker → Urine（LIS-shipped display 知道實際 measured specimen，override NHI catalog 預設 — 處理 09015C 血液-default code 但 display 寫 `(尿液)` 的 mis-billed 情境）
   2. Other specimens（stool / sputum / CSF / pleural / 骨髓 / synovial / amniotic / cervical）— 比 NHI code default 先跑，例外處理（不在主要 NHI prefix 系列裡）
   3. **NHI 醫令碼 default** — authoritative，這是 architectural fix 的核心
   4. Order_name URINE marker — unknown NHI code 才走的 fallback

**為什麼新邏輯也安全保留 `display URINE override`**：09015C 是 NHI 血液-default code，但有些醫院 LIS 會把尿液 creatinine 申報在這個 code 下，display 寫 `肌酸酐(尿液)`。LIS-shipped display 是實際 measurement 的 ground truth，所以 display URINE marker 排在 NHI code default 前面。

**驗證 — 9 個 CI regression locks**：
| Case | 修前 | 修後 |
|---|---|---|
| 09013C 尿酸 "Uric Acid (B)" | Urine ✗ | Blood ✓ |
| 09002C BUN "血中尿素氮" | Urine ✗ | Blood ✓ |
| 09015C "肌酸酐(尿液)" | Urine ✓ | Urine ✓ |
| 09015C "Crea" + order_name "肌酸酐、血" | Blood ✓（靠 bare 血 regex） | Blood ✓（靠 NHI prefix） |
| 06013C 尿糖 (urinalysis sub-row) | Urine ✓ | Urine ✓ |
| **09013C `display="尿酸"` 無 English marker** | **Urine ✗** | **Blood ✓**（純 NHI code authoritative）|
| **06013C `display="Color"` 無 urine marker** | 失敗（沒命中 urine markers） | **Urine ✓**（純 NHI code authoritative）|
| **09016C 尿液 creatinine** | Urine ✓ | Urine ✓（explicit override）|
| Stool occult blood "Occult blood" | Stool ✓ | Stool ✓ |

**FHIR R4 + faithful transport check**：`Specimen.display` 是 free-form 文字欄位（bridge 不另發 Specimen resource），labelling 我們自己的輸出。Patient values / NHI codes / LOINC mappings 全沒動。是 labelling correction，不是 data mutation。

### ② CBC LOINC obs.code.text canonicalization（clean-match guard）

### ① CBC LOINC obs.code.text canonicalization（clean-match guard）

**Why**: App dev (MediPrisma) 2026-05-29 軟需求。3 家醫院送 Hb 的 `obs.code.text` 可能是 "Hb" / "血色素" / "Hemoglobin" / "HGB"，跨醫院 group-by-text 需要 app 端 alias table 才能合併。User 2026-05-30 評估後決定做。

**What**: 12 個 CBC LOINCs（770-8 Neutrophils % / 736-9 Lymphocytes % / 5905-5 Monocytes % / 713-8 Eosinophils % / 706-2 Basophils % / 4544-3 HCT / 718-7 Hb / 777-3 Platelet / 787-2 MCV / 786-4 MCHC / 788-0 RDW / 789-8 RBC）放進新的 `CBC_CANONICAL_TEXT_LOINCS` set。`obs.code.text` 走 LOINC_SHORT_TEXT canonical 短名 — **但只在 `findLoincDetailed.cleanMatch === true` 時觸發**。

**Mis-tag canary 保留**：findLoinc path C（panel-default fallback，display 沒命中任何 alias）→ cleanMatch=false → SHORT_TEXT 不套 → 保留 raw display。這是 v0.11.9 Bug 6 的教訓（帶狀嗜中性白血球 silently routed to 770-8 panel default 時，app dev 是靠 obs.code.text 跟 LOINC 不一致發現的）。

**Mechanism**：
- `findLoinc(code, display)` 保留向後相容（thin wrapper）
- 新加 `findLoincDetailed(code, display) → { loinc, cleanMatch }`
  - path A (NHI_TO_LOINC single-analyte) → cleanMatch=true
  - path B1 (PANEL_LOINC_MAP explicit alias hit) → cleanMatch=true
  - path B (LOINC_MAP global alias hit) → cleanMatch=true
  - path C (panel-default fallback) → cleanMatch=false ⚠️
- 新加 `resolveObsCodeText(loinc, code, display, cleanMatch)` 集中 text 解析邏輯 + clean-match gate

**已知 edge case**：v0.11.11 #8 single-obs DR text propagation 在「single-leaf NHI code + 未知 display」case 還是會把 canonical 短名灌回 obs.code.text（08003C/04C/06C single-row 案例）。這是 v0.11.11 自己的 behaviour、不是 v0.13 引入，且該情境下 NHI 醫令碼本身已唯一指定 analyte，canonical 標籤其實仍正確。Multi-row 08011C / 08013C panel 不受此影響 — canary 對主要 surface area 還在。

### ② NHI 就醫日期 (funC_DATE) → Observation.meta.tag

**Why**: User-verified anomaly 2026-05-30。長庚嘉義 09006C HbA1c 在健保存摺 raw 上：
- `reaL_INSPECT_DATE` = 2025-12-09（檢查日期）
- `funC_DATE` = 2025-09-16（就醫日期）

兩者差 ~3 個月。可能成因：醫院晚報、roving outpatient lab order、或 NHI 上傳系統 bug。Bridge **不能自己判斷哪個對**（CLAUDE.md faithful transport rule），但有義務把這個 signal 保留下來讓 app 能 detect 異常。

**What**: 加 `Observation.meta.tag` 攜帶 funC_DATE：
```json
{
  "system": "http://nhi-fhir-bridge/nhi-visit-date",
  "code": "2025-09-16"
}
```

**Why meta.tag (not extension / not Encounter ref)**：
- 跟 v0.12.3 `nhi-source-channel` 用同一個 pattern，maintenance 連貫
- FHIR R4 `Resource.meta.tag` 是標準欄位（type Coding, 0..\*）
- Spec 原文：「applications are not required to consider the tags」→ 不認識這個 system URI 的 app 自動忽略 → **non-breaking for any SMART app**

**Backward-compat 保證**：
- `Observation.effectiveDateTime` 維持 reaL_INSPECT_DATE（不變）
- `Coding.display` / `Coding.code` 全部不動
- 12 個 CBC LOINCs 的 `obs.code.text` 在 clean match 時變 canonical，但只是更乾淨的 free-form 字串，無 schema 改動

### 改了什麼

| 檔案 | 內容 |
|---|---|
| `packages/mapper/src/loinc-tables.ts` | +12 個 CBC LOINC_SHORT_TEXT 條目 + 新 export `CBC_CANONICAL_TEXT_LOINCS` Set |
| `packages/mapper/src/observation.ts` | 新 `findLoincDetailed()` + `resolveObsCodeText()` + `NHI_VISIT_DATE_SYSTEM` + `appendNhiVisitDateTag()`；`mapObservation` + `buildObservation` 改用 detailed lookup + visit-date tag emission |
| `extension/src/nhi-adapters.js` | `adaptLabItem` 加 `nhi_visit_date: rocToISO(item.funC_DATE)` |
| `extension/tests/adapters.test.js` + `__snapshots__` | 加 `nhi_visit_date` 期望 |
| `backend-ts/tests/unit/bundle-quality.test.ts` | +10 個 v0.13 lockdown regression tests（CBC clean-match × 5 + canary × 1 + non-CBC × 2 + visit-date × 3） |
| `CLAUDE.md` | rule #2 加 CBC clean-match gate 條目；新章節「CBC LOINC code.text canonicalization」+「NHI funC_DATE surfaced via meta.tag」 |
| 4 個 version files | `extension/src/manifest.json` + `extension/package.json` + `backend-ts/package.json` + `extension/dist/manifest.json` → `0.13.0` |

### 驗證

- ✅ Extension test: **142/142 passed**
- ✅ Backend-ts test: **442/442 passed**（v0.12.6 baseline 422 + 20 個 v0.13 新加 regression：6 CBC clean-match + 1 mis-tag canary + 9 specimen lockdown + 1 silent-bug invariant + 3 visit-date）
- ✅ FHIR R4 compliance check：兩個新 feature 都用 spec-internal 欄位（meta.tag、CodeableConcept.text），沒引入 non-standard extension；Coding.display 全部不動

### 順手加：silent-bug CI gate + dual-source architectural rule（CLAUDE.md rule #7 / #8）

User 反問「specimen mis-tag 是 silent bug、怎麼在 test 抓到」+ 「只靠 name / 只靠 NHI 碼都會錯、要同時看兩個」— 加：

1. **新 invariant test** `CI invariant — specimen.display vs NHI 醫令碼 consistency`：25 個 (NHI code, display) → expected specimen 對照表，bridge 跑出任何違反 → CI red + 一次列所有 violations。未來有人改 inferSpecimen 邏輯不小心倒回 substring bug、或 NHI code mapping 改錯，這 gate 立刻擋。同 pattern 可延伸到其他 silent invariant（LOINC routing / scale-type / meta.tag presence）。

2. **CLAUDE.md rule #7「(NHI 醫令碼, display) is a dual-source signal — never trust only one」**：明確記錄 architectural lesson — bridge 從 LOINC routing 一路到 specimen 都遵守「NHI code 提供 panel context、display 提供 specificity 跟 mis-billing override」。display-only bug（substring 撞、alias miss）跟 code-only bug（mis-billing 蓋過、panel default 收掉 sub-analyte）兩種都有 historical case，未來改碼要同時 cross-reference。

3. **CLAUDE.md rule #8「silent-bug CI gate practice」**：把 invariant table 模式記錄成方法論。任何 silent failure pattern（沒 FHIR validator catch、沒 runtime error、只有錯 routing）都該對應一張 expectation table + 一個 invariant test。

### 不影響其他 SMART app（含非我們開發的）

| 假設 app 行為 | v0.13.0 影響 |
|---|---|
| 用 LOINC code 做 analyte 分組 | 無影響（Coding.code 完全不變） |
| 用 LOINC display 做顯示 | 無影響（Coding.display 完全不變） |
| 用 effectiveDateTime 排時間軸 | 無影響（仍用 reaL_INSPECT_DATE） |
| 用 obs.code.text 做 UI label | 12 CBC LOINCs 在 clean match 時更乾淨（"Hb" 統一）；其他 LOINC 完全不變 |
| 用 obs.code.text 做 alias 比對 | 12 CBC LOINCs 在 clean match 時可省 alias 表；canary case 還是看到 raw display |
| 不認識 nhi-visit-date / nhi-source-channel tag | 自動忽略，無 side effect |

---

## 0.12.6 重點 — 2026-05-29

**🧹 Pre-submission housekeeping — Chrome Web Store 上架前小整理**

純 doc / test / release infra polish，**沒有任何 mapper 或 extension runtime 行為改動**。為了送 Chrome Web Store 把幾個「之前沒同步到」的版本標籤、快照、跟 listing 文件對齊到當前版本，順手把 v0.6.6 開始就 stale 的 GitHub release notes 治根修掉。

### 🩹 治根 — release.yml 不再 ship v0.6.6 時代的 stale notes

**問題**：v0.6.6 → v0.12.5 一路 13 個 release 的 release page body 都是同一坨「v0.6.6 → v0.5.0」的 hardcoded 古早 release notes，加上 GitHub 自動產的 commit list。CHANGELOG.md 寫的內容根本沒上 release page。

**Root cause**：v0.6.4 / v0.6.6 那年 inline `body: |` rich-markdown 把 GitHub Actions YAML parser 整壞兩次（release 不會 publish、workflow 名稱顯示成 file path 等等）。當時的對策是把 body 寫死成「minimal placeholder + post-release 手動 `gh release edit -F notes.md` 補真實 notes」。問題是 `body: |` 並沒有真的 minimal——是當時 v0.6.6 寫滿了 8 個版本的 release notes 直接 commit，然後從此沒人執行那個 "post-release 手動補" step。每次 tag push 就忠實地把 v0.6.6 時凍結的快照重貼到當版 release。

**修法**：
- `body: |`（300+ 行 hardcoded）→ `body_path: /tmp/release-notes.md`
- 新增 step「Extract CHANGELOG entry for this version」— awk 從 CHANGELOG.md 切出當前版本段（heading `## X.Y.Z 重點` 到下一個 `## X.Y.Z` 為止，自動 trim 尾端 `---` + 空行）
- 用 `body_path:` 餵 file 給 `softprops/action-gh-release@v2`，bypass YAML parser，原本怕的 parser 問題自動消失
- 同時 `generate_release_notes: false`（CHANGELOG entry 已是 curated notes，auto commit list 只是重複）

**Backfill**：v0.10.0 → v0.12.5 的 20 個 release 同時用 `gh release edit --notes-file` 補回真正的當版 CHANGELOG content。CHANGELOG.md 本來就完整、release page 只是 cosmetic 落後。

### 改了什麼

| 檔案 | 內容 |
|---|---|
| `.github/workflows/release.yml` | `body: \|`（300+ 行 hardcoded v0.6.6 era notes）→ `body_path: /tmp/release-notes.md` + awk-extract step 從 CHANGELOG.md 切當前版本段 |
| `docs/SECURITY_FOR_USERS.md` | 版本字串從 `v0.11.4` (2026-05-27) → `v0.12.6` (2026-05-29) — 落後 4 個 minor 沒同步 |
| `docs/CHROME_STORE_LISTING.md` | 上架 zip 檔名 / checklist 從 `v0.12.5` → `v0.12.6` |
| `extension/tests/adapters.test.js` | `toEqual` 期望加入 `nhi_source_channel: "A"` + `nhi_source_channel_name: "特約醫事機構不定期上傳"`（v0.12.3 加 NHI 通道後快照沒更新） |
| `extension/tests/__snapshots__/...` | 同上，inline snapshot 自動更新 |
| `README.md` | 加 🛒 Chrome Web Store 上架佔位連結（拿到 Unlisted URL 後覆蓋） |
| 4 個 version files | `extension/src/manifest.json` + `extension/package.json` + `backend-ts/package.json` + `extension/dist/manifest.json`（auto by build）→ `0.12.6` |

並 backfill GitHub release pages v0.10.0 → v0.12.5 — 20 個 release 用 `gh release edit --notes-file` 一次補回當版 CHANGELOG content。

### 驗證

- ✅ Extension test: **142/142 passed**
- ✅ Backend-ts test: **422/422 passed**（修了 better-sqlite3 ABI 不匹配，比原本 406 多出 16 個之前載入失敗的 integration tests）
- ✅ Mapper test: covered via backend-ts bundle-quality regression suite
- ✅ 沒動 `packages/mapper/src/`、`extension/src/popup.js`、`background.js`、`nhi-adapters.js` 任何 runtime 邏輯
- ✅ release.yml local YAML lint: pass

### 不在這版

- `console.warn` 留存（3 處，Manifest V3 reviewer 看不到 service worker console，無風險）
- Step 4 popup.html inline style 抽 CSS class（純 hygiene，延到 v0.13）
- GitHub Pages 啟用 + Privacy / Security URL 驗證（user 手動步驟，不需 release）
- CBC LOINC → preferred code.text canonicalization（Task #41 deferred，不影響上架）

---

## 0.12.5 重點 — 2026-05-29

**🔧 Refine v0.12.4 dedup — broaden trigger + canonical-aware grouping**

v0.12.4 上 release 之後我直接打 NHI raw API 模擬 dedup 結果，發現 v0.12.4 限制 **「只」1A+1B** 才 fire，沒處理：

| Case 樣態 | NHI raw | v0.12.4 後 bundle | 該是 |
|---|---|---|---|
| 鈉 115/01/14 1A+1B 142 mEq/L | 2 row | 1 obs ✓ | 1 obs |
| 鈉 114/05/18 2A+2B 141 mEq/L | 4 row | **4 obs ✗** | 2 obs (2A 保留) |
| K 114/05/18 2A+2B 3.6 mEq/L | 4 row | **4 obs ✗** | 2 obs |
| 06013C "Negative" 3A+3B | 6 row (3 sub-analyte 各 A+B) | **6 obs ✗** | 3 obs |
| 09140C Sugar 1A+2B 131 mg/dL | 3 row | **3 obs ✗** | 1 obs |

NHI raw 模擬：v0.12.4 還剩 273 obs，v0.12.5 → **305 surviving / 60 B dropped**（含上面 mixed multiplicity case）。

### 修正 logic

**1. Broaden trigger**：從 "exactly 1A AND exactly 1B" → "**ANY** A AND **ANY** B"

```ts
if (aRows.length > 0 && bRows.length > 0) {
  // Cross-channel pair detected → keep all A, drop all B
  out.push(...aRows);
}
```

- 1A+1B: keep 1A ✓
- 2A+2B: keep 2A (multi-reading from A channel)
- 3A+3B: keep 3A
- 1A+2B: keep 1A
- 2A+1B: keep 2A
- 0A+2B: preserve (pure B, no cross-channel)
- 2A+0B: preserve (pure A double-upload)

**2. Canonical-aware grouping for panel codes**

`PANEL_LOINC_MAP` keys (`DISPLAY_FIRST_CODES`) 是 multi-analyte 的 panel — sub-analyte 可能 accidentally 同 value (e.g. 06013C urinalysis 3 個 sub-analyte 都 "Negative" mg/dL)。**Naive 同 value 分組會誤合**：把 Bilirubin A drop 跟 亞硝酸鹽 B drop 一起。

Fix：multi-analyte panel 的 group key 多加 `canonicalLabKey(display, code)`，依 sub-analyte 拆 group：

```ts
const isPanel = DISPLAY_FIRST_CODES.has(code);
const canonical = isPanel ? canonicalLabKey(display, code) || display.toLowerCase() : "";
const key = `${code}|${date}|${hospital}|${value}|${unit}|${canonical}`;
```

- 06013C Bilirubin/膽紅素 → URINE_BILIRUBIN canonical → 1 group → keep A
- 06013C Ketone/酮體 → URINE_KETONE canonical → 1 group → keep A
- 06013C Nitrite/亞硝酸鹽 → URINE_NITRITE canonical → 1 group → keep A
- 09021C 鈉 (NOT panel) → canonical="" → all 鈉 同 value 在一個 group → A+B dedup as expected

### Bundle output (user 2025-05-18 case)

v0.12.4: 4 obs (2 fake duplicates)
v0.12.5: 2 obs (multi-reading from A only)

### CI 守門（3 個新 v0.12.5 tests）

- 2A+2B 同 value → 2 obs (keep both A's)
- 06013C 3A+3B 同 "Negative" 3 個 sub-analyte → 3 obs (canonical-split)
- 1A+2B asymmetric → 1 obs (keep A, drop both B)

### Files

- `packages/mapper/src/observation.ts` — `dedupNhiCrossChannelPairs()` broaden trigger + canonical-aware key for panel codes

---

## 0.12.4 重點 — 2026-05-29

**🔧 BREAKING（語意上）— Bridge 現在 dedup NHI A+B structural pairs**

User clarification 推翻 v0.12.3 的 strict-no-dedup 設計：

> 你要考量到這份 fhir json 可能給其他非我開發的 smart app 使用，如果把 dedup 的責任都放在 app 端，會有大問題。你有忠實搬運，但不能明明 UI 顯示只有一筆你抓了兩筆。

關鍵 insight：bundle 給**所有** SMART app 用（不只 MediPrisma）。如果 bridge ship 2 obs per A+B pair，每個 downstream consumer 都要自己實作 source-channel dedup — 違反 FHIR interoperability 本意。NHI multi-channel 是 NHI 設計上的 artifact，不是真實 multi-reading，bridge 該幫所有 consumer 處理掉。

### 修訂 dedup rule

從 **strict-no-dedup**（CLAUDE.md v0.12.1）改成 **targeted dedup**：

| 重複類型 | v0.12.4 行為 | 理由 |
|---|---|---|
| **A+B structural pair**（同 code/date/hospital/value/unit）| **dedup → keep A** | NHI multi-channel artifact，邏輯上同一個 measurement |
| Same-source double-upload（A+A or B+B）| 保留全部 | NHI 上傳 N 次 = N 個 upload event，真實多筆 |
| 不同 value | 保留全部 | Legitimate multi-reading（ICU 同 day 兩抽等）|
| 不同 code/date/hospital/unit | 保留全部 | 不同 measurement |

Bridge 不會用 clinical judgement 判斷 dedup — 只消除 NHI 自己的 structural duplicate（A+B 上傳同一筆）。

### Implementation

新 helper `dedupNhiCrossChannelPairs()` 接在 `mapObservationsGrouped` 內，**`filterLabRows` 之後、`groupByOrderCode` 之前**：

```ts
// Group by (code, date, hospital, value, unit)
// If group has exactly 1 A row + 1 B row → keep A
// Otherwise preserve all
```

`stableId` 還是包 source channel — defensive for edge cases dedup 沒 fire 的 (e.g. 只有 A, 或 A+B 不同 value)。

### `Observation.meta.tag` 還在但語意改變

v0.12.3 加的 `meta.tag` (system `http://nhi-fhir-bridge/nhi-source-channel`, code A/B) 保留 — 但**不再是要求 app 自己 dedup 的 signal**，而是 informational metadata for consumers who want to know which channel sourced the surviving obs。

### Bundle 變化（user 的鈉 case）

v0.12.3 bundle:
```jsonc
[
  { code: "Na", value: 142, refRange: "[136-146]", meta.tag: [{ code: "A" }] },
  { code: "鈉", value: 142, refRange: "[無]",      meta.tag: [{ code: "B" }] }
]
```

v0.12.4 bundle:
```jsonc
[
  { code: "Na", value: 142, refRange: "[136-146]", meta.tag: [{ code: "A" }] }   // ← B dropped
]
```

### CLAUDE.md 更新

- Rule #7 從「strict no-dedup」改成「targeted dedup」
- NHI multi-channel A/B section 更新：dedup 在 bridge 端完成
- Audit 規則更新：先 check pair 是不是 cross-channel；如果是 → 該被 bridge dedup 掉，沒被 dedup 是 bug；如果同 source → faithful preservation 正確

### FHIR R4 compliance audit ✅

- Observation 數量變動跟 NHI 結構一致 — 不違反 FHIR R4 modelling principle
- `Observation.meta.tag` 用法跟之前一致（spec-defined channel for source metadata）
- A row 被選為 surviving 是因為 numeric refRange 更 clinically useful — 不影響 FHIR resource validity
- `stableId` 維持 syntactic constraint

### CI 守門（4 個 v0.12.4 + 修 v0.12.3 兩 test）

- 翻 v0.12.3 "A+B pair → 2 obs" → v0.12.4 "A+B pair → 1 obs (keep A)"
- 翻 v0.12.3 "Strict-no-dedup A+B both survive" → v0.12.4 urinalysis A+B → 1 obs (keep A)
- 新：09099C Troponin I same-source A+A double-upload → 保留（NOT deduped）
- 新：不同 value A+B → 保留兩 obs（multi-reading）

### Files

- `packages/mapper/src/observation.ts` — 新 `dedupNhiCrossChannelPairs()` helper；接到 `mapObservationsGrouped` 在 `filterLabRows` 之後
- `CLAUDE.md` — rule #7 全面 revise；NHI multi-channel section 更新
- `backend-ts/tests/unit/bundle-quality.test.ts` — v0.12.3 兩 test 翻邏輯；新 v0.12.4 same-source preservation + different-value preservation 兩 test

---

## 0.12.3 重點 — 2026-05-29

**🔎 直接打 NHI raw API 確認 — 113 對 duplicate 不是 bridge bug，是 NHI multi-channel design**

App dev v0.12.1 報 113 對 "duplicate" 跟 user "verified 健保存摺 只有 1 row" 並列 — 我直接連到 NHI `/api/ihke3000/ihke3409s01/page_load` 看 raw JSON：

| 統計 | 數字 |
|---|---|
| Raw row 總數 | 365 |
| **A+B pair（不同 channel 同 measurement）** | **92** |
| 同 source double-upload | 4 |
| Mixed triples | 7 |
| 2026-05-25 鈉（user 確認 UI 1 row）| raw 真的 1 row ✓ |

NHI 真的把同 measurement 用兩個 channel ship：
- **A** = `特約醫事機構不定期上傳` — 即時，常配英文 display + numeric refRange
- **B** = `特約醫事機構定期上傳` — 批次，常配中文 display + `[無][無]` text refRange

NHI UI 對某些 panel family（chem panel 鈉/K/Ca/Cr）會視覺上 dedup 顯示，user 看時只看到 1 row；其他 panel（06013C 尿生化）則並列顯示 2 row。**API 一律 ship 兩筆**，UI dedup 不一致。

→ Bridge 完全 faithful，113 對 "duplicate" 是 NHI multi-channel 結構，per CLAUDE.md strict-no-dedup rule **不該** 合掉。

### v0.12.3 修法

**1. Scraper (`adaptLabItem`) pass `orI_TYPE` through**：
```js
return {
  ...
  nhi_source_channel: String(item.orI_TYPE || '').toUpperCase() || null,
  nhi_source_channel_name: String(item.orI_TYPE_NAME || '') || null,
};
```

**2. Mapper emit as `Observation.meta.tag`**：
```ts
const NHI_SOURCE_CHANNEL_SYSTEM = "http://nhi-fhir-bridge/nhi-source-channel";

function appendNhiSourceChannelTag(resource, raw) {
  const code = String(raw.nhi_source_channel ?? "").trim().toUpperCase();
  if (!code) return;
  if (!resource.meta.tag) resource.meta.tag = [];
  resource.meta.tag.push({
    system: NHI_SOURCE_CHANNEL_SYSTEM,
    code,              // "A" or "B"
    display: String(raw.nhi_source_channel_name ?? ""),
  });
}
```

接到 `buildObservation` 跟 `mapObservation` 兩 path。Bundle output 範例：

```jsonc
{
  "resourceType": "Observation",
  "meta": {
    "versionId": "1",
    "source": "nhi-fhir-bridge/scraper",
    "tag": [
      {
        "system": "http://nhi-fhir-bridge/nhi-source-channel",
        "code": "A",
        "display": "特約醫事機構不定期上傳"
      }
    ]
  },
  ...
}
```

**3. `stableId` 加入 NHI source channel**：A+B 同 canonical/code/date/hospital/value/unit 但不同 channel 之前會撞在 `seenObsIds` step → 合成 1 obs。加 source 進 hash → 兩 obs 都 survive，符合 strict-no-dedup。

```ts
const obsId = stableId(
  patientId, "obs", canonical, raw.date ?? "", raw.hospital ?? "",
  code, String(raw.value ?? ""), String(raw.unit ?? ""),
  String(raw.nhi_source_channel ?? ""),   // v0.12.3 新增
);
```

**4. CLAUDE.md 加 NHI multi-channel 章節**：未來 audit "bundle has duplicate" 先 check pair 的 `orI_TYPE` 是否不同 — 是的話 NHI multi-channel，bridge 正確。

### App dev report 結論

92 of 113 pair 是 NHI A+B pair（不是 bridge artifact）；4 是同 source double-upload（NHI 自己給 2 row）；7 是 triple；剩下 ~10 大概其他 hospital quirk。**SMART app 可以 pivot by `meta.tag` source channel 做 informed dedup**（例如「prefer A when both exist」）— bridge 提供結構，app 決定行為。

### FHIR R4 compliance audit ✅（per CLAUDE.md）

- `Observation.meta.tag` 是 FHIR R4 spec-defined 標準 metadata 欄位（[R4 reference](https://hl7.org/fhir/R4/resource.html#Meta)）
- Tag system URL bridge-namespaced (`http://nhi-fhir-bridge/nhi-source-channel`)，code/display 來自 NHI raw verbatim — round-trip 不丟資訊
- `stableId` 加新 hash input 不影響 Resource.id 結構（仍 SHA1 hex ≤64 chars）
- No dedup / drop — strict-no-dedup rule 完整守住，stableId 加 source 是 **enable** 保留不是 dedup

### CI 守門（4 個新 regression tests）

1. Single obs from source A gets `meta.tag` with code "A"
2. A+B pair from same draw → **2 distinct obs**，sources 排序 = ["A", "B"]
3. Obs without `nhi_source_channel` field omits the tag（沒亂塞空 tag）
4. **Lock**：strict-no-dedup — A+B Glucose/尿糖 同 value 4+ (2000) 同 date 同 hospital → 還是 2 obs（不會 dedup）

### Files

- `extension/src/nhi-adapters.js` — `adaptLabItem` pass `nhi_source_channel` + `nhi_source_channel_name`
- `packages/mapper/src/observation.ts` — `appendNhiSourceChannelTag()` helper + `NHI_SOURCE_CHANNEL_SYSTEM` constant；hook into `buildObservation` + `mapObservation`；`stableId` 加 source 參數
- `CLAUDE.md` — NHI multi-channel A/B 完整章節
- `backend-ts/tests/unit/bundle-quality.test.ts` — v0.12.3 describe block (4 tests)

---

## 0.12.2 重點 — 2026-05-29

**🪞 v0.12.1 audit 後 mirror fix + 尿蛋白 Ord/Qn structural routing**

SMART app dev 對 v0.12.1 bundle audit 抓到 3 件事：
1. **Bug 5'/6'/7' mirror miss**：CBC diff variants 加到 08013C 跟 CBC 兄弟 codes 但**沒**加 08011C (CBC-8項 panel) — 中國北港醫雙billing 在 08011C 那份還是 fall back 6690-2
2. **Bug 10 wrong slot**：v0.12.1 把尿肌酸酐 variants 加到 09015C，但 raw data 是 **06013C** 06013C panel
3. **新發現**：LOINC 20454-5 是 dipstick presence (Property=PrThr, Scale=Ord)，但 bundle 上 quantitative `48 mg/dL` 數字也 route 到 20454-5 → 結構錯，FHIR R4 LOINC scale mismatch

### Bug 5'/6'/7' mirror — `CBC_DIFF_KEYS` spread 到 08011C

之前我 v0.11.11 加 `...CBC_DIFF_KEYS` 到 08013C 和 CBC siblings (08002/3/4/6C)，但**漏了** 08011C (CBC umbrella)。中國北港醫 ship 同 row 在 08013C 跟 08011C 兩 panel 下 — 08013C 那份對，08011C 那份還是 6690-2 panel default。

```ts
"08011C": {
  ... 紅血球 indices ...
  ...CBC_COMPONENT_KEYS,
  ...CBC_DIFF_KEYS,   // ← v0.12.2 加
}
```

5 row 修對。Side effect 提醒：raw 兩 panel 下都有同 5 row → bundle 會 emit 10 obs（5 對對）。Faithful transport，app side dedup。

### Bug 10 mirror — 尿肌酸酐 variants 加到 06013C

v0.12.1 加到 09015C 是預期 hospital 用 09015C billing 把尿肌酸酐塞進去。實際 raw data 是 06013C（尿生化 panel）—  PANEL_LOINC_MAP["06013C"] 沒 urine creatinine 變體，bare `肌酸酐` (LOINC_MAP global) → 2160-0 serum。

```ts
"06013C": {
  ...
  // v0.12.2 mirror
  "肌酸酐(尿液)(半定量)": "2161-8",
  "肌酸酐(尿液)": "2161-8",
  "肌酸酐(尿)": "2161-8",
  "creatinine(u": "2161-8",  // ← 結尾不收 `)` 避開 \b regex 邊界 issue
  "creatinine(urine": "2161-8",
  ...
}
```

ASCII `(` 結尾 key 的 \b 邊界陷阱 跟 v0.11.13 APTT ratio 同 issue — 用「不收 `)` 的形式」當 key（regex `\bcreatinine\(u\b` 跟 word char `u` 結尾 \b 成立）。

### 尿蛋白 structural routing — 3-class dispatch

WebFetch loinc.org 2026-05-29 確認 2888-6：
- Long Common Name: **"Protein [Mass/volume] in Urine"**
- Component: Protein
- Property: **MCnc** (Mass concentration)
- System: Urine
- Scale: **Qn** (Quantitative)
- Class: UA

跟 20454-5（PrThr/Ord, dipstick）是不同 LOINC，scale 不同。Bridge 之前一律 route 20454-5 — quantitative 值塞 Ord LOINC = FHIR R4 結構錯。

**新 helper `urineProteinLoincFix()`** 3-class dispatch:

```ts
const URINE_PROTEIN_COMBINED_RE =
  /^(?:[\d.]+\+|trace|positive|negative|\+|-)\s*[(（]/i;
const URINE_PROTEIN_NUMERIC_RE = /^[\d.]+$/;
const URINE_PROTEIN_MASS_UNIT_RE = /^mg\s*\/\s*d\s*l$/i;

function urineProteinLoincFix(loinc, value, unit) {
  if (loinc !== "20454-5") return loinc;
  const v = String(value ?? "").trim();
  const u = String(unit ?? "").trim();
  // "4+ (2000)" / "Trace (15)" — 試紙條 grade + 括號內 mg/dL approx
  if (URINE_PROTEIN_COMBINED_RE.test(v)) return "20454-5";
  // 純 numeric + mg/dL
  if (URINE_PROTEIN_NUMERIC_RE.test(v) && URINE_PROTEIN_MASS_UNIT_RE.test(u)) {
    return "2888-6";  // ← upgrade to Qn LOINC
  }
  return "20454-5";  // Negative / Trace / 1+ etc
}
```

跟 v0.11.13 9a (`structuralLoincFix` INR-sec→PT reroute) 同模式 — LOINC 跟 value/unit 結構對不上時自動修 LOINC。

接到 `buildObservation` + `mapObservation` 兩條 path。

**新增 LOINC_DISPLAY + LOINC_SHORT_TEXT entries** for 2888-6：
- `LOINC_DISPLAY["2888-6"] = "Protein [Mass/volume] in Urine"` (canonical Long Common Name)
- `LOINC_SHORT_TEXT["2888-6"] = "Urine Protein"` (同 20454-5 短 label，SMART app pivot 看同個 column header 「Urine Protein」，LOINC code 區分 scale)

### Bundle 預期影響

App dev v0.12.1 bundle 6 個 obs 在 20454-5 + quantitative value，v0.12.2 之後：
- 純 numeric + mg/dL rows → 2888-6（structurally correct）
- 純 dipstick (Negative/Trace/1+) → 20454-5（不變）
- combined "4+ (2000)" → 20454-5 + valueString（不變）

### FHIR R4 compliance audit ✅

- `Coding.display` 全部 verified LOINC Long Common Name (2888-6 WebFetch verified)
- `Coding.code` reroute 還是 valid LOINC（20454-5 → 2888-6 都在 LOINC_DISPLAY）
- `CodeableConcept.text` LOINC_SHORT_TEXT 兩 LOINC 同 label「Urine Protein」對 SMART app 友善
- FHIR R4 Observation modeling: Qn LOINC 配 valueQuantity / Ord LOINC 配 valueString = ✓ scale 一致
- **沒有任何 dedup or drop**（per CLAUDE.md strict rule）

### CI 守門（8 個 v0.12.2 regression tests）

1. CBC diff 5 個 display (Basophils/Eosinophils/Lymphocytes/Monocytes/Neutrophilic Segment) 在 **08011C** panel routes 對
2. Bare diff CJK (嗜鹼性白血球 / 嗜酸性白血球 / 淋巴白血球) 在 08011C 也對
3. 肌酸酐(尿液)(半定量) / 肌酸酐(尿液) / 肌酸酐(尿) 在 06013C → 2161-8
4. ASCII Creatinine(U) / Urine Creatinine 在 06013C → 2161-8
5. Quantitative urine protein (48 mg/dL) → 2888-6 + valueQuantity + code.text = "Urine Protein"
6. Qualitative (Negative / Trace / 1+ / 2+ / 3+) → 20454-5 + valueString
7. Combined "4+ (2000)" / "Trace (15)" / "1+ (30)" → 20454-5 + valueString
8. Coding.display 跟 LOINC Long Common Name 一致（兩個 LOINC 都驗）

### Files

- `packages/mapper/src/loinc-tables.ts` — `PANEL_LOINC_MAP["08011C"]` 加 `...CBC_DIFF_KEYS`；`PANEL_LOINC_MAP["06013C"]` 加尿肌酸酐 9 變體；`LOINC_DISPLAY["2888-6"]` + `LOINC_SHORT_TEXT["2888-6"]`
- `packages/mapper/src/observation.ts` — `urineProteinLoincFix()` helper + `URINE_PROTEIN_*` constants；接到 `buildObservation` + `mapObservation`
- `backend-ts/tests/unit/bundle-quality.test.ts` — 4 個 `describe` block，8 個 v0.12.2 tests

---

## 0.12.1 重點 — 2026-05-29

**📐 SMART app dev v0.11.13 bundle audit 收尾 + 嚴格 no-dedup rule + 順手抓到 微白蛋白 routing bug**

User 收到 app dev v0.11.13 audit report — ~280 bug records → ~26 records (90% reduction)，剩 5 個 narrow edge case。同時 user **明確重申 faithful transport rule**：bridge 不該判斷 LIS 重複，全由 user / app 判斷。v0.12.1 一次處理。

### Bug 5'/6'/7' — CBC parenthetical EN(中文) 走錯路（routing fix）

某醫院 2024-01-22 records 用 `"Basophils(嗜鹼性白血球)"` / `"MCV(平均紅血球容積)"` 這種 EN(CJK) 格式 ship，user 的 v0.11.13 bundle 看到這 9 row 都掛 panel-default LOINC (6690-2/4544-3/718-7/789-8) 而不是 analyte 對的 (706-2/787-2 等)。雖然理論上現有 keyword routing 該抓到，但 defensive 加 9 個明確的 parenthetical EN(中文) keys 到 `CBC_DIFF_KEYS` + `CBC_COMPONENT_KEYS`，longest-match 保證走對路。CI test 把每 9 個 display 鎖住。

### Bug 10 — `肌酸酐(尿液)(半定量)` 走到 serum LOINC（routing fix）

`PANEL_LOINC_MAP["09015C"]` 之前只有 `肌酸酐: "2160-0"` (serum)。Hospital ship `"肌酸酐(尿液)(半定量)"` 時 longest-match 仍然只抓到 3-char `肌酸酐`，落到 serum LOINC。加 urine annotation variants:

```ts
"09015C": {
  ...
  "肌酸酐(尿液)(半定量)": "2161-8",  // urine creatinine
  "肌酸酐(尿液)": "2161-8",
  "肌酸酐(尿)": "2161-8",
  "肌酸酐(u)": "2161-8",
  // ... + creatinine(u), creatinine(urine), urine creatinine, etc
  肌酸酐: "2160-0",  // 保留 generic serum default
}
```

7-char `肌酸酐(尿液)(半定量)` 比 3-char `肌酸酐` 長 → 走 urine LOINC 2161-8 ✓

### Bug 8' — `全蛋白` DR title 套到 urine protein（label fix）

09040C panel 沒 `NHI_TO_LOINC` mapping（specimen-ambiguous catalog name 全蛋白可指 serum 或 urine TP）。Single-obs urine 案例 obs 正確路到 LOINC 20454-5 但 DR title 是 ambiguous `全蛋白`。

**Fix 2 件事：**
1. `LOINC_SHORT_TEXT["20454-5"] = "Urine Protein"` — 用 clean 英文 specimen-explicit label
2. `groupByOrderCode` panelLoinc 解析改成：先看 `NHI_TO_LOINC[code]`，若沒有但 **所有 obs 共用同一 LOINC**，用該 LOINC 當 panelLoinc → 走 `LOINC_SHORT_TEXT` 路徑 → DR title = `"Urine Protein"`

09040C 單 row urine TP → DR.code.text = `"Urine Protein"`，obs.code.text = `"Urine Protein"`，DR coding[nhi].display 還是 catalog-faithful `"全蛋白"`。

### Bug 4' + 9' — App dev 提的 LIS dup 兩 case 一概 **不修**（嚴格 no-dedup）

App dev 想我們 drop "structurally impossible" 跨污染 (Rh value 跑到 ABO LOINC) 跟 same-value INR duplicate。我們**不修**：

- ICU patient 一天可能同 value 抽兩次
- 健保存摺真的看到 N row → bundle 必須 emit N obs
- Bridge 不該判斷 LIS 是不是真的重複或結構錯，**user / app 判**

CLAUDE.md memory rule 補強三條明確禁止：
1. Post-emission Observation dedup by `(LOINC, value, date, hospital)` ❌
2. Drop "structurally impossible" value (例 ABO obs value=`+`) ❌
3. Collapse placeholder unit-differing rows ("空白空白" vs "-") ❌

只兩個 exception 允許：LOINC 對應修正 + specimen quality flag 過濾。

### 9c partial revert — `dedupeCrossFormat` key 用 raw unit

v0.11.13 9c 把 placeholder unit "空白空白" / "-" normalize 成 empty **before** dedup key — 副作用：兩 LIS row 差只 placeholder encoding → 合成 1 obs。這違反新嚴格 rule（bridge 判斷 "兩 placeholder = 同義"）。

```ts
// v0.11.13 (revoked v0.12.1)
const unit = PLACEHOLDER_UNIT_RE.test(rawUnit) ? "" : rawUnit;

// v0.12.1 (current)
const unit = rawUnit;  // 用 raw 字串
```

unit cleanup (`_canonicalizeUnit`) 還是做（FHIR R4 Quantity.unit 該 valid UCUM 或缺省），但在 obs 構造階段才動 — 不影響 dedup。

**附帶：stableId 也加 raw unit**。兩 row 同 canonical/code/date/hospital/value 但 raw unit 不同 → 不同 stableId → 都 survive，不被 `seenObsIds` 合掉。

### 順手抓到：微白蛋白 routing 一直走錯（pre-existing bug）

跑 v0.11.7 urinalysis 20-row 測試時被 `LOINC_SHORT_TEXT["20454-5"]` 新增曝光：`微白蛋白(尿)(半定量)` 跟 `微白蛋白/肌酐酸比值(半定量)` 兩 row **一直**透過 PANEL_LOINC_MAP["06013C"] 的 bare `蛋白` key 路到 20454-5 (urine TP)。其實該是：

- `微白蛋白(尿)` → 14957-5 (Microalbumin)
- `微白蛋白/肌酐酸比值` → 14959-1 (UACR — Microalbumin/Creatinine ratio)

Pre-existing bug：obs.code.text 之前 fall back 到 display 所以 "微白蛋白(尿)(半定量)" 看起來對，但 LOINC 其實錯。v0.11.7 test 沒 assert LOINC 所以沒抓到。LOINC_SHORT_TEXT 觸發 → text 變 "Urine Protein" → test 失敗 → bug 曝光。

加 7 個 longer specific keys 到 `PANEL_LOINC_MAP["06013C"]`：

```ts
微白蛋白: "14957-5",
"微白蛋白(尿)": "14957-5",
"微白蛋白(尿)(半定量)": "14957-5",
"微白蛋白/肌酐酸比值": "14959-1",
"微白蛋白/肌酐酸比值(半定量)": "14959-1",
"肌酐酸比值": "14959-1",
// ... 等
```

Longest-match 蓋過 bare `蛋白` (2 char)。

### FHIR R4 compliance audit ✅（per CLAUDE.md）

- `Coding.display` 全部還是 verified LOINC Long Common Name（rules of system）
- `Quantity.unit` 仍清掉 placeholder string（FHIR R4 要求 UCUM-valid 或 absent）
- `CodeableConcept.text` free-form 改寫 OK
- Bridge **沒** dedup based on judgement（嚴格 no-dedup rule）

### CI 守門（新增 9 個 + 翻 v0.11.13 兩 dedup test）

**翻測試**：v0.11.13 `9c → 1 obs` 跟 `4-row → 2 obs` 兩 test 都翻成 v0.12.1 `→ 2/4 obs（faithful）`。
新增：
1. ABO/Rh cross-contamination 4 raw → 4 obs（bridge 不判斷 value validity）
2. 9 CBC parenthetical displays 路到正確 LOINC
3. 肌酸酐(尿液)(半定量) → 2161-8（urine）
4. 普通肌酸酐 → 2160-0 serum 沒 regression
5. 09040C single-obs urine protein DR.code.text = "Urine Protein"

更新 v0.11.7 urinalysis test：20 raw → 17 obs（2 個 placeholder-unit cross-language pair 都 survive）+ `texts` 同時含 Color/顏色、Blood/尿潛血。

### Files

- `packages/mapper/src/loinc-tables.ts` — `CBC_DIFF_KEYS` + `CBC_COMPONENT_KEYS` 加 9 個 parenthetical EN(CJK)；`PANEL_LOINC_MAP["09015C"]` 加 urine creatinine variants；`PANEL_LOINC_MAP["06013C"]` 加 7 個微白蛋白/UACR longer keys；`LOINC_SHORT_TEXT["20454-5"] = "Urine Protein"`
- `packages/mapper/src/observation.ts` — `dedupeCrossFormat` key 改用 raw unit；`stableId` for obs 加 raw unit；`groupByOrderCode` panelLoinc 解析加 "all-obs-share-one-LOINC" fallback
- `CLAUDE.md` — strict no-dedup rule 補三條明確禁止 + 兩 exception
- `backend-ts/tests/unit/bundle-quality.test.ts` — 翻 v0.11.13 9c 兩 test；新 v0.12.1 describe blocks (9 tests)；更新 v0.11.7 urinalysis test

---

## 0.12.0 重點 — 2026-05-29

**🔍 Legacy LOINC_DISPLAY sweep — 補 46 entries + audit 抓到 7 個錯 / 失效 LOINC mappings**

v0.11.12 audit 留下 52 個 pre-existing legacy LOINCs 缺 LOINC_DISPLAY entries — Coding.display fallback 到 row display 不是 LOINC Long Common Name，違反 FHIR R4 "Coding.display follows rules of the system"。v0.12.0 一次清掉。

### 全部 52 個 WebFetch loinc.org 驗（per 新規矩）

每個 LOINC 都上 loinc.org 拿 canonical Long Common Name。過程中又抓到 **7 個錯/失效 mapping**：

| NHI code | 之前 LOINC | loinc.org 真實意義 | 動作 |
|---|---|---|---|
| 12184C CMV DNA quant PCR | 88157-3 | Microscopic observation in Semen by Acid fast stain | 移除（unmap）|
| 22001C 純音聽力檢查 | 45498-3 | Hearing [Minimum Data Set] (MDS survey) | 移除 |
| 22015B 詐聾聽力檢查 | 45498-3 | (同上) | 移除 |
| 22025B 自記聽力檢查 | 46530-2 | Sensory status [OASIS survey] | 移除 |
| 13025C 抗酸性濃縮抹片染色檢查 | 29260-7 | Monocytes Abnormal [#/volume] in Blood | 移除 |
| 13026C 抗酸菌培養 | 29553-5 | Age calculated | 移除 |
| 08075C Osmolality | **2692-7** | **LOINC 不存在**（typo）| **替換為 2692-2** "Osmolality of Serum or Plasma" |

7 個都跟 v0.11.9 D 修 5894-1 一樣同模式 — 之前歷史 mapping 錯標。leaving unmapped 或 typo fix。每個都加 inline audit comment 註明 loinc.org 驗證日期 + 真實意義。

### 46 個 LOINC_DISPLAY 新增 entries

分類：
- CBC differential 5 個（706-2 / 713-8 / 736-9 / 770-8 / 5905-5）
- Tumor markers 7 個（AFP 1834-1 / CEA 2039-6 / PSA 2857-1 / PR 10861-3 / Free PSA 10886-0 + 83113-1 / CA19-9 24108-3）
- 肝炎/Virology 4 個（HBsAg RIA 5197-9 / Lactate 14118-4 / Flu B Ag 80383-3 / COVID Ag 94558-4）
- Immunology 8 個（ANA 5048-4 / VDRL 5292-8 / Kappa/Lambda 15189-4 / Cryptococcus Ab 16124-0 / ANCA 17351-8 / WBC 20584-9 / BM diff panel 47286-0 / FLC+IFE panel 95801-7）
- Pathology IHC 5 個（HER2 18474-7 / ER 14130-9 / Reticulocyte 14196-0 / Bilirubin ratio 35672-5 / PD-L1 83052-1）
- ABG/Pulmonary 2 個（ABG panel 24341-0 / IgG skin 44596-5）
- Chemistry 13 個（Base excess venous 1927-3 / Ca ionized 1995-0 / FOBT 14563-1 / Ferritin 2276-4 / IgA 2458-8 / IgG 2465-3 / TIBC 2500-7 / Osmolality 2692-2 / Phosphate 2777-1 / Free testosterone 2991-8 / Lipase 3040-3 / IgE 19113-0 / Mg 19123-9）
- Stool/GI 1 個（iFOBT 58453-2）
- Microbiology 1 個（Blood culture 600-7）
- SPE panel 1 個（90991-1）

每個 Long Common Name 都是 loinc.org canonical 原文 verbatim。

### CI Coding.display invariant 守門（v0.12.0 永久 lock）

新增 3 個 structural invariant tests：
1. 每個 NHI_TO_LOINC value 都必須 in LOINC_DISPLAY
2. 每個 PANEL_LOINC_MAP value 都必須 in LOINC_DISPLAY
3. 每個 LOINC_MAP value 都必須 in LOINC_DISPLAY

之後任何加 LOINC 但忘記 LOINC_DISPLAY entry 的 PR 都會被擋下。FHIR R4 compliance 不會回頭破。

### FHIR R4 compliance audit ✅（per memory checklist）

- ✅ Coding.display 全部來自 verified Long Common Name（rules of the system）
- ✅ 錯 mapping 全部 unmap，fall back 到 NHI-coding-only（safer than 錯標 LOINC）
- ✅ Invalid LOINC（2692-7 不存在）替換為 valid LOINC（2692-2）
- ✅ Faithful transport — LOINC 對應修正允許；patient value/date/hospital/unit 完全沒動

### Files

- `packages/mapper/src/loinc-tables.ts` — NHI_TO_LOINC 移除 6 個錯 mapping + audit comments + 08075C typo fix; LOINC_DISPLAY 加 46 entries
- `packages/mapper/src/index.ts` — export LOINC tables 給 CI invariant test 用
- `backend-ts/tests/unit/bundle-quality.test.ts` — 3 個 v0.12.0 invariant tests

### 累積收尾（v0.11.9 → v0.12.0 6 個 release 一個下午）

| Release | 主題 |
|---|---|
| v0.11.9 | APTT panel routing + blood-type multi-reading + Bug A-H |
| v0.11.10 | 9 LOINC_SHORT_TEXT + DR title 對齊 + FHIR R4 audit |
| v0.11.11 | SMART app dev v0.11.9 bundle audit 8 bugs |
| v0.11.12 | FHIR R4 follow-up: 7 LOINC_DISPLAY entries |
| v0.11.13 | Bug 9 INR/placeholder + Note 10 lockdown |
| v0.12.0 | Legacy LOINC_DISPLAY sweep (46) + 7 wrong mapping audit + CI invariant lock |

---

## 0.11.13 重點 — 2026-05-29

**🩸 Bug 9 — INR LOINC + sec unit 結構不可能 + placeholder unit pollution**

SMART app dev v0.11.10 bundle audit 報告 Bug 9：每張 PT/INR panel 都出現 3 個 LOINC 6301-6 (INR) obs：
- 1 個 value=11.9 sec ← **structurally 不可能**（INR 是 dimensionless ratio，配 sec 不對）
- 1 個 value=1.08 unit="**空白空白**" ← 真 INR 但 unit 是 LIS 編碼的 placeholder
- 1 個 value=1.08 unit="**-**" ← 同上，duplicate

三層 bug 一次拆：

### 9a — Structural LOINC validation（reroute INR-sec → PT-sec）

INR (6301-6) / APTT ratio (63561-5) / PT ratio (5894-1) 都是 dimensionless `RelTime` LOINCs（loinc.org verified）。如果 row 跑到這些 LOINC 但 unit 是 sec/s/秒 → LIS 標錯，真實 row 是 time-domain sibling。

**新 helper `structuralLoincFix()`** in observation.ts：

```ts
const RATIO_TO_TIME_LOINC: Record<string, string> = {
  "6301-6": "5902-2",   // INR → PT time
  "63561-5": "14979-9", // APTT ratio → APTT time
  "5894-1": "5902-2",   // PT ratio → PT time
};
const TIME_UNIT_RE = /^(?:sec|s|seconds?|秒)$/i;

function structuralLoincFix(loinc, rawUnit) {
  if (RATIO_TO_TIME_LOINC[loinc] && TIME_UNIT_RE.test(rawUnit)) {
    return RATIO_TO_TIME_LOINC[loinc];
  }
  return loinc;
}
```

接到 buildObservation 跟 mapObservation 兩條路徑（panel + single-row 都套）。Patient value/date/hospital/unit 沒動，只 reroute LOINC — faithful transport rule 允許 LOINC 對應修正。

### 9b — Placeholder unit cleanup

「空白空白」/「-」/「—」/「N/A」/「nil」/「無」這類 LIS 編碼的「我沒 unit」placeholder 被當 UCUM code emit 是錯的。新增 `PLACEHOLDER_UNIT_RE` 在 `_canonicalizeUnit` 開頭把它們 collapse 成 empty string。下游 `Quantity.unit` 就 0..1 缺省（FHIR R4 Quantity.unit 是 optional），對 dimensionless 分析物（INR / ratio）這是正確結構。

### 9c — 兩個 placeholder-unit INR 自動 dedup

之前 dedupeCrossFormat key 把「空白空白」跟「-」當不同字串 → 兩 row 都存活。`dedupeCrossFormat` 改成先過 `PLACEHOLDER_UNIT_RE` 再算 key → 兩 row 自動 collapse 成 1 個。9c 不用單獨修，9b 一改就連帶解決。

### Note 10 forward-compat lockdown

App dev confirm v0.11.10 APTT split (14979-9 time + 63561-5 ratio) 結構是對的，請求保留。加 regression test：08036C panel 同時收 sec + ratio 兩 row → bundle 必須產生 14979-9 AND 63561-5 兩個 obs。順便補 PANEL_LOINC_MAP["08036C"]：display "APTT (ratio)" 的 `(` 把 `\b` 邊界打掉，新增 bare "ratio" key + `aptt-ratio` variant 讓 longest-match 拿到正確 routing。

### FHIR R4 compliance audit ✅

| Change | FHIR R4 field | Verdict |
|---|---|---|
| structuralLoincFix reroute | `Coding.code` (LOINC system) | ✅ rerouted LOINC 還是 valid LOINC; LOINC_DISPLAY + LOINC_SHORT_TEXT 都 cover |
| PLACEHOLDER_UNIT_RE 清空 unit | `Quantity.unit` (UCUM) | ✅ Quantity.unit 是 0..1 — empty/missing 對 dimensionless ratio 是正確結構 |
| Added "ratio" key + "aptt-ratio" | `Coding.code` | ✅ 對應 LOINC 63561-5 已驗 |
| dedupeCrossFormat key normalisation | 內部，不碰 FHIR field | ✅ |

### CI 守門（7 個新 regression tests）

- Bug 9a：11.9 sec mistag → reroute LOINC 5902-2 PT; APTT ratio + sec → 14979-9; **defensive**: INR + {ratio} unit 不 reroute（正確 case 不動）
- Bug 9b：8 種 placeholder strings 都 collapse to empty unit
- Bug 9c：兩 placeholder-unit INR rows → 1 obs
- End-to-end bug 9 scenario：4 raw rows → 2 obs (1 PT + 1 INR) 不是 4 + INR obs 沒 sec unit
- Note 10 lockdown：08036C 同時 ship 14979-9 + 63561-5

### Files

- `packages/mapper/src/loinc-tables.ts` — PANEL_LOINC_MAP["08036C"] 加 `ratio` key + `aptt-ratio` variant
- `packages/mapper/src/observation.ts` — 新 `structuralLoincFix()` helper + `RATIO_TO_TIME_LOINC` table + `TIME_UNIT_RE`; `PLACEHOLDER_UNIT_RE` + `_canonicalizeUnit` 套用; `dedupeCrossFormat` 也套; buildObservation 跟 mapObservation 都呼叫 structuralLoincFix
- `backend-ts/tests/unit/bundle-quality.test.ts` — v0.11.13 describe blocks + Note 10 lockdown describe block (7 regressions)

### v0.12 sweep 提醒（next release）

52 個 legacy LOINCs 缺 LOINC_DISPLAY entries — 完整補需要每個 WebFetch loinc.org 驗 Long Common Name。User 確認列入 v0.12.0 處理。

---

## 0.11.12 重點 — 2026-05-29

**🔍 FHIR R4 audit follow-up — 補上 7 個漏掉的 LOINC_DISPLAY entries**

User 要求 audit v0.11.11 改動是不是 FHIR R4 compliant。逐項對照 spec 抓到一個漏的 pattern：v0.11.10 + v0.11.11 加進 NHI_TO_LOINC / PANEL_LOINC_MAP / CBC_DIFF_KEYS / CBC_COMPONENT_KEYS 的 7 個 LOINC **沒**對應加 LOINC_DISPLAY entries。

### 為什麼是 FHIR R4 違反

FHIR R4 `Coding.display` 規格寫：
> A representation of the meaning of the code in the system, **following the rules of the system.**

LOINC system 的規則是用 Long Common Name 當 display。Bridge 的 buildCodings 路徑是：
```ts
codings.push({
  system: "http://loinc.org",
  code: loinc,                       // e.g. "740-1"
  display: LOINC_DISPLAY[loinc] ?? display,  // ← LOINC_DISPLAY 沒 entry 就 fall back 到 row display
});
```

LOINC_DISPLAY 沒 entry 就用 row display（e.g. "Meta-Myelocyte" / "紅血球分佈變異數"），那是 LIS 上傳的 row label，**不是** LOINC 規定的 Long Common Name → 違反 "following the rules of the system"。

### 補的 7 個 LOINC_DISPLAY entries（全部 WebFetch loinc.org 驗過）

| LOINC | 來源 release | Long Common Name |
|---|---|---|
| 740-1 | v0.11.11 (Metamyelocyte) | Metamyelocytes/Leukocytes in Blood by Manual count |
| 764-1 | v0.11.11 (Band) | Band form neutrophils/Leukocytes in Blood by Manual count |
| 786-4 | v0.11.11 (MCHC routing) | MCHC [Entitic Mass/volume] in Red Blood Cells by Automated count |
| 787-2 | v0.11.11 (MCV routing) | MCV [Entitic mean volume] in Red Blood Cells by Automated count |
| 788-0 | v0.11.11 (RDW routing) | Erythrocyte [DistWidth] in Blood by Automated count |
| 2143-6 | v0.11.10 (Cortisol) | Cortisol [Mass/volume] in Serum or Plasma |
| 2132-9 | v0.11.10 (Vit B12) | Cobalamin (Vitamin B12) [Mass/volume] in Serum or Plasma |
| 2284-8 | v0.11.10 (Folate) | Folate [Mass/volume] in Serum or Plasma |
| 83112-3 | v0.11.10 (PSA) | Prostate specific Ag [Mass/volume] in Serum or Plasma by Immunoassay |

### 其餘 v0.11.10/v0.11.11 改動逐項 FHIR R4 verdict

| 改動 | FHIR R4 field touched | Compliance |
|---|---|---|
| Bug 1 — drop 溶血/脂血 quality flags | Bundle.entry count↓ | ✅ specimen quality 不是 patient Observation 該成立的 instance |
| Bug 2/5/6 — LOINC mapping additions | Coding.code | ✅ 全部 WebFetch verified |
| Bug 3a — T.P → 2885-2 | Coding.code, Coding.display | ✅ verified |
| Bug 3b — drop narrative rows | Bundle.entry count↓ | ⚠️ 理想是塞 DiagnosticReport.conclusion（v0.12 enhancement candidate），現在 drop 至少沒造成錯誤 patient Observation |
| Bug 4 LOINC split — 882-1 → 883-9 / 10331-7 | Coding.code | ✅ verified |
| Bug 4 multi-reading 保留 | 多個 Observation 同 code 同日 | ✅ FHIR R4 不限制每 (patient, code, date) 的 Obs 數量 |
| Bug 7 — 白血球酯脢 variant | Coding.code | ✅ 5799-2 之前已 verified |
| Bug 8 — single-obs DR.code.text propagation | CodeableConcept.text | ✅ text free-form，coding[*].display 不動 |

### 已知 pre-existing gap（不在這次 release scope）

LOINC_DISPLAY 還缺 52 個 entries（e.g. 706-2 Basophils、713-8 Eosinophils、736-9 Lymphocytes、770-8 Neutrophils、5905-5 Monocytes 等老 entries）— 這些是 v0.11.10 之前的 legacy。完整補齊需要每個 WebFetch 驗 Long Common Name（per 新規矩），規模較大 → 拉到 v0.12 sweep。本 release scope 只補 v0.11.10/v0.11.11 我自己加的。

### CI 守門

新增 4 個 v0.11.12 regression tests：
1. 740-1 Coding.display 是 Long Common Name 不是 raw "Meta-Myelocyte"
2. 764-1 Coding.display 是 Long Common Name
3. 788-0 Coding.display 是 Long Common Name 不是 raw "紅血球分佈變異數"
4. v0.11.10 Cortisol/B12/Folate/PSA 4 個 obs 的 LOINC display 都 match Long Common Name pattern (含 "[" 或 "in Serum/Blood")

### Files

- `packages/mapper/src/loinc-tables.ts` — LOINC_DISPLAY 加 7 個 entries
- `backend-ts/tests/unit/bundle-quality.test.ts` — v0.11.12 describe block, 4 regressions

---

## 0.11.11 重點 — 2026-05-29

**🧹 SMART app dev v0.11.9 bundle audit 抓到 8 種 bug pattern — 一次清掉**

SMART app dev 拿 v0.11.9 bundle（2610 entries / 1163 obs / 548 DRs）整體 audit，列出 8 個 bug category。逐項對照 user 之前確認過的 raw data 事實 + WebFetch 驗 LOINC，這版一次處理。

### 對照 audit 結論

| Bug | App dev 說法 | 我的判斷 | 修法 |
|---|---|---|---|
| 1 | 溶血/脂血 quality flags 借真 analyte LOINC | ✅ 對 | `looksLikeQualityFlag()` + `looksLikeNarrativeRow()` filter |
| 2 | Meta-Myelocyte/Band/Hct 借 57021-8 panel LOINC | ✅ 對 | CBC_DIFF_KEYS 加 740-1 (Metamyelocyte) + 764-1 (Band); CBC_COMPONENT_KEYS 加 Hct variants; PANEL_LOINC_MAP["08013C"] 加 CBC_COMPONENT_KEYS spread |
| 3a | T.P 借 90991-1 PEP panel LOINC | ✅ 對 | PANEL_LOINC_MAP["09065B"] 加 Total Protein → 2885-2 |
| 3b | `:` / `PEP-Comment` 也借 90991-1 | ✅ 對 | narrative row filter（pure punctuation + comment keywords）|
| 4 LOINC | ABO/Rh 都用 882-1（合併 code）| ✅ 對 | NHI_TO_LOINC split: 11001C → 883-9 (ABO Type); 11003C → 10331-7 (Rh Type) |
| 4 multi-reading | 「應該 panel 只 emit 1 筆 obs」 | ❌ **錯** | User 之前 raw audit 已確認健保存摺**真的**每張 panel 2 筆 reading — App dev 沒看 raw。**保留 v0.11.9 G**，不動 |
| 5 | RDW/MCV/MCH/MCHC 借 789-8 RBC count LOINC | ✅ 對 | CBC_COMPONENT_KEYS 加 紅血球分佈變異數 → 788-0 / 紅血球平均容積 → 787-2 / 紅血球色素 → 785-6 / 紅血球色素濃度 → 786-4 variants |
| 6 | 帶狀嗜中性白血球借 770-8 segment LOINC | ✅ 對 | CBC_DIFF_KEYS 加 band → 764-1（跟 bug 2 同 entries）|
| 7 | 白血球酯**脢**借 6690-2 blood WBC LOINC | ✅ 對 — 我之前寫 白血球酯**酶** 不同字 | PANEL_LOINC_MAP["06013C"] 加 脢 + 脂酶 + 脂脢 + 酯類 variants |
| 8 | 237 筆 single-obs DR title vs obs.text 不一致 | ✅ 對 | post-process：single-obs DR 構造完後 `obs.code.text = drText`（前提 obs's LOINC 等同 panel default LOINC，否則 obs 有 specific routing 不蓋）|

### LOINC 新增（per 新規矩全部 WebFetch loinc.org 驗過）

| LOINC | Component | Property | System | Method | 用途 |
|---|---|---|---|---|---|
| 740-1 | Metamyelocytes/Leukocytes | NFr | Blood | Manual | Metamyelocyte/後骨髓球（bug 2）|
| 764-1 | Neutrophils.band/Leukocytes | NFr | Blood | Manual | Band/帶狀嗜中性白血球（bug 2 + 6）|
| 2885-2 | Protein | MCnc | Ser/Plas | — | T.P 總蛋白（bug 3a）|
| 883-9 | ABO group | Type | Blood | — | NHI 11001C（bug 4 split）|
| 10331-7 | Rh | Type | Blood | — | NHI 11003C（bug 4 split）|

### Bug 8 propagation guard

```ts
if (obsResources.length === 1 && obsResources[0]?.code) {
  const obs = obsResources[0];
  const obsLoinc = obs.code.coding?.find(c => c.system === "http://loinc.org")?.code;
  const panelLoinc = NHI_TO_LOINC[groupCodeStr];
  // Only propagate when obs has no LOINC OR shares panel default LOINC
  if (!obsLoinc || obsLoinc === panelLoinc) {
    obs.code.text = drText;
  }
}
```

**為什麼要這個 guard：** 08036C single-row case，display "APTT data/mean" 透過 PANEL_LOINC_MAP 對到 63561-5（APTT ratio），但 panel default LOINC（NHI_TO_LOINC["08036C"]）是 14979-9（APTT time）。沒 guard 的話會把 obs.code.text 從 "APTT (ratio)" 蓋成 DR.text "APTT"，失去 ratio 跟 time 的區分。Guard 後：LOINC 不同就不蓋，DR 跟 obs 各自 keep（DR=panel-level "APTT"、obs=specific "APTT (ratio)"）。

### Faithful transport check ✅

- LOINC 改動全部 WebFetch verified（740-1/764-1/2885-2/883-9/10331-7）
- 11001C/11003C 從 882-1 拉到 883-9/10331-7 — patient-safety improvement（882-1 合併 code 配 ABO-only 值是 semantic mismatch）
- 溶血/脂血/narrative row filter — drop 的是 LIS 自己塞的 quality flag 跟 comment row，不是 patient analyte data
- Bug 4 multi-reading：**preserve 全部 readings**，user 已確認 NHI raw 有 2 筆，bridge 不該幫忙判斷
- code.text 變動只動 `CodeableConcept.text`（free-form per FHIR R4），coding[*].display 維持 catalog-faithful

### CI 守門（13 個新 regression seeds）

- Bug 1: 溶血/脂血/黃疸/Hemolysis 都 filter，真 BUN 留下
- Bug 2: Meta-Myelocyte/後骨髓球→740-1; Band/帶狀嗜中性白血球→764-1; Hct(血球容積比)→4544-3
- Bug 3: `:`/`PEP-Comment` filter, T.P→2885-2
- Bug 4: 11001C→883-9; 11003C→10331-7; **v0.11.9 G 2-reading-per-panel still preserved**
- Bug 5: RDW/MCV/MCH/MCHC 變體不再 fall through 到 789-8
- Bug 7: 白血球酯脢 (脢)→5799-2
- Bug 8: 09022C K — DR + obs 都「鉀」; 09112C TSH — 都「TSH」; 08036C APTT ratio — obs 保留 "APTT (ratio)" 不被蓋; multi-row CBC — propagation 不觸發

### Files

- `packages/mapper/src/loinc-tables.ts` — NHI_TO_LOINC ABO/Rh split + LOINC_DISPLAY 新 entries (883-9/10331-7/2885-2); CBC_COMPONENT_KEYS 跟 CBC_DIFF_KEYS 加大量 variants; PANEL_LOINC_MAP["09065B"] 加 Total Protein; PANEL_LOINC_MAP["06013C"] 加 白血球酯脢 variants; PANEL_LOINC_MAP["08013C"] 加 CBC_COMPONENT_KEYS spread
- `packages/mapper/src/observation.ts` — `QUALITY_FLAG_PATTERNS` + `NARRATIVE_ROW_PATTERNS` + 兩個 helper functions; filterLabRows 加兩個 filter step; groupByOrderCode 加 single-obs DR text propagation（LOINC-equality guard）
- `backend-ts/tests/unit/bundle-quality.test.ts` — v0.11.11 describe blocks (13 regressions)

---

## 0.11.10 重點 — 2026-05-29

**🏷️ Category B + C：DR title 跟 obs.text 對齊 — 9 個 single-analyte panel 名稱統一**

延續 v0.11.9 SMART app dev bug report — Category B (DR vs obs 命名不一致) 跟 Category C (DR title 帶 method 字尾) 列了 9 個 single-analyte panel 有跨來源名稱衝突。這版按新規矩**先 WebFetch loinc.org 驗證每個 LOINC 的 Component / Property / System / Method** 再下判斷。

### Loinc.org 驗證結果（2026-05-29）

| LOINC | Component | Property | System | NHI code | LOINC_SHORT_TEXT |
|---|---|---|---|---|---|
| 4548-4 | Hemoglobin A1c/Hb.total | MFr | Blood | 09006C | `HbA1c` |
| 1975-2 | Bilirubin total | MCnc | Ser/Plas | 09029C | `Total Bilirubin` |
| 10839-9 | Troponin I.cardiac | MCnc | Ser/Plas | 09099C | `Troponin I` |
| 13457-7 | Cholesterol in LDL (calc) | MCnc | Ser/Plas | 09044C | `LDL-C` |
| 3016-3 | Thyrotropin (TSH) | ACnc | Ser/Plas | 09112C | `TSH` |
| 2143-6 | Cortisol | MCnc | Ser/Plas | 09113C | `Cortisol` |
| 2132-9 | Cobalamin (B12) | MCnc | Ser/Plas | 09129C | `Vitamin B12` |
| 2284-8 | Folate | MCnc | Ser/Plas | 09130C | `Folate` |
| 83112-3 | PSA | MCnc | Ser/Plas (IA) | 12081C | `PSA` |

⚠️ 4548-4 副註：是 NGSP standardisation（%）。Taiwan 健保 09006C 報的 HbA1c 是 %（NGSP-aligned），所以對；如果哪天 NHI 改 IFCC mmol/mol 才需要切到 59261-8。bridge 當前先保留 4548-4 對應。

### LOINC_SHORT_TEXT 接到 DR title 構造

之前 LOINC_SHORT_TEXT 只用於 `obs.code.text`（v0.11.9 C），這版擴到 DR title：

```ts
// observation.ts groupByOrderCode
const panelLoinc = NHI_TO_LOINC[groupCodeStr];
const loincShortText = panelLoinc ? LOINC_SHORT_TEXT[panelLoinc] : undefined;

if (deduped.length === 1) {
  panelTitle = loincShortText || NHI_CODE_PANEL_NAME[code] || orderName || ...;
} else {
  // 但 multi-row panel (08011C CBC) 各 sub-row 對到不同 LOINC，
  // 不能用 LOINC_SHORT_TEXT 統一 → 只在 NOT in DISPLAY_FIRST_CODES 時 fire
  const allSameAnalyte = !DISPLAY_FIRST_CODES.has(groupCodeStr);
  panelTitle = (allSameAnalyte && loincShortText) || orderName || ...;
}
```

效果：09112C 「甲狀腺刺激素免疫分析」DR title 變 `TSH`，obs.code.text 也是 `TSH` — SMART app 看不到中間打架。

### DR.code.coding[0].display 仍保留 raw NHI 目錄名（faithful transport）

分開 `DR.code.text`（乾淨 short label）跟 `DR.code.coding[0].display`（raw NHI 目錄名）：

```ts
const drCodingDisplay = orderName || NHI_CODE_PANEL_NAME[code] || panelTitle;
const drText = panelTitle;
```

09112C 例子：
- `DR.code.text` = `TSH` （乾淨 label）
- `DR.code.coding[0].display` = `甲狀腺刺激素免疫分析` （raw 目錄名）
- obs 同 convention：`code.text = TSH`、`coding[nhi].display = 甲狀腺刺激素免疫分析`

⇒ DR 跟 obs 完全對齊 + raw 還在。

### Fullwidth → halfwidth normalisation

09099C「心肌旋轉蛋白Ｉ」用全形 Ｉ (U+FF29)。新增 `normalizeFullwidth()`：

```ts
function normalizeFullwidth(s: string): string {
  return s.replace(/[！-～]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0xfee0),
  );
}
```

只套在 `code.text` 跟 `DR.code.text`（我們自己出的 label），**不**套在 `coding[nhi].display`（faithful — NHI 目錄選擇全形是他們的事）。同類 v0.11.4 ㎡ → m2 cleanup 是 UCUM 側、這次是 display-text 側。

### CI 守門

新增 8 個 v0.11.10 regression seeds：
1. 09006C HbA1c — DR + obs both `HbA1c` + 原 catalog name 在 coding[nhi].display
2. 09029C total bilirubin — DR + obs both `Total Bilirubin`
3. 09099C Troponin I — LOINC_SHORT_TEXT path 給 halfwidth `Troponin I`
4. 09099C defensive — 沒 LOINC_SHORT_TEXT 也走 normalizeFullwidth fallback (ＡＢＣＤ → ABCD)
5. 09112C TSH — DR title 脫掉「免疫分析」變 `TSH`，raw 在 coding[0].display
6. 12081C PSA — DR title 脫掉「(EIA/LIA法)」變 `PSA`
7. 09044C/09113C/09129C/09130C — `LDL-C` / `Cortisol` / `Vitamin B12` / `Folate`
8. **Defensive：multi-row panel 08011C CBC** — LOINC_SHORT_TEXT **不能**蓋 DR title（因為各 sub-row 不同 LOINC），fall back 到 orderName「血液常規檢查」

### Faithful transport check ✅

- LOINC mapping 沒新增，全是現有 NHI_TO_LOINC 對應
- 每個 LOINC_SHORT_TEXT entry 都 WebFetch 驗過 Component/Property/System/Method
- Raw NHI catalog name 完整保留在 coding[*].display
- 全寬→半寬只在 bridge-side 我們自己出的 label，coding[nhi].display 保留原樣

### FHIR R4 compliance audit（user 要求 2026-05-29）

逐項對照 spec:

| 改動 | FHIR R4 reference | Verdict |
|---|---|---|
| `CodeableConcept.text = LOINC_SHORT_TEXT[loinc]` | text 是 "representation of the concept as entered or chosen by the user" — free-form OK | ✅ |
| `Coding.display` (loinc) = LOINC_DISPLAY (Long Common Name) | "follow the rules of the system" — LOINC 規定 Long Common Name | ✅ |
| `Coding.display` (nhi) = raw `order_name` | NHI system 沒有 published rule 但目錄 supplied name = authoritative source | ✅ |
| `normalizeFullwidth()` 套在 `CodeableConcept.text` | text free-form 可清理 | ✅ |
| **`normalizeFullwidth()` 原本也套在 `Coding.display`** | Coding.display 須 follow rules of the system；NHI 全形 Ｉ 是 NHI 自己的選擇 | ❌ **改掉**（這版 audit 抓到）|
| stableId hash 加 value | Resource.id syntactic constraint (≤64 chars, alphanumeric + `-` + `.`) — SHA1 hex 合格 | ✅ |
| `NHI_CODE_PANEL_NAME` 值跟 NHI 目錄對齊 | 既然會 fall back 進 Coding.display，得是 catalog-faithful | ⚠️ **這版同時修**（v0.11.9 F 的 paraphrase 拉回 catalog 原文）|

#### Audit 抓到的兩個修正

1. **`drCodingDisplay` 不再過 `normalizeFullwidth`**：
   ```ts
   // 之前 (v0.11.10 pre-audit)
   const drCodingDisplay = normalizeFullwidth(orderName || NHI_CODE_PANEL_NAME[code] || panelTitle);

   // 現在
   const drCodingDisplay = orderName || NHI_CODE_PANEL_NAME[code] || panelTitle;
   const drText = normalizeFullwidth(panelTitle);  // text 還是 normalize
   ```
   保證 NHI 目錄選的 Ｉ 留在 DR.code.coding[0].display，只在 DR.code.text + obs.code.text 用半形。

2. **`NHI_CODE_PANEL_NAME` 拉回 NHI 目錄正式名稱**：
   ```ts
   // 之前 (v0.11.9 F 我自己縮的)
   "11001C": "ABO 血型測定",
   "11003C": "RH(D) 型檢驗",

   // 現在 (NHI 目錄 verbatim)
   "11001C": "ABO血型測定檢驗",
   "11003C": "RH（D）型檢驗",  // 全形括號
   ```
   這個 map fall-back 進 `Coding.display` 時就會是 catalog-faithful。SMART app 看 obs.code.text 還是會看到 `normalizeFullwidth("RH（D）型檢驗")` = `"RH(D)型檢驗"`（半形）。

### 結果分層

| 欄位 | 規則 | 11003C example |
|---|---|---|
| `coding[nhi].display` (Coding.display) | NHI catalog 原文 verbatim | `"RH（D）型檢驗"` (全形) |
| `coding[loinc].display` (Coding.display) | LOINC Long Common Name | (此 panel 無 LOINC) |
| `code.text` (CodeableConcept.text) | LOINC_SHORT_TEXT > NHI_CODE_PANEL_NAME > display，過 normalizeFullwidth | `"RH(D)型檢驗"` (半形) |
| `DR.code.text` | 同 code.text 邏輯，過 normalizeFullwidth | `"RH(D)型檢驗"` (半形) |
| `DR.code.coding[0].display` | orderName > NHI_CODE_PANEL_NAME > panelTitle, **不**過 normalize | `"RH（D）型檢驗"` (全形) |

### Files

- `packages/mapper/src/loinc-tables.ts` — `LOINC_SHORT_TEXT` 加 9 個 verified entries；`NHI_CODE_PANEL_NAME` 值拉回 NHI catalog 正式名稱（11001C/11003C）
- `packages/mapper/src/observation.ts` — 加 `normalizeFullwidth()`; buildObservation + mapObservation code.text wrapped；DR title precedence 加 LOINC_SHORT_TEXT；DR.code.coding[0].display 分離成 `drCodingDisplay` (**不**過 normalize) + DR.code.text 用 `drText` (過 normalize)
- `backend-ts/tests/unit/bundle-quality.test.ts` — 新 v0.11.10 describe block + 8 個 regression tests；既有 v0.11.9 blood-type 測試的 expected values 更新對齊 catalog 正式名稱

---

## 0.11.9 重點 — 2026-05-29

**🩸 APTT (08036C) panel routing 修正 — ratio 跟 time 用同一 LOINC、外加 QC pattern + display text 整理**

SMART app dev 2026-05-29 回報：APTT 報告下有兩個 row 都是「APTT 相關」但意義不同：
- `APTT` value=31.4 sec（patient APTT 時間）
- `Heparin治療範圍參考倍數` value=1.08（patient APTT / 正常血漿 APTT 比值，heparin 監控用）

Bridge 之前兩個 row 都掛 LOINC **14979-9**（aPTT in Platelet poor plasma）— SMART app 用 LOINC 分欄會把 1.08 跟 31.4 畫在「APTT 秒」同一條 trend，1.08 sec 看起來像致命凝血障礙。同時旁邊 `正常血漿APTT平均值` QC row 沒被現有 QC filter 攔下，混進 patient bundle。

### Root cause — 3 個交織的 bug

#### 1. LOINC mapping error
`NHI_TO_LOINC["08036C"] = 14979-9`（APTT time, Property=Time, 單位秒）對「APTT 秒」這 row 是對的，但對「Heparin治療範圍參考倍數」是錯的 — 那是 ratio（Property=RelTime, 無單位）。loinc.org 線上 audit 確認正確的 ratio LOINC 是 **63561-5**（aPTT actual/normal in PPP, Property=RelTime）。

#### 2. QC pattern 太窄
`/正常血漿平均/` 字面只 match `正常血漿平均` — 沒辦法 catch `正常血漿APTT平均值`（中間夾分析物名）或 `正常血漿PT平均值`。

#### 3. v0.9.10 5894-1 mapping 從一開始就標錯
v0.9.10 把 08026C panel 的 `PT Control` / `對照` 映射到 LOINC **5894-1**，premise 是「5894-1 = PT Control plasma reading」— audit 2026-05-29 上 loinc.org 確認 5894-1 真正的 canonical 是 **"Prothrombin time (PT) actual/Normal"**（Property=RelTime, 一個 RATIO，不是 control reading）。映射根本就錯。

#### 4. code.text 用 raw NHI display 對 SMART app 不友善
`code.text` 直接吃 raw display string，導致 SMART app 出現 `Heparin治療範圍參考倍數` 這種 setting-style label 當欄位 header，跟旁邊 `APTT` 欄看起來不像同一族分析物。

### Fix（A-E 一次到位）

#### A. 08036C promoted 進 DISPLAY_FIRST_CODES + PANEL_LOINC_MAP 新增

```ts
// loinc-tables.ts
DISPLAY_FIRST_CODES.add("08036C");

PANEL_LOINC_MAP["08036C"] = {
  // ratio variants → 63561-5
  "heparin治療範圍參考倍數": "63561-5",
  "aptt data/mean": "63561-5",
  "aptt actual/normal": "63561-5",
  "aptt ratio": "63561-5",
  // bare time variants → 14979-9
  "aptt": "14979-9",
  "活化部份凝血活酶時間": "14979-9",
  // ...
};
```

#### B. QC pattern 廣播

```ts
// observation.ts
- /正常血漿平均/,
+ /正常血漿.*平均/,   // 抓 正常血漿APTT平均值 / 正常血漿PT平均值
```

#### C. LOINC_SHORT_TEXT override for code.text

新增 `LOINC_SHORT_TEXT` map，當 row resolved 到有 entry 的 LOINC 時，`code.text` 用 override（給 SMART app 一個乾淨的欄位 header）：

```ts
// loinc-tables.ts
export const LOINC_SHORT_TEXT: Record<string, string> = {
  "14979-9": "APTT",
  "63561-5": "APTT (ratio)",
  "5902-2": "PT",
  "6301-6": "INR",
  "5894-1": "PT (ratio)",
};

// observation.ts buildObservation + mapObservation
text: (loinc && LOINC_SHORT_TEXT[loinc]) || display || "Unknown Lab",
```

Raw NHI display 仍然完整保留在 `code.coding[nhi].display`（faithful transport — 沒亂改健保存摺給的資料，只是另外提供 SMART app 一個乾淨 label）。

#### D. v0.9.10 5894-1 mapping 移除

`PANEL_LOINC_MAP["08026C"]` 移除 `"pt control"` / `"prothrombin time control"` / `"control pt"` / `"對照"` / `"對照組"` → 5894-1。這些 row 真要是 QC（依 looksLikeQcControl pattern）就被 filter，沒被 filter 就 fall back 到 panel "PT" → 5902-2 或 NHI-coding only — 都比錯標 5894-1 安全。

#### E. LOINC_DISPLAY 修正 + 新增

- `5894-1` display 修成 `"Prothrombin time (PT) actual/Normal in Platelet poor plasma by Coagulation assay"`（之前錯標成 "Control"）
- 新增 `63561-5`: `"aPTT in Platelet poor plasma by Coagulation assay --actual/normal"`

### CI 守門

新增 4 個 standing CI tests（bundle-quality.test.ts）：

1. **APTT ratio sub-row (val=1.08) → 63561-5, NOT 14979-9** — 鎖住 patient-safety bug
2. **APTT data/mean + APTT actual/normal 變體 → 63561-5**
3. **code.text 用 LOINC_SHORT_TEXT override（APTT / APTT (ratio) / PT / INR）** + 確認 raw NHI display 還在 `coding[nhi].display`
4. **正常血漿APTT平均值 + 正常血漿PT平均值 被 QC filter 攔下；real patient APTT 不受影響**
5. **PT Control 不再 mis-map 到 5894-1**（即使 slip past QC filter）

舊 v0.9.10 的 "PT Control → 5894-1" 測試翻轉成 v0.11.9 audit assertion：`not.toBe("5894-1")`。

### Faithful transport check

「凡是健保存摺上沒有的不能亂加，沒給的不能造，loinc 對應可以」— 這次修法符合：
- LOINC 對應改正（從錯標 14979-9 變正確 63561-5）— ok
- QC filter 廣播（攔下健保存摺裡夾帶的 lab QC 資料，不是 patient data）— ok
- code.text override（重新 label 我們自己 output 的欄位 header，raw display 還在 coding[nhi].display）— ok
- 5894-1 移除（取消錯誤的 LOINC 標籤）— ok

沒有任何 row 是新增、刪除、或值被改。

---

**🩸 接續：血型 panel 還有兩個沒修完的問題（同次 release 補上）**

SMART app dev follow-up 2026-05-29：v0.11.8 修好「不同 NHI code 共用 display 撞 stableId」之後，user + app 端再對照 raw → bundle 發現還有兩層 bug 沒修：

#### Bug F：obs.code.text 都是 generic「血型鑑定」

11001C ABO / 11003C RH(D) / 11004C 抗體 三個 NHI code 都從 LIS 拿到 `display: "血型鑑定"`，bridge 直接拿來當 obs.code.text。Downstream SMART app 用 code.text key dupKey（title|date|institution|value）做 duplicate detection — ABO B-type 跟 RH B-positive 看起來 title 一樣、值都是 B → 被誤標「可能重複」。

**Root cause**：NHI 目錄裡每個 code 都有具體的 panel name（ABO 血型測定 / RH(D) 型檢驗），但 LIS 上傳時統一塞 generic「血型鑑定」。Bridge 沒處理這層 LIS-vs-NHI-catalog 的落差。

**Fix**：新增 `NHI_CODE_PANEL_NAME` map（loinc-tables.ts）：

```ts
export const NHI_CODE_PANEL_NAME: Record<string, string> = {
  "11001C": "ABO 血型測定",
  "11003C": "RH(D) 型檢驗",
  "11004C": "抗體反應 (不規則抗體)",
};
```

buildObservation + mapObservation 的 code.text precedence 變成：

```ts
text:
  (loinc && LOINC_SHORT_TEXT[loinc]) ||
  NHI_CODE_PANEL_NAME[code] ||       // ← NEW
  display ||
  "Unknown Lab";
```

只 fire 在 map 裡有 entry 的 NHI code（CBC 子項目沒 entry → display "WBC" 還是會贏，沒 regression）。Raw display「血型鑑定」全在 coding[nhi].display（faithful transport）。

#### Bug G：每張 panel 兩筆 reading bundle 只剩一筆（silent data drop）

健保存摺 5/18 raw 顯示 11001C ABO 有兩筆（B 跟 +）、11003C RH 也有兩筆（+ 跟 B）— forward/reverse typing arms 或 dual-antisera 反應，**legit 兩個獨立 readings**。v0.11.8 的 test seed 我誤判成「LIS 重複上傳」，bundle 確實只給每個 panel 1 筆 obs。

**Root cause**：v0.11.8 stableId 加了 code disambiguation，但 **value 還是沒進 hash**。同 NHI code、同 display、不同 value 兩 row 算出 SAME stableId → groupByOrderCode 的 `seenObsIds.has(obs.id)` 把第二筆當 dup 丟掉。

```ts
// v0.11.8（不夠）
stableId(patientId, "obs", canonical, date, hospital, code)
// v0.11.9 加 value
stableId(patientId, "obs", canonical, date, hospital, code, String(raw.value ?? ""))
```

真重複（同 value）還是會在更早的 dedupeCrossFormat（step 1, key 含 value）跟 dedupePanelItems（step 3, key 含 value）就 collapse，所以加 value 進 stableId 不會把真 dup 放回來，只是讓「同 panel 內不同 reading」存活。

**Trade-off（跟 v0.11.8 一樣）**：之後 NHI 端 value 被修正 → resource ID 改變。可接受。

#### Faithful transport check（F + G）✅

- F：純粹給我們自己 output 的 code.text 加一個對 SMART app 友善的 label，raw display 一字不漏在 coding[nhi].display
- G：「擋住健保存摺有但 bundle 沒輸出的 row」這正是 faithful transport 的核心 — 不能 silently 漏 reading

#### CI 守門（新增 1 個 + 修 1 個）

- **新增**：v0.11.9 code.text 用 NHI_CODE_PANEL_NAME 覆寫 + raw 顯示保留在 coding[nhi].display
- **修改**：v0.11.8 五筆 raw → 三筆 obs 的 assertion 翻成 **五筆 raw → 五筆 obs**（per NHI 目錄每張 panel 兩筆 reading + 一筆 antibody screen）+ ABO 兩筆值 ["+", "B"] 跟 RH 兩筆值 ["+", "B"] 都檢查

#### Files（F + G）

- `packages/mapper/src/loinc-tables.ts` — 新增 `NHI_CODE_PANEL_NAME` map + export
- `packages/mapper/src/observation.ts` — import 加 NHI_CODE_PANEL_NAME；buildObservation + mapObservation code.text precedence 加一層；stableId 加 value 參數
- `backend-ts/tests/unit/bundle-quality.test.ts` — 翻 v0.11.8 blood-type 測試 3→5；新增 code.text override 測試

---

**🏷️ Category A 收尾：coding[nhi].display 用 NHI 目錄 panel 名（不是 LIS row display）**

SMART app dev 第二輪 bug report 2026-05-29 指出：v0.11.8 修好 DR 分流 + F 修好 obs.code.text，但 `coding[nhi].display` **還是 row-level LIS display「血型鑑定」**，不是 NHI 目錄 panel name「ABO血型測定檢驗」。

#### Bug H：coding[nhi].display 用錯來源

```jsonc
// 之前 (v0.11.8 / F 階段)
{
  "code": "11001C",
  "display": "血型鑑定"     // ← row LIS display, 跟 11003C 撞名
}

// SMART app dev 期望
{
  "code": "11001C",
  "display": "ABO血型測定檢驗"   // ← NHI 目錄 panel name (raw.order_name)
}
```

NHI medical order code system 的 `display` 該是該 code 在 NHI 目錄裡的 canonical 名稱（panel-level），不是 LIS 上傳每 row 自己塞的 label。Bridge 之前直接吃 row display 是錯的設計。

**Fix**：`buildCodings` 加 `nhiPanelName?` 參數；`coding[nhi].display = orderName || NHI_CODE_PANEL_NAME[code] || display`。同時把 DR title 單-row 路徑也對齊（之前 `singleDisplay || orderName || code`、現在 `NHI_CODE_PANEL_NAME[code] || orderName || singleDisplay || code`）— SMART app 看到的 DR title 跟 obs.code.text 都是同個 panel-specific 名字。

#### Faithful transport check（H）✅

`order_name` 是健保署 NHI 目錄裡每個 code 對應的正式名稱（scraper 已經抓下來了），用它當 `coding[nhi].display` 是用 NHI 自己給的資料、不是發明。NHI_CODE_PANEL_NAME override 只在 scraper 沒給 order_name 時 fallback。Patient 資料（value / date / hospital / unit）一個字沒動。

#### Files（H）

- `packages/mapper/src/observation.ts` — `buildCodings` 加 `nhiPanelName?` 參數；buildObservation + mapObservation 都傳 `raw.order_name || NHI_CODE_PANEL_NAME[code]`；DR title 單-row 路徑改用 NHI_CODE_PANEL_NAME 優先
- `backend-ts/tests/unit/bundle-quality.test.ts` — 新 H regression test 用兩種 path（with order_name / without order_name）；翻 v0.11.8 blood-type 測試 assertion 從 raw display 改成 NHI_CODE_PANEL_NAME

#### v0.11.10 預告 — Category B + C 延後處理

SMART app dev 同份 bug report 還列了 9 個 single-analyte panel code 有 DR title vs obs.text 命名不一致（HbA1c / 全 vs 總膽紅素 / Troponin I 全形 / LDL / TSH 帶「免疫分析」字尾… ）。解法是擴 LOINC_SHORT_TEXT cover 4548-4 / 1975-2 / 10839-9 / 13457-7 / 3016-3 / 2143-6 / 2132-9 / 2284-8 / 83112-3，並把 LOINC_SHORT_TEXT 接到 DR title 構造路徑。

按新規矩「**之後凡是關乎 LOINC 都要先上網搜尋過才能下判斷**」，這 9 個 LOINC 都要先 WebFetch loinc.org 確認 canonical short name + Property + Component，比較沉重 — 拉到 v0.11.10 專案處理，不擠進 v0.11.9。

---

## 0.11.8 重點 — 2026-05-28

**🩸 修血型 panel silent-drop — 11001C ABO + 11003C Rh 共用 display 「血型鑑定」被 bundle-level dedup 撞死**

User 從 2025-05-18 長庚嘉義 raw 看到 5 個血型 panel 相關 row（11001C ABO B / 11001C +（重複上傳）/ 11003C + / 11003C B（重複上傳）/ 11004C 抗體反應 Negative），但 v0.11.7 bundle 只有 2 個（11003C blood + 11004C antibody），11001C ABO 完全消失。

### Root cause

`stableId` for Observation **沒包含 NHI code**：
```ts
stableId(patientId, "obs", canonical, date, hospital)
```

11001C "血型鑑定" 跟 11003C "血型鑑定" canonical 都是「血型鑑定」（global synonym table 沒 entry 落到 lowercased fallback）→ 同 stable ID → bundle assembler 那層 `seen.has((resourceType, id))` 撞死 → 留 1 個。

### Fix

`buildObservation` 的 stableId 加 code：
```ts
stableId(patientId, "obs", canonical, date, hospital, code)
```

→ 11001C 跟 11003C 雖然 canonical 都是 "血型鑑定"，code 不同 → 不同 ID → 各自獨立。

順便補 pre-existing gap：`LAB_SYNONYMS` 沒有 `Hb` / `血色素` entry（只有 HGB / HEMOGLOBIN / 血紅素），新增 `HB` + `血色素` → HEMOGLOBIN，讓 Hb / 血色素 跨語言 merge 正常 work。

### 結果（user 5-row 血型 case）

| 之前 | v0.11.8 |
|------|---------|
| 2 rows（11001C 完全 missing）| **3 rows** ✅（11001C ABO B + 11003C Rh + + 11004C 抗體 Negative）|

### CI 守門

`bundle-quality.test.ts` 加 v0.11.8 section — 鎖血型 panel + Hb cross-language regression。

### DR id 也撞死了（同 root cause）— 一起修

User 觀察 bundle 內 11001C ABO 和 11003C Rh 顯示為 2 個獨立 row。深入 trace 發現 DR stableId **也沒包含 NHI code**：

```ts
stableId(patientId, "DR", panelSignature, date, hospital)  // ← code missing
```

11001C 和 11003C 兩個 group 的 panelSignature 都是「血型鑑定」 → 同 DR id → bundle 那層 dedup 撞死 → 留 1 個 DR + 另一個 Observation 變孤兒（DR→Obs reference 斷掉）。

修：DR stableId 加 `meta.groupKeyCode`：
```ts
stableId(patientId, "DR", panelSignature, date, hospital, code)
```

順便 memberKeys 也讓 `canonicalLabKey` 帶 code（這樣 urinalysis 等 code-scoped synonym 在 panelSignature 計算時一致）。

### 結果

| Resource | v0.11.7 | v0.11.8 |
|----------|---------|---------|
| Obs | 5→2（11001C 沒 emit）| 5→3 ✅ |
| DR | 3 個 group → 1 個 DR + 1 個孤兒 Obs | **3 個獨立 DR**，DR↔Obs link 全 intact ✅ |

CBC panel（多 item 共享同一 NHI code）行為不變 — 仍是 1 DR + N Obs。

### Trade-off — backend resource ID 會變

`stableId` 改動 → 所有 Observation **跟 DiagnosticReport** ID 重算 → 下次 sync backend mode 會 re-create 既有 resource（一次性 disruption）。Local mode 重下載即可。

純 mapper 改動，無 UI。Reload extension。Backend mode 需要 `docker compose up -d --build`。

---

## 0.11.7 重點 — 2026-05-28

兩個 patient-safety bug 一次修：

---

### 🚨 Bug 2：dedup collision silent-drop（urinalysis panel 9 items 漏掉）

User 從 v0.11.6 bundle 看 06013C 尿生化檢查 2026-01-14 → 健保存摺 raw 有 20 row，bundle 只有 11。9 個尿液檢查項目（亞硝酸鹽 / 尿潛血 / 酮體 / 白血球酯脢 / Blood / 等）silent drop。

**Root cause（兩層 dedup 都有同一個概念錯誤）**：

1. `dedupePanelItems` (panel scope) 的 key 只用 `value`
2. `dedupeCrossFormat` (全 bundle scope) 的 key 用 `(date, value, unit, order_code)` — **沒包含 display**

→ 同一 panel 內不同 analyte 但都 "Negative" mg/dL（urinalysis 大多 negative 是 norm）→ 全部 collide → CJK+EN mix 觸發只留 enItems[0]，其他全 drop。

**Fix**：兩個 dedup key 都加 `display.toLowerCase().trim()`。不同 analyte 永遠不會 collide；exact-duplicate rows（NHI 重複上傳）還是會正常 dedup；同 analyte 跨語言（如 `Bilirubin` ↔ `膽紅素` 同 value）走 `canonicalLabKey` → 同 stable ID → 在 `seenObsIds` 那層 dedup（intended）。

**`canonicalLabKey` 同義詞表也修了** 4 處 urinalysis 同名衝突：
- `肌酸酐(尿液)` → `URINE_CREATININE`（原本誤 map 成 serum CREATININE）
- `微白蛋白/肌酐酸比值` → `UACR`（原本誤 map 成 CREATININE）
- `微白蛋白(尿)` → `URINE_MICROALBUMIN`（原本誤 map 成 serum ALBUMIN）
- `白血球酯脢` → `URINE_LEU_ESTERASE`（原本誤 map 成 blood WBC）

**結果**：user 的 20-row case 從 11 → 15（5 個 legit cross-language merges：Bilirubin↔膽紅素、CREA(U)↔肌酸酐(尿液)、Glucose↔尿糖、Color↔顏色、Blood↔尿潛血）。**0 silent drop，「一筆檢驗就是一 row」**。

### Code-scoped `canonicalLabKey` — 解決 polysemic 字（Glucose / Color / Blood）

`canonicalLabKey` 加 optional `code` 參數 + URINALYSIS_PANEL_SYNONYMS 表。在 06013C urinalysis panel context 下，英文 polysemic 字（"Glucose" / "Color" / "Blood" 等）canonical 成 `URINE_X`，跟中文版（尿糖 / 顏色 / 尿潛血）merge 成一 row。在其他 panel context 下（如 09005C serum glucose），這些字維持原本 canonical（GLUCOSE 等），不會被 urinalysis context 干擾。

Defensive test：同 patient 同日同 hospital 同時有 06013C "Glucose" + 09005C "Glucose" → 2 rows 都保留，不會被誤 merge。

新增 standing regression seed lock 整個 20-row case + 跨 panel 防誤 merge 測試。

---

### 🩸 Bug 1：dipstick semi-quantitative 結果丟失 grade — `4+ (2000)` → 只剩 `2000 mg/dL`

User bug report 2026-05-28：MediPrisma 顯示「Glucose 2000 mg/dL [Negative]」（看起來 critical 高血糖數值），但健保存摺實際是「4+ (2000)」— **`4+` 才是真實的 dipstick 半定量分級，`(2000)` 只是 lab 附的約等於估算值**。Bridge 丟掉了臨床更重要的 grade。

### Root cause

`tryParseQuantity` 在 v0.9.7 加的 fallback 邏輯：leading 數字 parse 失敗時，抓 parens 內 numeric。原意是「dipstick grade is leading, numeric is parenthesised — extract numeric」。**設計 trade-off 選錯了**：grade > 估算值 在臨床優先序。

### 修法

`packages/mapper/src/parsers.ts` 加 dipstick 偵測：leading 是 `[\d.]+\+` / `Trace` / `Positive` / `Negative` 時 → 直接 return null → caller 走 valueString path 完整保留 `"4+ (2000)"` 原始字串。

### Behavior 比對

| 輸入 | v0.11.6 之前 | v0.11.7 之後 |
|------|-------------|-------------|
| `"4+ (2000)"` mg/dL | valueQuantity 2000 ❌ | valueString "4+ (2000)" ✅ |
| `"Trace (15)"` mg/dL | valueQuantity 15 ❌ | valueString "Trace (15)" ✅ |
| `"1+ (80)"` mg/g | valueQuantity 80 ❌ | valueString "1+ (80)" ✅ |
| `"33 (stage3:30-59)"` eGFR | valueQuantity 33 ✓ | valueQuantity 33 ✓（不變）|
| `"2.3(36.1%)"` | valueQuantity 2.3 ✓ | valueQuantity 2.3 ✓（不變）|

### Test 變動

v0.9.7 加的 3 個 test 鎖了錯的行為（assertion 主張 4+ (2000) → 2000）。全 flip 成新行為：
- `parsers.test.ts`：v0.9.7 → v0.11.7 dipstick null assertions + 加 regression seed for eGFR pattern 還是要 extract
- `bundle-quality.test.ts`：拆 quantity 跟 dipstick 兩個 test block，分別 assert 對應行為

純 parser 改動，無 UI。Reload extension。Backend mode 需要 `docker compose up -d --build`。

---

## 0.11.6 重點 — 2026-05-28

**🚨 修 v0 以來潛伏的 silent-drop bug — bare `HCT` display 整筆被當 imaging 過濾掉**

User 從 2026-05-25 嘉義長庚 CBC 報告發現「健保存摺顯示 8 個 item，bundle 只有 7 個」。Trace 出 root cause：

- `looksLikeImaging` 用 `${display} ${code}` 拼成 haystack，加上 substring 比對 `"ct "`（CT scan 的 trailing-space sentinel）
- bare display "HCT" → haystack `"hct 08011c"` → 含 `"ct "` → 被誤判 imaging → drop
- 從 commit `285deb4` (v0 initial public release) 就有，整整存在 6 個月。所有 v0.x bundle 都漏掉任何 bare display 結尾是 `ct` 的 lab row（HCT 為主，理論上 bare "Direct" 也會）

**結構性修法（不只 patch symptom）**：

完全拿掉 `looksLikeImaging` + `IMAGING_KEYWORDS` 從 Observation pipeline。理由 audit 確認：
- 3 個 `page_type: "observations"` 來源（`adult_preventive` / `cancer_screening` / `other_labs`）**結構上不可能 emit imaging row**
- Imaging 走另一個 `page_type: "diagnostic_reports"`，完全不接觸 Observation 路徑
- 這個 filter 從 v0 就是 paranoid defensive dead code，防範一個結構上不存在的污染，反而製造實際 bug

### 新增 standing CI 守門 — silent-drop audit

`bundle-quality.test.ts` 加 v0.11.6 section：
- **bare "HCT" 必過 filter + 必得 LOINC 4544-3**（regression seed lock 這個 bug）
- **raw input N 筆 → output observation count 必須等於 N - documented drops**（任何未來新 filter 誤殺都會立刻 fail CI）

這是 audit gap 修補 — 之前所有 audit 只測 mapping 對不對，從未測 filter 該不該擋。

### Process 自我檢討

之前 audit 跑了 282 個 display variant probe，全部從 `findLoinc` / `mapObservationsGrouped` 開始，**從未經過 filter stage**。bundle-quality test 的 synthetic input 剛好用 `display: "Ht"`（不觸發 bug），如果用 `"HCT"` 早就 catch 到。

下次 audit 思維會加：「raw → adapter → filter → mapper → bundle」全 pipeline e2e 比對，count 對帳。

純 mapper 改動，無 UI。Reload extension。Backend mode 需要 `docker compose up -d --build`。

---

## 0.11.5 重點 — 2026-05-27

**🧹 上架前最後清理**

Chrome Web Store pre-submission review 抓到 4 處要修，全 clean：

- **`SECURITY_FOR_USERS.md`** 版本標記 `v0.9.5` → `v0.11.4`（過時）
- **`README.md`** L13 安全文件招呼從「12 項『不做的事』、12 項『主動防護』、6 個常見 Q&A」改成不帶具體數字的描述（之前 SECURITY 簡化後實際是 7/7/4）
- **`README.md`** MediPrisma 段落（L260 + L315）跟 SECURITY 同步軟化：去掉「跟 bridge 無關」推卸語氣，改成「醫析的本機視覺化是本機運算；AI 問答按鈕走雲端 LLM 是 LLM 服務本身的運作方式」
- **`background.js`** sync 啟動的 `console.log("[NHI API sync] date range:...")` 拿掉（純 operational diagnostic，date range 在 popup status banner 已顯示）

純文字 / 註解 / 1 行 log 移除，無 logic 變動。

---

## 0.11.4 重點 — 2026-05-27

**🔍 Proactive LOINC display-variant audit + FHIR R4 conformance audit**

Bridge-author（不靠 SMART app dev 報 bug）主動跑兩輪 audit：
- LOINC display variant：282 個 probe 找到 **49 個 miss**（28 個是 panel LOINC 洩漏到個別 obs — patient-safety relevant）
- FHIR R4 conformance：3 輪檢查 8 種 resource type，**結構全 clean** — 沒踩到 R4 violation

### LOINC display variant 補強（5 類）

| 類別 | 例子 | 修法 |
|------|------|------|
| 句點分隔縮寫（`\b` regex 邊界 bug）| `W.B.C.` `R.B.C.` `M.C.V.` `M.C.H.C.` `A.B.E.` `S.B.E.` `T.CO2` `P.CO2` `p.H.` | 加 key（不帶尾端點，cover 兩種輸入形式）|
| CJK 同義詞 | `血色素` `血紅蛋白` → HGB；`紅血球容積` → HCT；`淋巴` `多核球` `多形核球` → diff cells | 加 CJK key |
| 英文短形 | `Neut` `Neut.` `Lym` `Lym.` `Lymph` `Lymph cell` | 加 key |
| 尿液 dipstick 縮寫（都漏到 panel LOINC `24356-8`）| `Bili` `KET` `OB` `NIT` `UBG` `URO` `SG` `S.G.` `Colour` `WBC esterase` | 加 panel key（`WBC esterase` 還擋 global `wbc` shadow）|
| ABG CJK 描述名 + 縮寫（全 `null` fallback）| `酸鹼值` `二氧化碳分壓` `氧分壓` `碳酸氫根` `Total CO2` `O2 saturation` `血氧飽和度` | 新增 `PANEL_LOINC_MAP["09041B"]` |
| Flow CD 比值 trailing `+` bug | `CD3+/CD4+` 應 → CD4 (`8123-2`) 卻給 CD3 (`8124-0`) | drop trailing `+` from keys |

### FHIR R4 audit 結論

**全 clean**：Patient / Observation / DiagnosticReport / MedicationRequest / Encounter / Condition / AllergyIntolerance / Immunization / Procedure — 8 種 resource 都通過結構檢查。沒踩到 status enum / choice element / datetime / reference / coding system / cardinality / quantity 等任一 violation。

### 新增 6 個 standing regression seeds

`bundle-quality.test.ts` 加 v0.11.4 audit section — 每類各 lock 一組代表 case，未來 refactor 改壞會立刻 fail CI。

純 mapper + test，**沒 UI / 沒 logic 改動**。Reload extension 即可。Backend mode 需要 `docker compose up -d --build`。

---

## 0.11.3 重點 — 2026-05-27

**🎨 Inline-link CTA 視覺統一**

v0.11.2 的「→ 至 ④ 查看 開啟「醫析 MediPrisma」」CTA 用了藍底 banner 跟其他 panel 的「→ 請切到健保存摺分頁　回 ① 登入 →」hint 同型別卡片，視覺重量太重、跟下面兩張 meta card 競爭注意力。整 panel 三個藍塊堆疊不協調。

改成 inline-link 統一 pattern：

- `.status-action`（下載完 CTA）：藍色底線 link，no border / no background — 跟「安全說明 ↗」同 typography
- `.cta-reason`（卡住提示）：同步改成藍色底線 link 風格，msg + jump 兩個 span 各帶底線、整個 row 仍可點

兩處 CTA + 既有的「安全說明 ↗」現在共用同一個視覺語言。

### Layout：sync hint 移到按鈕上方

「→ 請切到健保存摺分頁　回 ① 登入 →」原本在 `取得健保存摺資料` button **下方**，現在改到**上方**：

```
→ 請切到健保存摺分頁              回 ① 登入 →
[ 取得健保存摺資料 ]  (disabled)
```

讀的順序更直覺：先說「為什麼 button disable」再看到 disabled button。

### Stale storage migration

Pre-v0.11.2 的 syncStatus 帶有「— 接著至 ④ 查看 開啟「醫析 MediPrisma」瀏覽資料。」suffix（已被拆成 CTA button）。`_renderStatus()` 加 regex 一次性 strip 掉舊 suffix，避免 reload 後新版本同時顯示舊文字 + 新 CTA。

純 popup UI，logic / mapper 沒變。Reload extension 即可。

---

## 0.11.2 重點 — 2026-05-27

**🖱️ 下載完狀態列加 CTA 按鈕 — 直接跳 Step 4**

之前下載完顯示「✅ 已下載 ... — 接著至 ④ 查看 開啟「醫析 MediPrisma」瀏覽資料」是純文字，user 還是要自己點 wizard 上方的 tab。改成：
- 文字精簡成「✅ 已下載健康紀錄檔（共 N 筆 · X bytes）」
- 下方加一顆 CTA 按鈕「→ 至 ④ 查看 開啟「醫析 MediPrisma」」
- 點一下直接跳 Step 4

`setStatus()` 新增可選 `action` 參數（`{label, onClick}`），未來其他 phase 也能用同一機制加 CTA。樣式跟 dismiss 按鈕一致風格（subtle outline，不搶眼）。

純 popup UI 改良，logic 沒變。Reload extension 即可。

---

## 0.11.1 重點 — 2026-05-27

**🐛 Coagulation panel 3 個 bug 修補（長庚嘉義 report）**

SMART app dev 又抓到一輪，全部 patient-safety-adjacent：

- **P.T (含點) → 6301-6 (INR LOINC) ❌** — 修：08026C panel 加 `p.t` / `p.t.` / `p t` key。原因：`_keywordMatches` 用 `\b...\b` regex，**句點打斷 word boundary**，現有 `pt` key 對 "P.T" 完全 miss → fallback 到 NHI_TO_LOINC = 6301-6 → 11.9 sec PT 被當 INR=11.9 顯示（看起來像 fatal anticoagulation 過量）。現在 → `5902-2` ✅
- **Nor.plasma mean (QC 控制) 被當病人 obs 輸出 ❌** — 修：新增 `looksLikeQcControl()` filter，drop 掉 9 種 QC pattern（`nor.plasma` / `normal plasma` / `abn.plasma` / `control mean` / `qc mean/control/plasma` / `對照血漿` / `控制血漿` / `正常血漿平均` 等）。原因：lab 內部 QC 控制讀數本來就不該進病人 bundle — 它是 ratio 計算的分母，不是病人測量值
- **unit "倍數" 不是 UCUM ❌** — 修：`_canonicalizeUnit` 加 `倍數` / `倍` → `{ratio}`（UCUM annotation 合法）

### 加 standing CI 守門

`bundle-quality.test.ts` 新增 3 個 regression seeds：
- QC control 必被 filter 出去
- QC pattern 多種變體都要 filter
- 倍數 必 normalize 成 `{ratio}`

Backend suite 從 333 → 338 tests。

### 升級

Reload extension。Backend mode 需要 `docker compose up -d --build`。

---

## 0.11.0 重點 — 2026-05-27

**🛡️ CI bundle-quality 守門 — 三層 standing assertions**

採納 SMART app dev 的 CI 建議的高價值部分（Layer 1.1 + 1.3 + 1.4），把過去 6 份 bug report 的 pattern 變成永久 CI invariant。任何未來的 code change 如果 regress 就立刻 fail，不用等 SMART app dev 再報。

### 新檔：`backend-ts/tests/unit/bundle-quality.test.ts`

跑一份 synthetic 多醫院 bundle（涵蓋長庚嘉義 / 嘉基 / 中國北港 / 馬偕 / 北榮 5 家觀察過的 LIS pattern + 各 panel 種類）通過完整 mapper pipeline，然後驗：

- **1.1 LOINC blacklist**：任何 individual Observation 都不能用 panel-level LOINC（24317-0 / 57021-8 / 24356-8 / 11555-0 / 20584-9 / 90991-1）— 除非 display 完全認不出來才允許 fallback。Regression seed 直接 lock：Segment 必走 770-8、HGB-billed-as-08004C 必走 718-7
- **1.3 UCUM unit shape lint**：valueQuantity.unit 不能含全形 CJK 單位字 / `gm` / 小寫 `l` 在 concentration suffix。Regression seed：㎡ → m2、gm/dl → g/dL 經過 `_canonicalizeUnit` 後必須 pass UCUM lint
- **1.4 valueString numeric-leading lint**：valueString 開頭是數字就 fail — parser 應該抽成 valueQuantity（regression seed：`"33 (stage3:30-59)"` 等 packed pattern 必走 valueQuantity）

8 個新 test case。Backend suite 從 325 → 333 tests。

### 不採納的部分 + 為什麼

跟 SMART app dev 討論過，這些**不做**（理由都記在 CHANGELOG）：
- **NHI canonical CSV + no-hardcoded-LOINC lint**：過度設計，inline const 已是 single source of truth；refactor 到 CSV 增加 build complexity 但不增加正確性
- **FHIR R4 schema validator (Java validator_cli)**：Java 依賴拖累 CI、跑得慢；我們 mapper typecheck 已涵蓋大部分 shape errors
- **Per-performer fixture snapshots**：bridge 端沒有跨醫院 production data（只有 synthetic fixtures）；要做 SMART app dev 要先 share 脫敏 raw NHI
- **Fuzzer / property-based**：scope 太大；先靠 1.1/1.3/1.4 守門

更重要的：**不採納 "single canonical NHI → LOINC table" 的根本建議**。我們的設計是 `(NHI code, display) → LOINC`，不是 `code → LOINC`，因為 panel code 一定會有多個 sub-row。SMART app dev 看到的「per-text 不一致」是 panel disambiguation 正確展開 — by design 而不是 bug。

### 升級

純 test 新增 + version bump，logic 沒變。Reload extension 即可。Backend mode 不需要 rebuild container（因為只有 test 變動）。

---

## 0.10.0 重點 — 2026-05-27

**📦 Bundle traceability + 用藥劑量推導 + 完成延後的 panel tables**

針對 SMART app dev 的 U1 / U4 unsolved items（U2 不能修見下方）+ 收尾 v0.9.10 audit 留下的 4 個 TODO panel。0.10.0 是 Chrome Web Store 上架前最後一個 0.x，1.0.0 預計就是上架版。

### U4 — Bundle 加版本標記

之前只在檔名（`nhi-...-v0.9.x.json`），檔案被改名後就追不到。現在 `Bundle.meta.tag` 加 bridge version：
```json
"meta": {
  "tag": [{
    "system": "https://github.com/voho0000/NHI-FHIR-BRIDGE/bridge-version",
    "code": "0.10.0",
    "display": "NHI-FHIR-Bridge v0.10.0"
  }]
}
```
SMART app dev 之後報 bug 直接從 bundle 內挖版本，不再依賴檔名。

### U1 — MedicationRequest.dosageInstruction 推導

之前 758/758 都沒 dosageInstruction。NHI 健保存摺 IHKE3306S02 **真的沒有獨立的「用法」欄位**，但有「給藥日數」+「給藥總量」。把比值推成文字：
- qty=30, days=30 → `"30 dose(s) over 30 day(s) (≈ 1/day)"`
- qty=60, days=30 → `"60 dose(s) over 30 day(s) (≈ 2/day)"`（BID pattern）

優先順序：structured dose/freq > raw `dosage_text` > 推導文字 > 不出 dosageInstruction。**Faithful transport 不破** — value 全部來自 NHI raw，bridge 只是算了比值貼上 label。

### Panel tables 收尾（v0.9.10 audit 留的 TODO）

完成 3 個 panel（08128B 骨髓細胞 LOINC 不確定，繼續 TODO）：

- **09065B 蛋白電泳（SPE）** — Albumin/α1/α2/β/γ globulin + A/G ratio 各對到自己的 LOINC（2865-7 / 2867-3 / 2868-1 / 2869-9 / 2871-5 / 1759-0）
- **12204B Flow cytometry CD markers** — CD3/CD4/CD8/CD19/CD56/CD4-CD8 ratio 各對到自己（8124-0 / 8123-2 / 8128-1 / 8118-2 / 8125-7 / 54218-3）
- **17009B DLCO** — DLCO / VA / DLCO/VA 各對到自己（24341-0 / 19850-7 / 19911-7）

每個 panel 都加 fallback：display 空白時走原 NHI_TO_LOINC（panel-level LOINC）。

### 沒修的：U2 + U3（標記為 blocked）

- **U2 Encounter.participant**：NHI IHKE3303 raw 沒有 attending physician field。修等於憑空造 data，違反 faithful transport。需要 NHI 開新 endpoint 才能修
- **U3 valueString packed multi-data point**：v0.9.7 已修了 `"33 (stage3:30-59)"` 跟 `"2.3(36.1%)"` 等常見 pattern。如果還有 broken case 需要 SMART app dev 給具體 failing example 才能擴充 parser

### 升級

Reload extension。Backend mode 需要 `docker compose up -d --build`。

---

## 0.9.10 重點 — 2026-05-27

**🔬 多分項 panel LOINC audit + 修 PT/INR + 補 16008C 體液 panel**

跟 SMART app dev 沿用同一個討論線：再 audit 一次「同個 NHI 碼底下多個 sub-row」的潛在 bug，按嚴重度排序處理。

### 已修

**08026C PT/INR**（必修，高影響）
- Taiwan labs 同一 billing code 出 PT (秒) + INR + 可選 PT control 三 sub-row
- 之前全部塌到 `6301-6` (INR) → 抗凝血 trend view 會把 PT=12 sec 標成 INR=12（爆表 critical 假象）
- 改 `08026C` 進 `DISPLAY_FIRST_CODES` + 新增 `PANEL_LOINC_MAP["08026C"]`：
  - PT → `5902-2`（Prothrombin time）
  - INR → `6301-6`（International Normalized Ratio）
  - PT Control → `5894-1`（PT Control reagent）
  - 空 display fallback 仍走 `6301-6`（INR 是抗凝追蹤的主指標）

**Part 6 — 多醫院 LOINC audit（SMART app dev report）**

跨 4 個 hospital 一次 audit，重新確認 bridge 用 `(NHI code, display) → LOINC` 全域查表（之前只有 panel 碼這樣做，現在擴大 scope）。Faithful transport 原則不變 — 不亂加 / 改 NHI 沒給的 data；但 LOINC 對應錯誤可以修正。

- **N1 partial**（長庚嘉義）：display=`"血球比容值測定"`（7 字 CJK）沒命中現有 HCT key → 24317-0 fallback。`CBC_COMPONENT_KEYS` 補 `血球比容`（4 字）關鍵字
- **N2**（多家醫院）：UACR 報告把 microalbumin 跟 urine creatinine 都 bill 在同一 code（09016C / 12111C）→ microalbumin 全部塌成 2161-8。新增 `URINE_BIOCHEM_KEYS` const + 09016C/12111C 升級進 DISPLAY_FIRST_CODES
- **N3**（中國北港醫）：CBC differential bill 在 08002C（WBC count code）而非 08013C → diff cells 全部塌到 6690-2 (WBC)。抽 `CBC_DIFF_KEYS` 共用 const + spread 進所有 CBC sibling panel（08002C/08003C/08004C/08006C），08013C 也 refactor 用同一 const
- **N7**（長庚嘉義）：1 row display=`"Neutrophil"` 完全沒 NHI code → 整個 coding array 空。global LOINC_MAP 補 neutrophil/basophil/lymphocyte/monocyte → /100 leukocytes form（Taiwan LIS diff 主流 unit）
- **N5/N6**（多家醫院）：UCUM unit 正規化
  - 全形 `㎡`（U+33A1）→ `m2`
  - `gm/dl` / `gm/dL` → `g/dL`（UCUM "g" 不是 "gm"，"L" 大寫）
  - `mg/dl` → `mg/dL`（純大小寫修正）
  - `_canonicalizeUnit` 擴成兩 class：bogus unit fill-in + non-UCUM symbol normalization

### N4（已修，在 v0.9.10 前次 commit）

長庚嘉義 display=`"Segment"`（沒 -ed 後綴）→ 57021-8 panel fallback。前次 commit `0b5b6b5` 已加 6 個 singular/short variant key。

### N1 嘉基 "Ht" + 長庚 HGB-under-08004C（已修，在 Part 5 commit）

詳見下方 Part 5 section。

### 設計筆記：`(code, display) → LOINC` 全域查表

之前的「faithful transport」原則是：NHI billing code 為主，display 只在 panel scope 內 disambiguate。Part 5 + Part 6 把這個 model 擴大成**所有** NHI code 都可以走 `(code, display)` 查表（不只 panel）。當 display 跟 billing code 的 nominal analyte 衝突時（嘉基 HGB-under-08004C / Microalbumin-under-09016C）→ display 贏。Scope 限在 CBC + urine 家族（display 高度標準化、跨 analyte swap 是已觀察 bug）。

⚠️ **不是** silent 改 NHI 沒給的 data — value/unit/date/performer 全部從 raw 直接 carry；只有 LOINC tag 是 bridge 推斷的。這跟 faithful transport（不亂加不亂改）相容。

**CBC sibling 顯示 vs billing 對調修補**（SMART app dev Part 5 報告 — 嘉基 case，patient safety 級）
- 嘉基某次 CBC report：row billed `08004C`（HCT）但 display text 寫 `"HGB"`、value 13 g/dL（明顯是 hemoglobin 數值；HCT 正常 30-50%）
- v0.9.9 行為：NHI billing code 直接 win → 給 4544-3 (HCT LOINC) → SMART app HCT trend 欄顯示 13（看起來像 critical anemia / lab error）
- 另一個 row display=`"Ht"` 沒有 key 命中 → fallback 到 08011C panel LOINC 24317-0 → SMART app 不認識 → 整 row 被丟掉
- 修法：
  - 抽 `CBC_COMPONENT_KEYS` 共用 const（hgb/hct/wbc/rbc/plt 各種變體，含新增的 `ht` / `h.t.` / `%ht`）
  - 把 08002C / 08003C / 08004C / 08006C 四個單一 analyte billing code 升級進 `DISPLAY_FIRST_CODES`，shared the same panel table
  - 結果：unambiguous display text（"HGB" / "HCT" / "Hb" / "Ht"）會 override 醫院 LIS 的 label-billing 對調
  - Defensive fallback：display 空白 → 還是走 NHI_TO_LOINC（顯示 billing code 原意）
- ⚠️ 此修法**部分突破** v0.9.x 之前的 "faithful transport" 原則 — 但 scope 嚴格限在 CBC 家族，因 display 高度標準化、誤判風險低；同時 patient-safety impact 高（看到 HCT=13 會誤判 critical case）

**08013C Segment（CBC w/ diff）**（SMART app dev Part 4 報告）
- v0.9.6 已修了 Basophil/Eosinophil/Lymphocyte/Monocyte，但有醫院 NHI 顯示用 `Segment`（沒 -ed），現有 key `segmented` 沒命中 → fallback 到 panel LOINC `57021-8`
- 補 `segment` / `segments` / `seg` / `seg.` / `neut. seg` / `neut seg` 6 個變體 → `770-8` (Neutrophils/100 leukocytes)

**16008C 體液 panel**（順手修）
- 之前在 `DISPLAY_FIRST_CODES` 但沒對應 `PANEL_LOINC_MAP` → 走 global table，shorter generic key（如 `wbc` → 6690-2 BLOOD WBC）可能 shadow body-fluid 專用 LOINC
- 新增 `PANEL_LOINC_MAP["16008C"]`：SF.WBC → `26466-3`、SF.Neutrophil → `10328-6`、SF.Lympho → `13046-8`、SF.Color → `5778-6`

### 延後（加 `TODO(panel)` 註解標記）

不會進累積報告、SMART app pivot-by-LOINC 風險低 → 等真的踩雷再修：

- **09065B** 蛋白電泳（SPE）— 5 fraction 全塌到 90991-1
- **12204B** Flow CD markers — CD3/CD4/CD8 等全塌到 20584-9
- **17009B** DLCO — DLCO + VA + DLCO/VA 全塌到 24341-0
- **08128B** 骨髓細胞形態 — morphology + 各細胞 % 全塌到 47286-0

### 新增 test

`backend-ts/tests/unit/observation-mapper.test.ts` 補 9 個 panel 行為測試：PT/INR/Control 三向 LOINC + defensive non-collapse + 16008C 4 個 SF.* member。

### 升級

純 mapper logic 變更 — Reload extension 即可。Backend mode 需要 `docker compose up -d --build` 才會帶到新 LOINC table。

---

## 0.9.9 重點 — 2026-05-27

**🐛 修：切換病人後身分證號顯示舊病人 cid**

`savePatientOverride` 順序問題 — 先把 `ov.id_no = prevStored?.id_no` (carry forward 舊 cid)、後檢查 patient 變了沒。改成 B 病人會看到「✅ 已記住：B 的姓名 · A 的 F22345****」混淆 banner。

**修法**：先用 name/gender/dob 偵測 `patientChanged`，再決定：
- 換人 → 新 placeholder（下次 sync 帶入 B 的真實 cid）
- 同人 re-save → reuse 舊 id_no（避免 orphan backend resources）

純 popup UI 邏輯，無 bundle/backend 變動。

---

## 0.9.8 重點 — 2026-05-27

**SMART app dev bug report Part 3** — 7 個 issue 中修了 5 個（C1 / C2 / C3 / C4 / C5 / C6 scaffold）。剩 2 個（C7 encounter physician + diagnosis link）延後到下版。

### C1 — ABE / SBE 共用 LOINC 11555-0 → 拆開（HIGH）

| Analyte | 之前 | 現在 |
|---------|------|------|
| ABE (Actual Base Excess) | 11555-0 ❌ | **1925-7** ✅ |
| SBE (Standard Base Excess) | 11555-0 ❌ | **1927-3** ✅ |

### C2 — eGFR 帶 NHI 單位「N」自動正規化（HIGH）

新增 `_canonicalizeUnit` whitelist：display 含 eGFR 關鍵字 + unit 是 `N`/空 → 改寫 `"mL/min/1.73m2"`。其他 analyte 不動避免 silently rewrite。

### C3 — VGH bracket 慣例 `[Negative][]` → 拆框（MEDIUM）

`text: "[Negative][]"` → `text: "Negative"`（自動拆框、保留 categorical 資訊）。同理 Yellow / Nonreactive 等。

### C4 — 「正常」/「異常⋯」誤入 referenceRange → 路由到 interpretation（LOW）

偵測到結果解讀 phrase → 不再作為 `referenceRange`、改放 `Observation.interpretation`。已知 phrases 對應 `normal`/`abnormal` coded；其他純文字。

### C5 — 檢體 + 閾值打包 `[][Random Urine＜ 1.9]` → 結構化（LOW）

- `appliesTo: [{ text: "Random Urine" }]`
- `high: { value: 1.9, unit: ... }`

### C6 — Adapter 試多個 NHI 用法 field name（scaffold）

之前 hard-coded `dose=""/frequency=""`。現在 adapter 試 ~15 個可能 NHI raw field name，找到就傳 → mapper 設 `dosageInstruction[0].text`。**目前 fixture 沒符合**任何 field → 輸出不變；需要 SMART app dev 確認 NHI 確切 field 名才能完全 fix。

### 升級注意

**Mode B**：`git pull && docker compose down && docker compose up -d --build`

### 出範圍

- C7 Encounter participant + diagnosis link → 下版
- SBC LOINC（1925-7 跟 ABE 衝突，SBC 罕用、留 follow-up）
- dosageInstruction 結構化 timing/dose → 下版

### Tests

backend-ts: 275 → **288** (+13)、extension: 142（snapshot 重生）、biome lint: 綠

---

## 0.9.7 重點 — 2026-05-27

**🚨 兩個 patient-safety 等級 bug 修正**（SMART app dev bug report Part 2）

### Bug A — eGFR 被誤標成肌酸酐 LOINC

NHI 09015C 是「血中肌酸酐」，但實驗室在同 code 下用 sub-row 報告 eGFR。Bridge 沒做 panel 處理 → eGFR 也被標成 2160-0（肌酸酐）→ SMART app 把 eGFR=33 顯示成 CREA=33 mg/dL → **看起來像急性腎衰竭**。

| Analyte | 之前 | 現在 |
|---------|------|------|
| eGFR / Estimated GFR / 腎絲球過濾率 | 2160-0 (Creatinine) ❌ | **33914-3** ✅ |

修法：09015C 加進 `DISPLAY_FIRST_CODES` + 新增 `PANEL_LOINC_MAP["09015C"]`。

### Bug B — 「打包」型 valueString 拆不出數值

NHI 有時把「數值 + 註解」擠在同欄位，`tryParseQuantity` 解析失敗就 fall back 到 valueString，丟失數值。

| 原始字串 | 之前 | 現在 |
|---------|------|------|
| `33 (stage3:30-59)` (eGFR + CKD 階段) | valueString | **valueQuantity=33** ✅ |
| `2.3(36.1%)` (Albumin) | valueString | **valueQuantity=2.3** ✅ |
| `4+ (2000)` (尿糖 dipstick) | valueString | **valueQuantity=2000** ✅ |
| `1+ (80)` (UACR) | valueString | **valueQuantity=80** ✅ |
| `1:20(-)` (titer) | valueString | valueString（不變，本質非數字） |

修法：`tryParseQuantity` 在原本失敗時先試「`(` 前 token」(eGFR/Albumin)、再試「括弧內容」(dipstick)。

### 為什麼之前沒抓到

- 過去 LOINC audit 查 `NHI_TO_LOINC` 直接表，沒走 panel codes 的 display-keyword 路徑。09015C 看起來是 single analyte 但其實是隱性 panel。
- valueString packing 模式不在 unit test fixture 內，要有真實患者 NHI 回應才看得到。

### 升級注意

**Mode A**：Reload extension。之前 sync 過的舊資料不會自動修正 — 重 sync 一次才會用新 LOINC + 拆 packed values。

**Mode B**：
1. `git pull`
2. `docker compose down && docker compose up -d --build`
3. Reload extension
4. 重 sync 病人資料

### 出範圍

- ABG panel (09041B) PANEL_LOINC_MAP 仍是 stub，pH / pCO2 / pO2 可能類似問題
- 拆兩個 Observation 模式（如 albumin abs + frac）未實作 — 後續考慮

### Tests

backend-ts: 265 → **275** (+4 eGFR + 7 packed-value parser tests)

---

## 0.9.6 重點 — 2026-05-27

**🔬 CBC 檢驗 LOINC 對映修正**（SMART app dev bug report）

NHI CBC panel codes 08011C (基本 CBC) 跟 08013C (含分類計數) 的多項 analyte 帶到錯誤的 LOINC，下游 SMART app 信 LOINC 為主時會把資料路由到錯誤欄位（例如 MCV 95.2 fL 被當成 RBC、但 RBC 正常範圍是 4-6 M/uL）。

### 修正前 → 修正後

| Analyte | 修正前 LOINC | 修正後 LOINC |
|---------|-------------|-------------|
| MCV (平均紅血球容積) | 789-8 (RBC) ❌ | **787-2** ✅ |
| MCHC | 24317-0 (panel) ❌ | **786-4** ✅ |
| RDW | 24317-0 (panel) ❌ | **788-0** ✅ |
| Basophils% | 6690-2 (WBC) ❌ | **706-2** ✅ |
| Lymphocytes% | 6690-2 (WBC) ❌ | **736-9** ✅ |
| Monocytes% | 6690-2 (WBC) ❌ | **5905-5** ✅ |
| Neutrophils% | 6690-2 (WBC) ❌ | **770-8** ✅ |
| Eosinophils% (08013C) | 711-2 (count) ❌ | **713-8** ✅ |

所有 LOINC 都到 loinc.org 確認 Long Common Name。

### 為什麼之前沒抓到

之前的 LOINC audit (2026-05-19) 查的是 `NHI_TO_LOINC` 直接表，**沒走進 panel codes 的 display-keyword 比對路徑**。CBC panel 在 `DISPLAY_FIRST_CODES` 但 `PANEL_LOINC_MAP` 沒有對應 entry → fall through 到全域 `LOINC_MAP` → 較短的「紅血球」/「白血球」CJK key 比較容易命中 → 多個 analyte 被誤標。

### 修法

`packages/mapper/src/loinc-tables.ts` 新增：
- `PANEL_LOINC_MAP["08011C"]` — RBC 指標 (MCV/MCH/MCHC/RDW) + HCT + HGB + RBC + WBC + PLT
- `PANEL_LOINC_MAP["08013C"]` — 分類計數 % LOINCs

加 13 個 regression test，backend test suite 252 → 265 全綠。

### 升級注意

**Mode A user**：Reload extension 即可。之前 sync 過的舊資料不會自動修正 — 重 sync 一次才會用新的 LOINC。

**Mode B user**：
1. `git pull`
2. `docker compose down && docker compose up -d --build`
3. Reload extension
4. 重 sync 病人資料

### 出範圍

ABG panel (09041B) 可能有同類問題，之後另開議題。

---

## 0.9.5 重點 — 2026-05-27

Chrome Web Store 上架前最後一輪 UX polish。3 個必修，純文案 + UX 微調，沒有功能變動。

### 1. Manifest description 校正（reviewer 友善）

- 之前：「將健保署健康存摺頁面擷取並轉換為 FHIR R4，**透過 NHI-FHIR-Bridge 後端服務**。」
- 現在：「將健保署「健康存摺」就醫、用藥、檢驗紀錄轉換為 FHIR R4 標準格式，**資料只在本機處理**。」

99% user 用 Mode A 完全不需要後端，原文易讓 user / reviewer 誤會。新版動詞先 + 利益先。

### 2. Step 4 按鈕 + 提示明確化（避免「點開空頁」困惑）

按鈕加「**新分頁**」字尾，提示明確標步驟：「使用方法：點下方按鈕 → 新分頁會打開「醫析 MediPrisma」**空白頁面** → 把剛下載的 JSON 檔拖到頁面上...」。讓 user 知道 button 只是開頁面、要自己拖檔。

### 3. Mode B 連線失敗加「💡 常見原因」摺疊清單

進階 user 在 Mode B 遇到 connection failure 時，新增摺疊區列出 5 個常見原因（Docker 沒啟動 / URL 拼錯 / Chrome 沒授權 / migration 進行中 / 防火牆擋）。純 HTML+CSS 增量、無 JS 改動；既有 per-kind 提示保留。

### 升級注意

- Reload extension 即可。
- 純 UI / 文案，bundle 內容跟 v0.9.4 完全一樣。
- **Chrome Web Store 上架候選版** — 接下來只剩 user 端準備（截圖、Trader 驗證、表單填寫）。

---

## 0.9.4 重點 — 2026-05-27

純 UX 改進 — popup 永遠顯示的「免責聲明卡」下方新增一段**安全保證**，讓對「資料會不會被偷偷上傳」有疑慮的 user 在每個 step 都看到 reassurance：

```
┌──────────────────────────────────┐
│ 免責聲明              v0.9.4     │  ← 黃色（既有）
│ 本工具僅供參考。產生的資料…       │
├──────────────────────────────────┤
│ 🔒 你的健康資料只在你電腦上處理， │  ← 藍色（新增）
│ 不會傳送到任何雲端伺服器。        │
│ 安全說明 ↗                       │
└──────────────────────────────────┘
```

「**安全說明 ↗**」連到 `docs/SECURITY_FOR_USERS.md`（v0.9.3 新加的 layperson 友善安全文件）。

兩段分黃藍配色語意不同：
- 免責聲明 = 「什麼可能會錯」(warning)
- 🔒 安全保證 = 「什麼不會發生」(info)

混同段會打架，分開讀者更好理解。

### 升級注意

- Reload extension 即可。
- 純 UI，沒有功能變動、bundle 內容跟 v0.9.3 完全一樣。
- Popup 高度增加 ~30-40px — 仍在 360px 寬度設計範圍內。

---

## 0.9.3 重點 — 2026-05-27

獨立安全 audit 後的修補版 + 同步速度優化。0 個 P0/P1，把 P2/P3 一次清。

### 🔒 Security audit 修補（6 項）

- **P2 #1** Dashboard `/api/backend/*` proxy 加 Origin check — 防 CSRF
- **P2 #2** 進階設定的 SMART App URL 驗 scheme — 必須 https:// 或本機
- **P2 #3** PRIVACY.md / README 修正 `chrome.storage.sync` → `.local`（code 比 docs 更安全）
- **P3 #4** 上架版本不含 inline sourcemap — `.crx` 大小縮 ~3.7×（1.1MB → 280KB）
- **P3 #6** 刪除 stale Python `test.yml` workflow
- **P3 #7** popup.js onMessage sender check 嚴格化（對齊 background.js）

### ⚡ 同步速度 — 省 10-15 秒

NHI detail fan-out 的 jitter 從 `0-150ms` 縮到 `0-50ms`（6 處 fan-out）。對 imaging (110 筆) / chronic (508 筆) / encounter (164 筆) 大量 fan-out 累積可省 10-15s。並發數 `CONC=3` 維持以避免 NHI rate limit。

### 📄 新增「給民眾的安全說明」

`docs/SECURITY_FOR_USERS.md` — 給對安全性有疑慮、不敢用的 user 看。不講工程術語，涵蓋資料路徑視覺化、12 項「不做的事」、12 項「主動防護」、自我驗證指引、user 端責任、6 個 Q&A。

### 升級注意

- Reload extension 即可。
- 「下載 zip 自行載入」的 user 這版 `.crx` 從 ~330KB 縮到 ~97KB。
- 無 breaking change。

---

## 0.9.2 重點 — 2026-05-27

### 🔧 Encounter.type FHIR-conformant 升級（破壞性變更）

修正 SMART app dev 回報的 bug：`Encounter.type` 把 **kind**（門診/急診/住院/藥局）跟 **channel**（IC卡資料/申報資料）擠在同一個 text 欄位，藥局或住院 case 時 channel 資訊遺失。

v0.9.2 拆成兩個 CodeableConcept，每個自帶 `coding.system` URI 區分 dimension：
- `https://nhi-fhir-bridge.github.io/CodeSystem/encounter-kind`（門診/急診/住院/藥局）
- `https://nhi-fhir-bridge.github.io/CodeSystem/encounter-channel`（申報資料/IC卡資料）

FHIR-idiomatic：不依賴 array 順序、generic SMART app 也能 parse。詳見 `docs/SMART_APP_INTEGRATION_v0.9.2.md`。

**SMART app dev 注意**：用 `encounter.type.find(t => t.coding[0].system === ...)` 找對應 dimension，不要 hard-code `type[0]`。

### 📝 民眾友善文案大掃除（26 處）

獨立 UX audit 後挑出所有 layperson 不懂的字眼。全部修完：

**Critical**
- 「🔒 NHI session 已登出 — 請在 NHI tab 重新登入後再點 Sync」→「🔒 健保存摺登入逾時 — 請回到健保存摺分頁重新登入，然後再按『取得健保存摺資料』」
- 「popup」「banner」「Launch」「本機後端」等英文 / 工程術語全部換成中文 / 民眾語
- 「還沒有病人身分證」→「還沒有身分資料」（避免被誤解為「要再交身分證」隱私恐慌）
- 「未檢測」「檢查中」→「尚未檢查」「確認中」（檢測會被誤解為篩檢 / 驗血）
- 進階設定 tooltip 拿掉 Docker / Dashboard / SMART App 三個英文名詞連發

**Confusing**
- Step 2 按鈕「確定」→「儲存資料」
- mode toggle「儲存位置」→「輸出方式」（之前被誤解為選 D 槽 E 槽）
- 「停止」→「取消」
- 「Dashboard ↗」→「管理介面 ↗」
- 上傳進度條原本顯示 raw 英文 key（`上傳 encounters…`），現在自動翻譯成中文（`上傳 就醫…`）

### 升級注意

- Reload extension 即可。
- **SMART app 整合 contract 變更**：自己寫過 SMART app 對接的 dev，請對照 `docs/SMART_APP_INTEGRATION_v0.9.2.md` 更新 Encounter.type 讀法。
- 純使用 extension（下載 JSON）的 user 不受影響。

---

## 0.9.1 重點 — 2026-05-27

純 UI polish — Step 3 狀態區的視覺不協調逐一收拾。沒有功能變動。

**新增「下載完成後狀態自動更新」**
- 之前下載完，狀態訊息一直停留在「✅ 取得完成 · 已產生 N 筆」直到下次 sync 才換。現在按下載並成功儲存後，訊息會立刻更新成：
  > ✅ 已下載健康紀錄檔（共 N 筆 · X.X MB）— 接著至 ④ 查看 開啟「醫析 MediPrisma」瀏覽資料。
- 「SMART App」這種行業術語拿掉了，改用 user 在 Step 4 看到的同一個品牌名「醫析 MediPrisma」。

**新增 ✕ dismiss 按鈕**
- 狀態訊息右上角加小 ✕，讀完就可以清掉，popup 變乾淨。
- 只在**非進行中**狀態顯示（同步中不會出現、避免不小心關掉進度訊息）。

**UI 修整**
- 🎨 **「查看明細」改成 label/value 對齊清單**：拿掉每行之間的虛線分隔（之前像 1990 年代 debug table）、label 靠左 / 數字靠右、用 `tabular-nums` 把不同行的數字位數對齊。
- 🎨 **「技術細節」同樣 label/value 清單**：之前是一長行 monospace `nhi-parallel=2.6s · encounter-detail=19.7s · ...` 自動換行，現在每階段一行、時間整齊。跟「查看明細」用同樣的 disclosure 樣式。
- 🎨 **拿掉「✅ 取得完成」跟「▸ 查看明細」之間的橫線**：之前 hairline + 後續結構讓 user 覺得「太多橫線」。改用純空白分隔。
- 🎨 **CTA 阻擋提示改成藍色 info**：「請切到健保存摺分頁 · 回 ① 登入 →」之前是黃色 alarm 卡片，跟下方黃色免責聲明卡兩塊同色系疊在一起像一塊大警報。改成藍色 info palette，用 `→` 取代 `⚠️` 強化「告訴你下一步」的語意。

**升級注意**
- Reload extension 即可，bundle 內容跟 v0.9.0 完全一樣。

---

## 0.9.0 重點 — 2026-05-27

Chrome Web Store 上架前的最終打磨版。把流程跑完成 4 步、進階設定挪到齒輪、整體 UI 重做。沒有 bundle 內容變動。

**新功能**
- 🚀 **新增 Step 4「查看」**：一鍵在新分頁開啟「醫析 MediPrisma」SMART App 查看資料，user 不用再自己找書籤或搜尋。檔案手動 import（拖曳或按按鈕），無 PHI 透過 URL 傳遞，extension 跟 SMART app 完全解耦。
- ⚙️ **進階設定改成齒輪入口**：之前 inline 卡在 Step 3 占空間（即使 99% user 用不到），現在點 header 右上齒輪進獨立設定頁。「← 返回」按鈕回到原本 step，不丟失 wizard state。

**UI 重設計**
- 🎨 **Step 4 民眾友善文案**：5 個 bullet（檢驗趨勢 / 用藥時間軸 / 就醫紀錄 / 中英對照 / AI 問答）用具體例子（膽固醇、血糖、肝指數）取代 jargon，痛點 hook 直接戳「健保存摺資料散在各頁面難瀏覽」。
- 🎨 **免責聲明 + 版本號合併成 meta card**：之前 Mode A 下白色 footer 大片空白看起來未完成；現在統合一張淺奶油色卡片，header 列同時放警語標題 + Dashboard 連結 + 版本號，兩種 mode 視覺平衡。
- 🎨 **設定頁標題降權**：「進階設定」從 H1-粗體-深藍改成 12px-中字-灰色 label，跟旁邊低調的「← 返回」按鈕視覺對等。

**Bug 修正**
- 🐛 **移除誤導警告**：Step 4 之前在「user 下載完 → session storage 被清掉」的合法狀態下會跳「⚠️ 還沒有健康紀錄檔可載入」，但 user 本機已經有檔案。直接砍掉這個警告。
- 🐛 **匯入按鈕文字校正**：popup hint 從「Import 按鈕」改成「匯入資料」（對齊 MediPrisma 實際按鈕名），並同時提到拖曳跟按鈕兩種方式。

**Docs**
- `docs/PRIVACY.md` 補一段澄清：popup 介紹的「醫析 MediPrisma」是獨立第三方產品，其 AI 功能會將資料送到雲端 AI 供應商；本擴充功能本身完全不接觸 AI／LLM。

**升級注意**
- Reload extension 即可，bundle 資料跟 v0.8.8 完全一樣。
- 進階設定的位置從 Step 3 inline 摺疊區改到 header 右上齒輪 ⚙️。
- 第一次使用 Step 4 時注意把剛下載的 JSON 拖進去（或按匯入按鈕）。

---

## 0.8.8 重點 — 2026-05-25

獨立 security audit 後的硬化版，主要縮小 PHI 在 chrome.storage 的暴露面，為上 Chrome Web Store 做準備。沒有新功能，bundle 內容跟 v0.8.7 完全一樣。

**安全強化**
- 🔒 **下載完成後立刻清除暫存 bundle**：之前下載完，整份 FHIR Bundle 還會留在 chrome.storage.local 直到 user 手動清。現在 user 按下下載完成的瞬間就清掉。
- 🔒 **暫存從 local 改用 session storage**：關閉瀏覽器自動清空。即使 user 忘了下載，重開 Chrome 就乾淨。
- 🔒 **1 小時 TTL 自動清掃**：sync 完忘了下載又沒關瀏覽器的情境，1 小時後 chrome.alarms 自動清掉。
- 🔒 **升級時清掉舊版殘留**：v0.8.7 以前留在 chrome.storage.local 的 `pendingFhirBundle` 跟 `__sampleBody_*` 在 onInstalled 時自動掃乾淨。
- 🔒 **debug 用 raw payload stash 預設關閉**：`__sampleBody_*`（包含 NHI 原始 payload）改成 source-only flag，published 版完全不寫。
- 🔒 **拒絕其他 extension 的訊息**：在 chrome.runtime.onMessage 加 `sender.id` 檢查，防止別人裝的惡意 extension 透過 chrome.runtime.sendMessage 觸發 sync 到攻擊者 backend。

**UX 改進**
- 💾 **下載改為「另存新檔」對話框**：之前直接落到 Downloads 夾，現在 Chrome 會跳原生 save-as 視窗，user 自己選位置 + 確認檔名。對 PHI 來說是更好的 UX。
- 🪧 **改姓名/性別/生日視為換人**：之前只有切換 NHI 帳號才會清舊 bundle，現在改任一身分欄位都會清。診間多人共用同一 NHI session 時，避免下載到「檔名是新病人但內容是舊病人」的混合 bundle。

**升級注意**
- Reload extension 即可，bundle 資料跟 v0.8.7 完全一樣。
- 升上來時舊的 chrome.storage.local pendingFhirBundle 會被自動清掉，**升級前沒下載的 bundle 會失去**，需要重 sync。
- 之後下載時會跳「另存新檔」對話框，要習慣一下。

**準備上 Chrome Web Store**
- 新增 `docs/PRIVACY.md`（雙語隱私權政策，準備搭配 GitHub Pages 公開作為 Chrome Web Store privacy policy URL）。
- 新增 `docs/CHROME_STORE_LISTING.md`（dev console 表單填料 cheat sheet：描述、permission justifications、隱私揭露）。

---

## 0.8.7 重點 — 2026-05-21

純 UX 修字 — popup 同步進度條把兩個工程師用語改成民眾看得懂的話。

**UX 修正**
- 🪧 **「NHI 後端 detail JOIN 較慢」拿掉**：v0.8.5 加進去解釋 sync 慢的原因，但 `detail JOIN` 是資料庫術語、民眾看不懂。改成跟其他 4 個 fan-out 一致只顯示 elapsed 秒：`📥 取得 163 筆就醫紀錄詳情…（已 27 秒）`。
- 🪧 **「FHIR 資源」→「健康資料」**：FHIR 是健康資訊產業的縮寫，一般民眾不認得。換成「健康資料」直觀又準確。

**升級注意**
- 純 UX，bundle 內容跟 v0.8.6 完全一樣。Reload extension 即可。

---

## 0.8.6 重點 — 2026-05-21

住院 (IHKE3309) Encounter 補上 S02 detail enrichment — 跟 v0.8.4 對 OPD encounter 同 pattern，這次蓋到住院記錄。

**Bug 修正**
- 🏥 **住院 Encounter primary ICD 英文 + 次診斷補齊**：IHKE3309S01 list 只 ship icd9cm_CODE_CNAME 中文 ("咳血") 沒雙語、且沒次診斷欄位；IHKE3309S02 detail (ctype=3) 有完整雙語 + 12+ 次診斷（住院 case 鑑別診斷比 OPD 豐富）。新增 detail fan-out + helper 泛化、現在住院 Encounter 跟 OPD 同水準的 bilingual + 多 reasonCode。
- 🧹 **`_pickS02MainRow` helper 抽出**：S02 body 處理泛化到任何 `ihke<N>S02_main_data` key，未來新 detail endpoint 直接 reuse。

**升級注意**
- Reload extension + 重 sync 拿新資料。
- 預期效果：住院 Encounter `.reasonCode[0].coding[0].display` 變英文；多診斷住院會出現 `.reasonCode[1..N]`。
- Sync 時間再增 ~10-20s（住院 visit 數 × S02 fetch 成本）。

---

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

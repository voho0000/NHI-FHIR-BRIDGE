# Changelog

All notable changes to NHI-FHIR-Bridge are documented here.
Newest first. GitHub Releases page keeps the latest version only; this file is the authoritative history.
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

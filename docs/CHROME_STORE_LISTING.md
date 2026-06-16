# Chrome Web Store Listing — Copy/Paste Cheat Sheet

填 Chrome Web Store developer console 表單時直接從這裡複製。順序大致照表單流程排。

---

## 1. 基本資訊

| 欄位 | 值 |
|------|----|
| **Item name** | `NHI-FHIR Bridge` |
| **Category** | Productivity（或 Developer Tools 二擇一，Productivity 比較貼近 end user） |
| **Language** | 繁體中文（zh-TW），可選擇性加 English |

---

## 2. 描述

### Short description（≤132 字元，繁中）

```
將台灣健保署「健康存摺」的就醫、用藥、檢驗、影像紀錄一鍵轉成 FHIR R4 國際標準格式。資料只在本機處理，不上雲、不接 AI。
```

字數：63 字（含標點），遠低於 132 字元上限。

### Short description (English, ≤132 chars)

```
Convert your Taiwan NHI "My Health Bank" records (visits, meds, labs, imaging) into FHIR R4 — locally, no cloud, no AI.
```

字數：117 字元。

### Long description（繁中，建議 500-1500 字）

```
NHI-FHIR Bridge 把你在健保署「健康存摺」(myhealthbank.nhi.gov.tw) 上的個人醫療紀錄，一鍵轉換為 HL7 FHIR R4 國際標準格式，方便你做個人健康資料備份、研究分析、或匯入任何能讀 FHIR 的軟體（例如 SMART on FHIR App）。

▍它能做什麼
• 擷取以下健康存摺資料並轉為 FHIR：
  - 就醫紀錄（門診、急診、住院）→ Encounter
  - 用藥紀錄（含慢性處方箋）→ MedicationRequest
  - 檢驗檢查結果 → DiagnosticReport + Observation（內建 200+ 條檢驗項目對 LOINC 對照規則）
  - 影像檢查報告 → DiagnosticReport
  - 過敏紀錄 → AllergyIntolerance
  - 手術紀錄 → Procedure
  - 預防接種 → Immunization
  - 成人/癌症預防保健 → Observation
  - 重大傷病登錄 → Condition
• 中英雙語：診斷碼 (ICD-10-CM)、藥品名稱、檢驗項目同時保留繁體中文與英文
• 兩種使用模式：
  - 純 Extension：擷取資料 → 下載成 FHIR Bundle JSON 檔（不需任何後端）
  - Extension + Backend：搭配自架本機 FHIR 後端 + Dashboard + SMART App 整合

▍隱私與安全
• 零資料收集：開發者及任何第三方完全無法存取你的資料
• 沒有 AI、沒有 LLM、沒有雲端、沒有 telemetry
• 資料只在你的瀏覽器與你自己的電腦上處理
• 開放原始碼 (Apache License 2.0)，可自行檢查所有程式碼

▍使用前提
• 你必須是健保署「健康存摺」的合法使用者（用自己的健保卡登入）
• 僅供擷取「使用者本人」的紀錄，擷取他人資料屬違法行為
• 本工具僅供參考，臨床判讀請以健保署官方頁面顯示為主

▍開源專案
GitHub：https://github.com/voho0000/NHI-FHIR-BRIDGE
授權：Apache License 2.0
回報問題：請至 GitHub Issues

▍免責聲明
NHI 偶有 API schema 變動，可能造成輸出與真實情況不一致。臨床判讀或正式用途請以健保署官方網站為準。
```

### Long description (English)

```
NHI-FHIR Bridge converts your personal health records from Taiwan's NHI "My Health Bank" portal (myhealthbank.nhi.gov.tw) into the HL7 FHIR R4 international standard format. Use it for personal health record backups, research, or import into any FHIR-compatible software (e.g. SMART on FHIR apps).

▍What it captures
• Encounters (outpatient, ER, inpatient) → FHIR Encounter
• Medications (including chronic prescriptions) → MedicationRequest
• Lab and exam results → DiagnosticReport + Observation (200+ lab-item-to-LOINC mapping rules)
• Imaging reports → DiagnosticReport
• Allergies → AllergyIntolerance
• Surgical procedures → Procedure
• Immunizations → Immunization
• Adult / cancer preventive screening → Observation
• Catastrophic illness registry → Condition

▍Bilingual data
Diagnosis codes (ICD-10-CM), medications, lab items all preserve both Traditional Chinese and English.

▍Two usage modes
• Extension-only: capture → download a FHIR Bundle JSON file (no backend needed)
• Extension + Backend: pair with a self-hosted local FHIR backend, dashboard, and SMART app integration

▍Privacy and security
• Zero data collection: the developer and third parties have no access to your data
• No AI, no LLM, no cloud, no telemetry
• Data is processed only in your browser and on your own machine
• Open source under Apache License 2.0

▍Prerequisites
• You must be a legitimate user of Taiwan's NHI "My Health Bank" (logged in with your own NHI card)
• Only for capturing your own records; capturing others' data is illegal

▍Project
GitHub: https://github.com/voho0000/NHI-FHIR-BRIDGE
License: Apache License 2.0
Issues: please file at GitHub Issues

▍Disclaimer
NHI API schemas occasionally change, which may cause discrepancies between output and the official portal display. For clinical decisions, the NHI official portal is authoritative.
```

---

## 3. Single Purpose（單一用途）

表單裡會問「Single purpose」，貼這段：

```
將台灣健保署「健康存摺」(myhealthbank.nhi.gov.tw) 之個人醫療紀錄擷取後，轉換為 HL7 FHIR R4 國際標準格式，供使用者作為個人健康資料備份或匯入相容軟體之用。
```

英文版（如要）：

```
Capture personal medical records from Taiwan's NHI "My Health Bank" portal (myhealthbank.nhi.gov.tw) and convert them into the HL7 FHIR R4 international standard format for the user's personal health record backup or import into FHIR-compatible software.
```

---

## 4. Permission Justifications

表單會逐一要求說明每個權限為何必要。一個權限一句話：

### Permissions

| 權限 | 一句話說明（複製這個） |
|------|---------------------|
| `activeTab` | 使用者點擊擴充功能圖示時，存取當前健保署分頁以執行 API 請求並擷取本人醫療紀錄。 |
| `storage` | 在本機儲存使用者偏好設定（性別、出生年）、同步進度，以及暫存待下載的健康紀錄檔（下載完成、使用者清除、或 1 小時 TTL 到期即刪除）。資料僅存在 chrome.storage，不傳送至任何外部伺服器。 |
| `scripting` | 將資料擷取邏輯注入健保署網域分頁；必須在頁面 context 執行，才能使用瀏覽器既有的 first-party session cookie 呼叫健保署 API。 |
| `downloads` | 將擷取轉換後的 FHIR Bundle JSON 檔儲存至使用者本機 Downloads 資料夾，由使用者點擊按鈕主動觸發。 |
| `alarms` | 維持 Chrome MV3 service worker 在長時間同步（30 秒以上）過程中不被回收，確保資料完整擷取；並每 10 分鐘執行清掃，刪除逾時（1 小時）的本機暫存健康紀錄檔。 |
| `unlimitedStorage` | 含醫療影像的健康紀錄檔可能超過 chrome.storage 預設配額，需要此權限才能在本機暫存；暫存於下載完成或 1 小時 TTL 後即清除，不傳送至任何外部伺服器。 |

### Host permissions（安裝時要求）

| Host | 一句話說明 |
|------|----------|
| `https://myhealthbank.nhi.gov.tw/*` | 擷取使用者本人在台灣健保署「健康存摺」的醫療紀錄；這是本擴充功能的唯一資料來源。 |

安裝時**只**要求這一個 host permission。一般使用者（下載健康紀錄檔模式）全程不需要其他主機權限。

### Optional host permissions（v0.18.6 起，安裝時不要求；啟用後端模式時才動態請求）

| Host | 一句話說明 |
|------|----------|
| `http://localhost/*` | （選用）使用者自架本機 FHIR 後端時，將擷取的 FHIR 資源上傳至 localhost。**列為 optional_host_permissions**：安裝時不請求，僅在使用者於進階設定主動啟用「上傳後端」模式時，由 `chrome.permissions.request()` 在使用者操作當下請求授權。 |
| `http://127.0.0.1/*` | 同上，部分作業系統需明確指定 127.0.0.1 而非 localhost。 |

### Remote code use

```
No. This extension does not load or execute any remote code. All logic
is bundled in the extension package; no eval, no dynamic script
injection of remote sources, no remote module loading.
```

---

## 5. Privacy practices disclosure

表單會問你的擴充功能處理哪些類別的資料 + 怎麼用。請依下列勾選：

### 收集/處理的資料類別（What data is collected）

| 類別 | 勾或不勾 | 原因 |
|------|---------|------|
| Personally identifiable information | ✅ 勾 | NHI 回傳含身分證字號、姓名、出生日期 |
| Health information | ✅ 勾 | 全部都是醫療紀錄 |
| Financial and payment information | ❌ 不勾 | 無 |
| Authentication information | ❌ 不勾 | 不接觸密碼、不讀 NHI 登入 form |
| Personal communications | ❌ 不勾 | 無 |
| Location | ❌ 不勾 | 無 |
| Web history | ❌ 不勾 | 無 |
| User activity | ❌ 不勾 | 無 |
| Website content | ❌ 不勾 | 無 |

### Certification（三個聲明都要勾「Yes」）

| 聲明 | 必須勾 |
|------|------|
| **資料不會販售給第三方** | ✅ Yes |
| **資料不會用於與單一用途無關的目的** | ✅ Yes |
| **資料不會用於信用評分或貸款** | ✅ Yes |

### Privacy policy URL

```
https://voho0000.github.io/NHI-FHIR-BRIDGE/PRIVACY.html
```

> ✅ 已上線可用（GitHub Pages 來源 = `main` 分支 `/docs`，2026-06-17 實測回 HTTP 200）。直接貼這個 URL 即可。

---

## 6. Distribution / Visibility

| 選項 | 建議 |
|------|------|
| **Visibility** | Unlisted（推薦）— 不會出現在搜尋結果，只有拿到網址的人能裝。減少陌生使用者的 support 壓力，也降低 review 強度 |
| **Regions** | All regions（除非你只想給特定國家） |
| **Mature content** | No |
| **Pricing** | Free |

---

## 7. 截圖（已備妥，放在 repo 的 `store-screenshots/`）

4 張行銷風截圖已產生好，皆 **1280×800 PNG**，直接上傳即可：

| 檔案 | 內容 |
|------|------|
| `store-screenshots/store-1-login.png` | 登入步驟 + 標語「健康存摺，一鍵轉成 FHIR」 |
| `store-screenshots/store-2-profile.png` | 基本資料步驟（示意名 王小明，無真實身分證） |
| `store-screenshots/store-3-download.png` | 取得完成 + 下載健康存摺檔 |
| `store-screenshots/store-4-view.png` | 選用：開啟「醫析 MediPrisma」瀏覽 |

如要重產：`node /tmp/shotgen/gen.mjs`（puppeteer-core 驅動本機 Chrome，body[data-mode] 強制 local 模式避免漏出後端按鈕）。

---

## 8. Promotional images（選填但建議有）

| 規格 | 檔案（已備妥） | 用途 |
|------|------|------|
| Small promo tile: 440×280 PNG | `store-screenshots/promo-tile-440x280.png` | 出現在搜尋結果列表（即使 Unlisted 也會出現在 store URL 預覽） |
| Marquee: 1400×560 PNG | `store-screenshots/marquee-1400x560.png` | 大型 feature banner（你大概不用，是 Google 主動推 feature 才會用到） |

---

## 9. 上架 checklist 總彙

本機端準備（程式 / 文件 / 素材）全部就緒，下列只剩「在 Dev Console 貼上 / 上傳 / 勾選」的人工動作：

文件/素材已備妥（✅ = 本機已就緒，照本文件複製即可）：

- [x] Manifest 描述對齊（v0.9.5）+ 名稱統一「NHI-FHIR Bridge」（無 "Capture" 殘留）
- [x] Short / Long description（繁中＋英文）— 見本文件第 2 節
- [x] Single purpose statement — 第 3 節
- [x] 6 個 permission justifications — 第 4 節（alarms / unlimitedStorage 皆實際使用中，非冗權限）
- [x] Host permission（NHI）+ optional host（localhost / 127.0.0.1）說明 — 第 4 節
- [x] Privacy policy 已上線：`https://voho0000.github.io/NHI-FHIR-BRIDGE/PRIVACY.html`（HTTP 200 實測）
- [x] 4 張 1280×800 截圖 + promo tile + marquee — 在 `store-screenshots/`
- [x] Remote code: No（executeScript 只用 `func:`，無遠端載入）

提交時要在 Dev Console 做的人工步驟（只有你能做）：

- [ ] 上傳最新 zip（push tag 後由 `release.yml` 自動產 `nhi-fhir-bridge-extension-vX.Y.Z.zip`，到 GitHub Releases 下載）
- [ ] 貼 Short / Long description（繁中＋英文）
- [ ] 貼 Single purpose statement
- [ ] 貼 6 個 permission justifications + host permission 說明
- [ ] Remote code 選 No
- [ ] Privacy disclosure 勾選 PII + Health information
- [ ] 三個 certification 都勾 Yes
- [ ] 貼 Privacy policy URL
- [ ] 上傳 4 張截圖（+ 選填 promo tile）
- [ ] Visibility 選 Unlisted、Category 選 Productivity、Pricing Free

---

## 10. Privacy policy URL（已上線，無需再設定）

✅ **已完成**。GitHub Pages 已啟用（Source = `main` 分支 `/docs`），privacy policy 上線且 2026-06-17 實測回 HTTP 200：

```
https://voho0000.github.io/NHI-FHIR-BRIDGE/PRIVACY.html
```

Jekyll 會自動把 `docs/PRIVACY.md` 轉成 `PRIVACY.html`，所以每次 push 更新 PRIVACY.md 後網頁也會自動跟著更新（push 後約 1-2 分鐘）。直接把上面這個 URL 貼進 Dev Console 的 Privacy policy 欄位即可，不必再做任何設定。

---

## 11. 提交後

- 帳號審核 + Extension 審核**分開兩次** review
- 收到「approved」email 後，到 dev console 點 "Publish"
- 大約 30 分鐘內全球生效
- Unlisted item 連結會是：`https://chromewebstore.google.com/detail/<你的-extension-id>`
- 把這個連結放進 README、release notes、給你的 test users

---

## 12. 之後出新版本

```bash
# 1. 改 extension/manifest.json 的 "version" 欄位（例 0.9.9 → 0.9.10）
# 2. 同步改 extension/package.json
# 3. npm run build:extension
# 4. cd extension && zip -r ../nhi-fhir-bridge-extension-vX.Y.Z.zip dist  (vX.Y.Z = 當前版本)
#    （release.yml 已會在 push tag 時自動打包此 zip 並建 GitHub Release）
# 5. Dev console → 你的 item → "Package" tab → "Upload new package"
# 6. （如有修改 store listing 或 permissions）"Store listing" tab 同步更新
# 7. Submit for review（通常 1 天內過）
# 8. 通過後用戶端 Chrome 會自動更新（預設每 5 小時 check）
```

**版本號規則**：
- 只能往上、不能跳過、不能重複
- 建議每次新版本都 git tag 觸發 release workflow，zip 從 GitHub release 拿即可（你 release.yml 已自動產生）

**若有 breaking permissions（例如新增 host_permissions）**：
- 用戶端 Chrome 會跳出「擴充功能要求新權限」對話框
- 用戶要按「啟用」才會收到更新
- 所以 host_permissions 改動務必審慎

**v0.18.6 把 localhost / 127.0.0.1 從 `host_permissions` 移到 `optional_host_permissions`**：
- 這是**移除**安裝時要求的權限，不是新增 — 既有用戶升級**不會**跳新權限對話框，更新自動套用
- 一般新安裝者只會看到「存取 myhealthbank.nhi.gov.tw」一個權限，乾淨
- 後端模式仍可用：使用者在進階設定啟用時，由擴充功能在當下動態請求 localhost 授權

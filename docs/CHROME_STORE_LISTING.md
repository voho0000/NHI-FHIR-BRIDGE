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
• 擷取以下健保存摺資料並轉為 FHIR：
  - 就醫紀錄（門診、急診、住院）→ Encounter
  - 用藥紀錄（含慢性處方箋）→ MedicationRequest
  - 檢驗檢查結果 → DiagnosticReport + Observation（內建 200+ NHI 對 LOINC 對照）
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
• Lab and exam results → DiagnosticReport + Observation (with 200+ NHI-to-LOINC mappings)
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
| `storage` | 在本機儲存使用者偏好設定（性別、出生年）與同步進度。資料僅存在 chrome.storage，不傳送至任何外部伺服器。 |
| `scripting` | 將資料擷取邏輯注入健保署網域分頁；必須在頁面 context 執行，才能使用瀏覽器既有的 first-party session cookie 呼叫健保署 API。 |
| `downloads` | 將擷取轉換後的 FHIR Bundle JSON 檔儲存至使用者本機 Downloads 資料夾，由使用者點擊按鈕主動觸發。 |
| `alarms` | 維持 Chrome MV3 service worker 在長時間同步（30 秒以上）過程中不被回收，確保資料完整擷取。 |

### Host permissions

| Host | 一句話說明 |
|------|----------|
| `https://myhealthbank.nhi.gov.tw/*` | 擷取使用者本人在台灣健保署「健康存摺」的醫療紀錄；這是本擴充功能的唯一資料來源。 |
| `http://localhost/*` | （選用）使用者自架本機 FHIR 後端時，將擷取的 FHIR 資源上傳至 localhost；僅在使用者於設定中啟用「上傳後端」模式時才會使用。 |
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

> ⚠️ 上面這個 URL 需要先**開啟 GitHub Pages** 才會生效。步驟見文末。

---

## 6. Distribution / Visibility

| 選項 | 建議 |
|------|------|
| **Visibility** | Unlisted（推薦）— 不會出現在搜尋結果，只有拿到網址的人能裝。減少陌生使用者的 support 壓力，也降低 review 強度 |
| **Regions** | All regions（除非你只想給特定國家） |
| **Mature content** | No |
| **Pricing** | Free |

---

## 7. 截圖（你需要自己準備）

至少 1 張、建議 4-5 張（1280×800 或 640×400 PNG）：

1. ✅ Popup 主畫面（剛打開、病人資料卡片）
2. ✅ Sync 進度條中（顯示「📥 取得 163 筆…（已 27 秒）」）
3. ✅ 完成畫面（「✅ 已產生 285 筆健康紀錄」+ 下載按鈕）
4. ✅ （加分）Dashboard 看 FHIR Patient 列表
5. ✅ （加分）SMART App 用本工具產出的資料

實際操作 → Chrome DevTools → Device toolbar → 設成 1280×800 → 截圖。或直接放大瀏覽器截圖。

---

## 8. Promotional images（選填但建議有）

| 規格 | 用途 |
|------|------|
| Small promo tile: 440×280 PNG | 出現在搜尋結果列表（即使 Unlisted 也會出現在 store URL 預覽） |
| Marquee: 1400×560 PNG | 大型 feature banner（你大概不用，是 Google 主動推 feature 才會用到） |

---

## 9. 上架 checklist 總彙

提交前確認：

- [ ] Zip 已上傳（最新 v0.9.2）
- [ ] Manifest 描述對齊（建議下個版本順手把 "透過 NHI-FHIR-Bridge 後端服務" 改成中性描述）
- [ ] Short description（繁中、英文）
- [ ] Long description（繁中、英文）
- [ ] Single purpose statement
- [ ] 5 個 permission justifications
- [ ] 3 個 host permission justifications
- [ ] Remote code: No
- [ ] Privacy disclosure 勾選 PII + Health information
- [ ] 三個 certification 都勾 Yes
- [ ] Privacy policy URL（GitHub Pages 已開啟、能用瀏覽器打開）
- [ ] 至少 1 張 1280×800 截圖
- [ ] Visibility 選 Unlisted
- [ ] Category 選 Productivity

---

## 10. 怎麼把 PRIVACY.md 變成可公開存取的 URL

GitHub Pages 最快路徑：

```
1. 把 docs/PRIVACY.md commit + push 到 main
2. GitHub repo → Settings → Pages
3. Source: Deploy from a branch
4. Branch: main / Folder: /docs
5. Save → 等 1-2 分鐘
6. 上線網址：https://voho0000.github.io/NHI-FHIR-BRIDGE/PRIVACY.html
   （或如果 .md 沒自動轉成 .html → 用 https://voho0000.github.io/NHI-FHIR-BRIDGE/PRIVACY 也可能 work）
```

如果懶得用 GitHub Pages，第二快是直接貼 GitHub raw markdown URL：

```
https://github.com/voho0000/NHI-FHIR-BRIDGE/blob/main/docs/PRIVACY.md
```

Chrome Web Store 過去**有時候**會接受 github blob URL，但 review 偶爾會嫌「不夠正式」。**還是 GitHub Pages 比較穩**。

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
# 1. 改 extension/manifest.json 的 "version" 欄位（例 0.9.2 → 0.9.3）
# 2. 同步改 extension/package.json
# 3. npm run build:extension
# 4. cd extension && zip -r ../nhi-fhir-bridge-extension-v0.9.3.zip dist
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

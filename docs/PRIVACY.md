# Privacy Policy / 隱私權政策

**Last updated / 最後更新**：2026-05-24
**Effective date / 生效日期**：2026-05-24

---

## 繁體中文

### 一、本擴充功能是什麼

NHI-FHIR-Bridge Capture（以下稱「本擴充功能」）是一款開源 Chrome 擴充功能，協助使用者將自己在台灣健保署「健康存摺」(`https://myhealthbank.nhi.gov.tw/`) 上的個人醫療紀錄，轉換為 HL7 FHIR R4 國際標準格式，**僅供使用者本人**作為個人健康資料備份、臨床研究、或匯入相容軟體之用。

原始碼公開於 https://github.com/voho0000/NHI-FHIR-BRIDGE （Apache License 2.0）。

### 二、我們**不會**收集的資料

本擴充功能採取「**零資料收集 (zero data collection)**」原則：

- ❌ **不向開發者或任何第三方傳送資料**：擴充功能執行過程中產生的所有資料，僅存在於使用者本機（瀏覽器或使用者自架的本機後端），開發者及任何第三方**完全無法存取**
- ❌ **沒有遠端伺服器、沒有雲端、沒有 SaaS**
- ❌ **沒有分析工具、Telemetry、錯誤回報、使用統計**
- ❌ **沒有第三方 SDK、追蹤像素、廣告 cookie**
- ❌ **沒有 AI、LLM、或任何外部 API 呼叫**：FHIR 轉換完全是本機端的確定性程式邏輯
- ❌ **不讀取、儲存、或傳送任何登入憑證**：本擴充功能不接觸健保署網站的登入頁面或密碼欄位；使用者需自行登入健保署，擴充功能僅利用瀏覽器既有的 session cookie 呼叫健保署 API

### 三、擴充功能在本機處理的資料

下述資料**僅在使用者自己的電腦上處理**，從不離開使用者裝置：

| 資料類別 | 來源 | 用途 | 儲存位置 |
|---------|------|------|---------|
| 醫療紀錄（就醫、用藥、檢驗、影像、過敏、預防接種等） | 健保署「健康存摺」API（使用者本人帳號） | 轉換為 FHIR R4 格式 | 瀏覽器記憶體 → 使用者選擇下載為 JSON 檔 或 上傳至使用者自架的本機後端 |
| 個人識別資料（姓名、性別、出生日期、身分證字號） | 健保署「健康存摺」API + 使用者於 popup 自行填寫 | 產生 FHIR Patient 資源 | 同上，加上 `chrome.storage.sync` 保存使用者偏好（性別、出生年） |
| 同步狀態與設定 | 擴充功能執行過程 | UI 狀態顯示 | `chrome.storage.local`（瀏覽器本地） |

### 四、資料外傳路徑

本擴充功能**只在下列情境**會將資料送出瀏覽器：

1. **使用者點擊「下載健康紀錄檔」按鈕** → 瀏覽器將 FHIR Bundle JSON 儲存至使用者本機的 Downloads 資料夾
2. **使用者於設定中啟用「上傳後端」模式** → 將 FHIR 資源透過 HTTP 傳送至使用者**自行指定的後端網址**（預設為 `http://localhost:8010`，使用者可改為自架伺服器網址）

上述兩種情境均由使用者**主動觸發**且**目的地由使用者完全控制**，開發者無法存取。

### 五、權限說明

本擴充功能要求以下 Chrome 權限：

| 權限 | 用途 |
|------|------|
| `activeTab` | 在使用者點擊擴充功能圖示後，存取當前分頁以執行健保署 API 請求 |
| `storage` | 保存使用者偏好設定與同步進度（僅本機） |
| `scripting` | 將擷取邏輯注入健保署網域分頁，以使用 first-party cookie 呼叫 API |
| `downloads` | 將產生的 FHIR Bundle JSON 儲存至使用者本機 |
| `alarms` | 維持背景同步流程之心跳，避免 Chrome MV3 service worker 在長時間同步時被回收 |
| Host: `https://myhealthbank.nhi.gov.tw/*` | 擷取使用者本人的健保存摺紀錄 |
| Host: `http://localhost/*`、`http://127.0.0.1/*` | （選用）將 FHIR 資料上傳至使用者自架的本機後端 |

### 六、使用者責任與限制

- 使用者**只能擷取自己**的健保存摺紀錄。擷取他人資料屬違法行為，與本擴充功能開發者無關
- 健保存摺資料屬「個人資料保護法」定義之**敏感性個人資料**；使用者應自行妥善保管下載的 JSON 檔案
- 本工具僅供參考，不保證資料準確；臨床判讀請以健保署官方網站顯示之內容為主

### 七、第三方服務

無。本擴充功能除呼叫健保署 (`myhealthbank.nhi.gov.tw`) 與使用者自行指定的本機後端外，**不與任何第三方通訊**。

### 八、兒童隱私

本擴充功能不主動向 13 歲以下兒童收集任何資料。

### 九、政策變更

如政策有實質變更（例如新增資料收集），將更新本頁面之「最後更新」日期並於 GitHub repository 中標示。

### 十、聯絡方式

如對本政策有任何疑問，請透過下列方式聯絡：

- Email：voho0000 [at] gmail.com
- GitHub Issues：https://github.com/voho0000/NHI-FHIR-BRIDGE/issues
- 安全弱點通報：請見 [SECURITY.md](https://github.com/voho0000/NHI-FHIR-BRIDGE/blob/main/SECURITY.md)

---

## English

### 1. What this extension is

NHI-FHIR-Bridge Capture (the "Extension") is an open-source Chrome extension that helps a user convert their own personal health records from Taiwan's NHI "My Health Bank" portal (`https://myhealthbank.nhi.gov.tw/`) into the HL7 FHIR R4 standard format, **for the user's personal use only** — as a personal health record backup, for clinical research on one's own data, or for import into FHIR-compatible software.

Source code is publicly available at https://github.com/voho0000/NHI-FHIR-BRIDGE under the Apache License 2.0.

### 2. Data we do NOT collect

The Extension follows a **zero data collection** principle:

- ❌ **No data is ever transmitted to the developer or any third party**. All data processed by the Extension stays on the user's own device (browser and/or the user's self-hosted local backend). The developer has zero access.
- ❌ No remote server, no cloud service, no SaaS
- ❌ No analytics, no telemetry, no error reporting, no usage statistics
- ❌ No third-party SDKs, tracking pixels, or advertising cookies
- ❌ No AI, no LLM, no external API calls — FHIR conversion is purely deterministic local code
- ❌ Login credentials are never read, stored, or transmitted. The user logs in to the NHI portal themselves; the Extension only uses the browser's existing session cookies to call NHI APIs.

### 3. Data the Extension processes locally

The data below is **only processed on the user's own machine** and never leaves the device:

| Data Category | Source | Purpose | Storage Location |
|--------------|--------|---------|------------------|
| Medical records (encounters, medications, lab results, imaging, allergies, immunizations, etc.) | NHI "My Health Bank" APIs (user's own account) | Convert to FHIR R4 | Browser memory → user-initiated download as JSON, or upload to user's self-hosted local backend |
| Personal identifiers (name, sex, DOB, national ID) | NHI APIs + user input in popup | Generate FHIR Patient resource | Same as above, plus `chrome.storage.sync` for user preferences |
| Sync state and settings | Extension runtime | UI state display | `chrome.storage.local` (browser-local) |

### 4. Data egress paths

The Extension sends data out of the browser **only** in these situations:

1. **User clicks "Download health record bundle"** → The browser saves the FHIR Bundle JSON to the user's local Downloads folder
2. **User enables "Upload to backend" mode** → FHIR resources are sent via HTTP to the **user-specified backend URL** (defaulting to `http://localhost:8010`; user may override with their own self-hosted server URL)

Both paths are **user-initiated** with the destination **fully controlled by the user**. The developer has no access.

### 5. Permission justifications

| Permission | Purpose |
|-----------|---------|
| `activeTab` | Access the current tab after user clicks the Extension icon, to execute NHI API requests |
| `storage` | Save user preferences and sync progress (local only) |
| `scripting` | Inject capture logic into NHI domain tabs so that first-party cookies are used for API calls |
| `downloads` | Save the generated FHIR Bundle JSON to the user's local machine |
| `alarms` | Keep service-worker heartbeat alive during long syncs to prevent MV3 worker termination |
| Host: `https://myhealthbank.nhi.gov.tw/*` | Read the user's own health records from NHI |
| Host: `http://localhost/*`, `http://127.0.0.1/*` | (Optional) Upload FHIR data to the user's self-hosted local backend |

### 6. User responsibilities

- Users **may only capture their own** NHI records. Capturing another person's records is illegal and outside the scope of this Extension
- NHI records are sensitive personal data under Taiwan's Personal Data Protection Act; the user is solely responsible for safeguarding downloaded files
- This tool is for reference only; for clinical decisions, the official NHI portal display is authoritative

### 7. Third parties

None. The Extension communicates only with `myhealthbank.nhi.gov.tw` and the user's self-specified local backend.

### 8. Children's privacy

The Extension does not knowingly collect any data from children under 13.

### 9. Changes

Material changes (e.g. introducing any data collection) will be reflected in the "Last updated" date above and announced in the GitHub repository.

### 10. Contact

- Email: voho0000 [at] gmail.com
- GitHub Issues: https://github.com/voho0000/NHI-FHIR-BRIDGE/issues
- Security disclosures: see [SECURITY.md](https://github.com/voho0000/NHI-FHIR-BRIDGE/blob/main/SECURITY.md)

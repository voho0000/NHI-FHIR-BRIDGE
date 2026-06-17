# Privacy Policy / 隱私權政策

**Last updated / 最後更新**：2026-06-17
**Effective date / 生效日期**：2026-06-17

---

## 繁體中文

### 一、本擴充功能是什麼

NHI-FHIR Bridge（以下稱「本擴充功能」）是一款開源 Chrome 擴充功能，協助使用者將自己在台灣健保署「健康存摺」(`https://myhealthbank.nhi.gov.tw/`) 上的個人醫療紀錄，轉換為 HL7 FHIR R4 國際標準格式，**僅供使用者本人**作為個人健康資料備份、臨床研究、或匯入相容軟體之用。

原始碼公開於 https://github.com/voho0000/NHI-FHIR-BRIDGE （Apache License 2.0）。

### 二、我們**不會**收集的資料

本擴充功能採取「**零資料收集 (zero data collection)**」原則：

- ❌ **不向開發者或任何第三方傳送資料**：擴充功能執行過程中產生的所有資料，僅存在於使用者本機（瀏覽器或使用者自架的本機後端），開發者及任何第三方**完全無法存取**
- ❌ **沒有遠端伺服器、沒有雲端、沒有 SaaS**
- ❌ **沒有分析工具、Telemetry、錯誤回報、使用統計**
- ❌ **沒有第三方 SDK、追蹤像素、廣告 cookie**
- ❌ **沒有 AI、LLM、或任何外部 API 呼叫**：FHIR 轉換完全是本機端的確定性程式邏輯
  - **附註**：本擴充功能 popup 中介紹的「醫析 MediPrisma」SMART App 是獨立的第三方產品，使用者**主動點選按鈕**才會在新分頁開啟。該 App 提供的 AI 問答功能會將資料傳送至雲端 AI 供應商；該功能與本擴充功能無關，相關資料處理請參考該 App 自身的隱私權政策。本擴充功能本身完全不接觸 AI／LLM。
- ❌ **不讀取密碼、不接觸登入表單**：使用者自行登入健保署；本擴充功能不碰登入頁面或密碼欄位，僅沿用瀏覽器既有的 session（cookie／session token）呼叫健保署 API。（註：當你啟用「一併下載影像」時，本擴充功能會把該 session 的 bearer token **暫存於本機**供背景抓圖，30 分鐘後自動清除、且**不傳送至任何外部伺服器** —— 詳見第三節）

### 三、擴充功能在本機處理的資料

下述資料**僅在使用者自己的電腦上處理**，從不離開使用者裝置：

| 資料類別 | 來源 | 用途 | 儲存位置 |
|---------|------|------|---------|
| 醫療紀錄（就醫、用藥、檢驗、影像、過敏、預防接種等） | 健保署「健康存摺」API（使用者本人帳號） | 轉換為 FHIR R4 格式 | 瀏覽器記憶體 → 使用者選擇下載為 JSON 檔 或 上傳至使用者自架的本機後端 |
| 個人識別資料（姓名、性別、出生日期、身分證字號） | 健保署「健康存摺」API + 使用者於 popup 自行填寫 | 產生 FHIR Patient 資源 | 同上；使用者偏好（性別、出生年、Backend URL 等）存於 `chrome.storage.local`（**僅本機，不會同步至 Google 帳號**）。產生的健康紀錄檔暫存於 `chrome.storage.local`（v0.14 起；因影像資料超過 session storage 上限，搭配 `unlimitedStorage` 權限。**僅本機，但重啟瀏覽器不會自動清除**）。暫存依下列事件先到先清除：使用者下載完成當下立即清除、使用者按「清除」、1 小時 TTL 自動清掃（Chrome 執行期間每 10 分鐘檢查一次；擴充功能啟動／更新時亦清掃）、或被下一次同步覆寫 |
| 同步狀態與設定 | 擴充功能執行過程 | UI 狀態顯示 | `chrome.storage.local`（瀏覽器本地） |
| NHI session bearer token | 你已登入的健保署分頁（`sessionStorage`） | **僅在啟用「一併下載影像」時**：讓背景 service worker 在 popup 關閉後仍能向健保署抓取影像 | `chrome.storage.local`（**僅本機，不同步 Google 帳號**）；設 **30 分鐘 TTL**，逾時自動清除；**從不傳送至任何外部伺服器** |

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
| `storage` | 保存使用者偏好設定、同步進度，以及暫存待下載的健康紀錄檔；啟用影像下載時並暫存 NHI session bearer token 供背景抓圖（30 分鐘 TTL 後清除）。皆僅存於本機 `chrome.storage`，不外傳（清除機制見第三節） |
| `scripting` | 在健保署網域分頁中執行擷取邏輯，以沿用 first-party cookie 呼叫 API |
| `downloads` | 將產生的 FHIR Bundle JSON 儲存至使用者本機 |
| `alarms` | 維持背景同步流程之心跳，避免 Chrome MV3 service worker 在長時間同步時被回收；並每 10 分鐘檢查、清除逾時（1 小時）的本機暫存健康紀錄檔 |
| `unlimitedStorage` | 含影像的健康紀錄檔可能超過瀏覽器預設儲存配額，需要此權限才能在本機暫存（仍受上述 1 小時 TTL 與下載後立即清除機制管控） |
| Host: `https://myhealthbank.nhi.gov.tw/*` | 擷取使用者本人的健康存摺紀錄（安裝時要求的唯一主機權限） |
| Optional host: `http://localhost/*`、`http://127.0.0.1/*` | （選用，v0.18.6 起改為 optional_host_permissions）將 FHIR 資料上傳至使用者自架的本機後端。**安裝時不要求**；僅在使用者主動啟用「上傳後端」模式時，由擴充功能在當下請求授權 |

### 六、使用者責任與限制

- 使用者**只能擷取自己有權檢視**的健康存摺紀錄 —— 亦即你本人的紀錄，或健保署「眷屬」功能中經對方同意綁定、目前切換顯示的眷屬紀錄。請勿用於擷取你無權檢視的他人資料；使用者應自行就其使用行為負責，與本擴充功能開發者無關
- 健康存摺資料屬「個人資料保護法」定義之**敏感性個人資料**；使用者應自行妥善保管下載的 JSON 檔案
- 本工具僅供參考，不保證資料準確；臨床判讀請以健保署官方網站顯示之內容為主

### 七、第三方服務

無。本擴充功能除呼叫健保署 (`myhealthbank.nhi.gov.tw`) 與使用者自行指定的本機後端外，**不與任何第三方通訊**。

### 八、兒童隱私

本擴充功能不主動向 13 歲以下兒童收集任何資料。

### 九、政策變更

如政策有實質變更（例如新增資料收集），將更新本頁面之「最後更新」日期並於 GitHub repository 中標示。

### 十、聯絡方式

如對本政策有任何疑問，請透過下列方式聯絡：

- Email：<voho0000@gmail.com>
- GitHub Issues：https://github.com/voho0000/NHI-FHIR-BRIDGE/issues
- 安全弱點通報：請見 [SECURITY.md](https://github.com/voho0000/NHI-FHIR-BRIDGE/blob/main/SECURITY.md)

---

## English

### 1. What this extension is

NHI-FHIR Bridge (the "Extension") is an open-source Chrome extension that helps a user convert their own personal health records from Taiwan's NHI "My Health Bank" portal (`https://myhealthbank.nhi.gov.tw/`) into the HL7 FHIR R4 standard format, **for the user's personal use only** — as a personal health record backup, for clinical research on one's own data, or for import into FHIR-compatible software.

Source code is publicly available at https://github.com/voho0000/NHI-FHIR-BRIDGE under the Apache License 2.0.

### 2. Data we do NOT collect

The Extension follows a **zero data collection** principle:

- ❌ **No data is ever transmitted to the developer or any third party**. All data processed by the Extension stays on the user's own device (browser and/or the user's self-hosted local backend). The developer has zero access.
- ❌ No remote server, no cloud service, no SaaS
- ❌ No analytics, no telemetry, no error reporting, no usage statistics
- ❌ No third-party SDKs, tracking pixels, or advertising cookies
- ❌ No AI, no LLM, no external API calls — FHIR conversion is purely deterministic local code
  - **Note**: The "醫析 MediPrisma" SMART App mentioned in the Extension's popup is an independent third-party product opened by the user clicking a button. That app offers an AI Q&A feature that sends data to cloud AI providers; this feature is separate from the Extension. Please refer to that app's own privacy policy for its data handling. The Extension itself does not touch any AI/LLM.
- ❌ Passwords are never read and the login form is never touched. The user logs in to the NHI portal themselves; the Extension reuses the browser's existing session (cookies / session token) to call NHI APIs. (Note: when you enable "download imaging too", the Extension briefly stages that session's bearer token locally so background fetching can finish after the popup closes — 30-minute TTL, auto-cleared, never transmitted externally; see Section 3.)

### 3. Data the Extension processes locally

The data below is **only processed on the user's own machine** and never leaves the device:

| Data Category | Source | Purpose | Storage Location |
|--------------|--------|---------|------------------|
| Medical records (encounters, medications, lab results, imaging, allergies, immunizations, etc.) | NHI "My Health Bank" APIs (user's own account) | Convert to FHIR R4 | Browser memory → user-initiated download as JSON, or upload to user's self-hosted local backend |
| Personal identifiers (name, sex, DOB, national ID) | NHI APIs + user input in popup | Generate FHIR Patient resource | Same as above; user preferences (sex, birth year, backend URL, etc.) live in `chrome.storage.local` (**browser-local only — never replicated to your Google account**). The generated health-record bundle is temporarily staged in `chrome.storage.local` (since v0.14, with the `unlimitedStorage` permission, because imaging bundles exceed session storage's size cap; **browser-local only, but NOT wiped automatically when the browser closes**). The staged bundle is cleared by whichever happens first: the moment the user-initiated download completes, the user clicking "Clear", a 1-hour TTL sweep (checked every 10 minutes while Chrome runs, and at extension startup/update), or being overwritten by the next sync |
| Sync state and settings | Extension runtime | UI state display | `chrome.storage.local` (browser-local) |
| NHI session bearer token | The signed-in NHI tab (`sessionStorage`) | **Only when "download imaging too" is enabled**: lets the background service worker keep fetching imaging from NHI after the popup closes | `chrome.storage.local` (**browser-local only, not synced to your Google account**); a **30-minute TTL** auto-clears it; **never transmitted to any external server** |

### 4. Data egress paths

The Extension sends data out of the browser **only** in these situations:

1. **User clicks "Download health record bundle"** → The browser saves the FHIR Bundle JSON to the user's local Downloads folder
2. **User enables "Upload to backend" mode** → FHIR resources are sent via HTTP to the **user-specified backend URL** (defaulting to `http://localhost:8010`; user may override with their own self-hosted server URL)

Both paths are **user-initiated** with the destination **fully controlled by the user**. The developer has no access.

### 5. Permission justifications

| Permission | Purpose |
|-----------|---------|
| `activeTab` | Access the current tab after user clicks the Extension icon, to execute NHI API requests |
| `storage` | Save user preferences, sync progress, and the temporarily staged health-record bundle; when imaging download is enabled, also stage the NHI session bearer token for background fetching (cleared after a 30-minute TTL). All in local `chrome.storage` only, never transmitted (clearing mechanism in Section 3) |
| `scripting` | Run capture logic inside NHI domain tabs so the first-party cookies/session are used for API calls |
| `downloads` | Save the generated FHIR Bundle JSON to the user's local machine |
| `alarms` | Keep service-worker heartbeat alive during long syncs to prevent MV3 worker termination; also runs a 10-minute sweep that clears locally staged bundles older than the 1-hour TTL |
| `unlimitedStorage` | Bundles that include imaging can exceed the browser's default storage quota; this permission allows local staging (still bounded by the 1-hour TTL and cleared-on-download mechanisms above) |
| Host: `https://myhealthbank.nhi.gov.tw/*` | Read the user's own health records from NHI (the only host permission requested at install) |
| Optional host: `http://localhost/*`, `http://127.0.0.1/*` | (Optional, moved to optional_host_permissions in v0.18.6) Upload FHIR data to the user's self-hosted local backend. **Not requested at install**; requested on demand only when the user enables "Upload to backend" mode |

### 6. User responsibilities

- Users **may only capture records they are authorized to view** — i.e. their own records, or those of a dependent they are legitimately bound to and currently switched to via NHI's "dependents" (眷屬) feature. Please do not use it to capture records you are not authorized to view; users are responsible for their own use, which is outside the scope of this Extension
- NHI records are sensitive personal data under Taiwan's Personal Data Protection Act; the user is solely responsible for safeguarding downloaded files
- This tool is for reference only; for clinical decisions, the official NHI portal display is authoritative

### 7. Third parties

None. The Extension communicates only with `myhealthbank.nhi.gov.tw` and the user's self-specified local backend.

### 8. Children's privacy

The Extension does not knowingly collect any data from children under 13.

### 9. Changes

Material changes (e.g. introducing any data collection) will be reflected in the "Last updated" date above and announced in the GitHub repository.

### 10. Contact

- Email: <voho0000@gmail.com>
- GitHub Issues: https://github.com/voho0000/NHI-FHIR-BRIDGE/issues
- Security disclosures: see [SECURITY.md](https://github.com/voho0000/NHI-FHIR-BRIDGE/blob/main/SECURITY.md)

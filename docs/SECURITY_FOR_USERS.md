# 給民眾使用者：你的健康資料安全嗎？

這份文件說明 NHI-FHIR Bridge 在資料安全上的設計與做法，盡量不用工程術語，方便評估是否適合自己使用。

> 最後更新：2026-05-27（對應 bridge **v0.9.5**）

---

## 一句話結論

**資料只會在你自己的電腦內處理；不會傳到開發者的伺服器，也不會被 AI / 雲端服務讀取。**

---

## 1. 資料路徑

```
（健保署）            （你的瀏覽器）          （你選的去處）
健保存摺  ───►  NHI-FHIR Bridge  ───►  下載到你電腦的下載夾
```

- 整個流程沒有任何後端伺服器參與
- Bridge 是跑在瀏覽器內的轉換工具，跟健保存摺分頁互通
- 走到「下載到電腦」就結束了，檔案落在你電腦的下載夾

下載完成後可以選擇用「醫析 MediPrisma」開啟瀏覽（見後段說明）。

---

## 2. Bridge 不會做的事

| 不做的事 | 對你的意義 |
|---------|--------------|
| 不把資料傳到開發者伺服器 | 整個專案沒有任何後端伺服器在運作 |
| 不接 AI / ChatGPT / Gemini | 程式碼裡沒有任何 AI 相關 library。轉換邏輯是純粹的規則對應 |
| 不收集使用統計 (telemetry) | 沒有寫任何收集程式，所以也讀不到誰裝了、用了幾次 |
| 不要求註冊帳號、不要求 email | 沒有 login、沒有 cookie |
| 不接觸健保存摺密碼 | Bridge 不會出現在登入畫面，密碼是你在健保署網站直接輸入 |
| 不同步資料到 Google 帳號 | 填的性別 / 生日只存瀏覽器本機，不會跨裝置同步 |
| 下載一律走「另存新檔」對話框 | 每次下載都會跳對話框讓你選位置 + 確認檔名，不會在背景靜默落地 |

---

## 3. Bridge 內建的保護機制

| 保護 | 對應的情境 |
|------|--------------|
| 暫存資料放在「瀏覽器階段儲存區」 | 關閉瀏覽器後，所有暫存自動清空 |
| 下載完成後立刻清掉暫存 | 檔案落地的同時，瀏覽器內的副本就被清除 |
| 1 小時自動清掃 | 若暫存放著沒下載也沒關瀏覽器，1 小時後也會清掉 |
| 隔離其他瀏覽器擴充功能 | 其他擴充功能無法假冒身份取得 bridge 的資料 |
| 下載一律走「另存新檔」對話框 | 每次下載都會跳對話框確認儲存位置 + 檔名 |
| 切換病人時清掉前一人的暫存 | 修改姓名 / 性別 / 生日會觸發暫存清除，多人共用同一瀏覽器不會混 |
| 升級時清理舊版殘留 | 新版安裝時會掃掉前版可能留下的暫存 |

---

## 4. 透明度與可驗證性

對於「看不到程式碼怎麼確認」的疑問，以下是可供驗證的公開資訊：

| 公開的東西 | 連結 |
|----------|------|
| **整個專案開源** | https://github.com/voho0000/NHI-FHIR-BRIDGE — 隨時可以看每一行程式碼 |
| **隱私權政策** | [docs/PRIVACY.md](https://voho0000.github.io/NHI-FHIR-BRIDGE/PRIVACY.html) — 雙語完整版 |
| **安全弱點通報窗口** | [SECURITY.md](https://github.com/voho0000/NHI-FHIR-BRIDGE/blob/main/SECURITY.md) |
| **做過獨立安全審查** | 修補紀錄在 [CHANGELOG.md](https://github.com/voho0000/NHI-FHIR-BRIDGE/blob/main/CHANGELOG.md) |
| **權限要求清單 + 為何需要** | README 跟 Chrome Web Store 商店頁面都會列 |
| **每一版的修改紀錄** | [GitHub Releases](https://github.com/voho0000/NHI-FHIR-BRIDGE/releases) — 寫得很詳細 |

如果身邊有熟悉前端開發的朋友，可以請他們瀏覽 `extension/src/background.js`（核心檔案），確認是否有對外傳送資料的程式碼。

---

## 5. 使用上的小提醒

| 提醒 | 說明 |
|------|------|
| 下載的 JSON 檔案 | 內容是完整的個人健康紀錄，存放位置建議跟其他敏感檔案一樣處理 |
| 公共電腦上使用 | 網咖、圖書館電腦、借來的筆電都可能讓旁人看到畫面，建議在自己的裝置上使用 |
| 健保署登入 | Bridge 不接觸健保密碼。登入安全由健保署網站本身負責 |
| 「醫析 MediPrisma」AI 問答功能 | 醫析的「檢驗趨勢」、「用藥時間軸」等視覺化功能都是本機運算（檔案在瀏覽器內處理）。「AI 問答」按鈕則會把資料送給 OpenAI / Gemini 等雲端 LLM 才能產生回答 — 這是 LLM 服務的運作方式。只想用本機功能就略過 AI 按鈕即可 |

---

## 6. 常見疑慮 Q&A

**Q1: 我裝了 bridge，會不會被當成「使用者授權給開發者用」？**
不會。Bridge 是「裝在你電腦上幫你做事」的工具，跟 line 的對話 / 通訊軟體不一樣 — 我們收不到任何東西。

**Q2: 我能不能完全離線使用？**
擴充功能本身可以離線，但你**必須連線才能抓健保存摺**（健保署 API 在雲端）。一旦資料到你瀏覽器，就可以離線了，後續轉換 + 下載都不需要網路。

**Q3: 我擔心健保署看到我用 bridge → 影響我什麼權益**
你登入健保存摺、按那些按鈕，跟你直接用網頁上的功能，健保署看到的 API call 是一模一樣的。Bridge **不會**對健保伺服器留特殊指紋。

**Q4: Bridge 升級到 1.0 / 2.0 後會不會改成收費 / 偷偷加 AI？**
- **開源 + Apache License 2.0** — 任何更新都會留 git commit 紀錄，全世界都看得到。你可以 fork 一份不含新功能的版本繼續用
- 大改動會在 release notes 寫清楚
- 你不喜歡新版可以**不更新**（chrome 商店版會自動更新，但用「下載 zip 自行載入」就不會）

---

## 7. 還在猶豫的話

可以考慮以下幾種方式：

1. 繼續用健保署官網（功能較有限，但是最熟悉的環境）
2. 請信任的工程師朋友檢查程式碼 — 核心檔案約 1 小時內可看完
3. 先下載到電腦觀察 JSON 內容是否合理，確認後再決定要不要搭配 SMART App 使用

---

## 8. 通報問題

| 你要做什麼 | 怎麼做 |
|----------|--------|
| 發現安全漏洞（想私下通報） | 寄信給 <voho0000@gmail.com>（請見 [SECURITY.md](https://github.com/voho0000/NHI-FHIR-BRIDGE/blob/main/SECURITY.md)） |
| 報告 bug | [GitHub Issues](https://github.com/voho0000/NHI-FHIR-BRIDGE/issues) |
| 提建議或一般問題 | GitHub Issues 或 email |

---

**重點回顧**：健康資料停留在你的瀏覽器內，除非你主動「下載到電腦」、或者主動開啟 SMART App 並使用其 AI 功能。Bridge 在整個流程中的角色，是把健保存摺資料從健保署網站轉換並搬運到你電腦的工具。

---

# 附錄：進階模式（本機伺服器 + Dashboard）

> 以下內容針對進階用戶（自架 Docker backend 搭配 Dashboard / 自己寫 SMART App）。一般使用「下載到電腦」即可，這段可以略過。

## 進階模式是什麼

擴充功能裡有個「⚙️ 進階設定 → 啟用本機伺服器模式」開關。打開後，你可以：

- 跑一個本機 Docker backend（FHIR Server），把多次同步累積起來
- 用 Dashboard (`http://localhost:3010`) 瀏覽多個病人
- 一鍵 launch 自架的 SMART App 看資料

**這需要你有基本的開發環境** — 會用 terminal、知道什麼是 Docker、能設定 backend URL。

## 進階模式專屬的安全防護

| 防護 | 解決什麼風險 |
|------|------|
| **Backend 預設只綁 127.0.0.1 (loopback)** | 同網段其他電腦無法存取 |
| **Dashboard 防 CSRF（檢查 Origin）** | 防止你開著 dashboard 時、被其他網頁偷觸發操作 |
| **SMART App URL 必須是 https:// 或本機** | 防止輸入錯誤的 URL 把 launch token 送陌生網站 |
| **FHIR PHI 端點走 SMART OAuth2 + PKCE** | 標準健康資料授權框架 |
| **Patient.id 用 SHA-1 雜湊**（不放原始身分證） | 萬一資料庫被讀，URL 路徑不會直接洩漏身分證 |
| **PHI 寫入端點（/sync, /fhir/import…）需要 `SYNC_API_KEY`** | 額外的存取保護 |

## 想改預設配置時

預設配置（backend 只綁本機 loopback、單人試用）就是安全的。如果你想客製化：

- 想開放 backend 給 LAN 其他電腦用 → 建議設個強的 `SYNC_API_KEY`
- 想多人 / 多病人臨床使用 → 超出這份文件範圍，請看 [ARCHITECTURE.md](https://github.com/voho0000/NHI-FHIR-BRIDGE/blob/main/docs/ARCHITECTURE.md)

詳細技術設計見 [docs/ARCHITECTURE.md](https://github.com/voho0000/NHI-FHIR-BRIDGE/blob/main/docs/ARCHITECTURE.md)。

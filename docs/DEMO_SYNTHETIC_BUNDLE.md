# Demo with synthetic data / 用合成資料做示範

公開演講、錄影、截圖時，**請勿現場登入真實健康存摺**，也不要用任何真實病人的
匯出檔。改用本專案附的合成假資料：

- [`demo/synthetic-fhir-bundle.json`](../demo/synthetic-fhir-bundle.json) ——
  一份完全合成、可直接展示的 FHIR R4 `Bundle`（Patient / Encounter /
  MedicationRequest / Observation / DiagnosticReport 各一）。

## 它是假的，可以放心公開

- **身分證**：`F223456789`，**故意 checksum 無效**的合成碼（檔內 `identifier`
  以遮罩形式 `F22345XXXX` 呈現）。不是任何真人的號碼。
- **姓名／生日**：`王小明`、`1980-05-12`，通用占位值。
- **檢驗值／藥品**：HbA1c 5.9%、Metformin 500mg，示意用，非真實病歷。
- `Bundle.meta.tag` 標了 `SYNTHETIC … not a real patient`，一眼可辨識。

CI 的 `scripts/check-no-real-twid.mjs` 會擋掉任何 checksum **有效**的台灣身分證
進入 repo，所以這份示範檔不會誤含真資料。

## 怎麼在演講中用

- **模式 A（純擴充功能）流程**：照常開 popup 走精靈，但講「正式使用時這裡會
  帶入你自己的健康存摺資料」；要展示產出長相時，改開這份 `synthetic-fhir-bundle.json`。
- **模式 B / Dashboard / SMART App**：把這份檔透過後端 `POST /fhir/import`
  匯入一個**乾淨、合成資料**的本機 DB，再展示 Dashboard 與 SMART App。
- **外部檢視工具（醫析 MediPrisma）**：把這份檔拖進去展示圖表即可。

## ⚠️ 環境隔離（重要）

不要用你平常開發、且位於雲端同步資料夾（如 Google Drive、iCloud、Dropbox）底下的
工作目錄做現場 demo —— 即使 `.env`、`backend-ts/data/*.db` 已被 `.gitignore`
擋住 git，雲端用戶端仍可能把它們同步上雲。建議：

1. 在**非雲端同步**的路徑另外 `git clone` 一份乾淨的 repo 做 demo。
2. demo 用的後端 DB 只匯入上面的合成 bundle（或 `docker compose down -v`
   後重起，確保是空庫）。
3. 演講前先掃一遍畫面、分頁、下載夾，確認沒有殘留真實資料。

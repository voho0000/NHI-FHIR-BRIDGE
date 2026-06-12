# 貢獻指南

歡迎協助改進 NHI-FHIR-BRIDGE！以下是參與本專案的方式。

---

## 開發環境設定

### 必要工具
- Node.js 20+
- Docker + Docker Compose（建議）
- Git

### 後端開發（backend-ts，TypeScript / Hono）

```bash
# 在 repo 根安裝 workspaces 全部依賴（packages/mapper、backend-ts、extension）
npm install

cd backend-ts

# 設定環境變數（可選，所有變數都有合理預設）
cp ../.env.example ../.env

# 建立 / 套用資料庫 migration
npm run db:migrate

# 啟動 dev server（tsx watch，改 code 自動重載）
npm run dev
```

### 前端開發

```bash
cd frontend
npm install
npm run dev   # → http://localhost:3000（next dev 預設 port；3010 是 docker-compose 對外映射的 port）
```

### Chrome Extension 開發

extension 是 TypeScript（`extension/src/`），用 esbuild（`extension/build.mjs`）打包輸出到 `extension/dist/`：

```bash
# 在 repo 根 build 一次（輸出 extension/dist/）
npm run build:extension

# 或在 extension/ 內開 watch 模式，改 code 自動重 build
cd extension
npm run dev
```

1. Chrome → `chrome://extensions` → 開啟「開發人員模式」
2. 點「載入未封裝項目」→ 選 `extension/dist/` 資料夾
3. 改 code 後重新 build（或讓 watch 跑著），再在 extensions 頁面點 reload 圖示

> ⚠️ `extension/dist/` 是 commit 進 repo 的成品。改了 extension 程式碼後，commit 前務必跑
> `npm run build:extension` 並把 `dist/` 一起 commit — CI 會驗證 dist 與 src 一致
> （`git diff --exit-code extension/dist`），不一致會直接 fail。

---

## 程式碼風格

### TypeScript（backend-ts）
- 縮排：2 空白
- 由 Biome 統一格式與 lint（`biome.json`）
- 型別註解：新程式碼必填；`tsc --noEmit` 必須全綠

### TypeScript / React（frontend）
- 縮排：2 空白
- Next.js App Router 規範

### TypeScript（extension）
- TypeScript（`extension/src/*.ts`），esbuild 打包（`extension/build.mjs`）→ `extension/dist/`
- 由 Biome 統一格式與 lint；`tsc --noEmit` 必須全綠
- 函式宣告風格、early-return、簡短註解

---

## 跑測試與 lint

```bash
cd backend-ts

# 跑所有測試
npm test

# 跑特定測試
npx vitest run tests/unit/observation-mapper.test.ts

# 看 coverage
npm run test:coverage

# lint check
npm run lint

# 自動 fix
npm run lint:fix

# 型別檢查
npm run typecheck
```

CI 會在每次 PR / push 跑 `vitest`、`biome check` 與 `tsc --noEmit`（含 extension 的 build + 測試），請在開 PR 前在本地確認通過。

---

## PR Checklist

開 PR 之前請確認：

- [ ] `npm test` 全綠（backend-ts vitest）
- [ ] `npm run lint`（biome）無警告
- [ ] `npm run typecheck`（tsc --noEmit）通過
- [ ] 改 schema 的話有對應的 drizzle migration（`npm run db:generate`）
- [ ] 新功能 / bug fix 有對應的測試
- [ ] README / 相關文件有更新（若涉及對外行為）
- [ ] commit message 遵循 Conventional Commits（`feat:`、`fix:`、`refactor:`、`docs:`、`test:`、`ci:`、`sec:`）

---

## 修改資料庫 Schema

```bash
cd backend-ts

# 1. 修改 src/models/schema.ts（drizzle schema）加減欄位
# 2. 生成 migration（產出到 drizzle/）
npm run db:generate
# 3. 檢查 drizzle/<新檔案>.sql，確認 SQL 正確且 idempotent
# 4. Apply
npm run db:migrate
```

---

## 如何加入新的 NHI 頁面 / FHIR 資源類型

1. **取得 NHI JSON 端點**：在 NHI 健康存摺頁面打開 DevTools → Network → 找出對應的 `/api/ihke3000/...` 端點
2. **Extension 端**：在 `extension/src/nhi-endpoints.ts` 的 endpoint registry 加入該端點，在 `extension/src/background/sync-orchestrator.ts` 接進 sync 流程，並在 `extension/src/nhi-adapters.ts` 用 `adapt*()` 把 JSON 轉成 mapper-shape items
3. **Mapper**：在 `packages/mapper/src/` 新增 mapper 函式（或擴充既有的）— 同一份程式碼會被 backend 和 extension 共用
4. **註冊**：把 mapper 加進 `packages/mapper/src/dispatch.ts` 的 `LIST_HANDLERS` 或 `GROUP_HANDLERS`
5. **寫測試**：`backend-ts/tests/unit/<resource>-mapper.test.ts`

---

## 回報問題

開 Issue 時請附：
- 復現步驟
- 期待行為 vs 實際行為
- 環境（OS、Node 版本、瀏覽器）
- 後端 log（loglevel INFO 即可，PHI 自行打碼）

---

## 安全議題

如果你發現安全弱點（例如 OAuth2 流程 bypass、CORS 洩漏、PHI 跨病人查詢），請**不要**在公開 Issue 揭露，先以 email 私下聯繫 voho0000 @ gmail.com。詳見 [SECURITY.md](SECURITY.md)。

# 貢獻指南

歡迎協助改進 NHI-FHIR-BRIDGE！以下是參與本專案的方式。

---

## 開發環境設定

### 必要工具
- Python 3.11+
- Node.js 18+（給 frontend 用）
- Docker + Docker Compose（建議）
- Git

### 後端開發

```bash
cd backend

# 建立 virtualenv（建議）
python3 -m venv .venv
source .venv/bin/activate

# 安裝依賴（含開發工具）
pip install -r requirements.txt
pip install -r requirements-dev.txt

# 設定環境變數（可選，所有變數都有合理預設）
cp ../.env.example ../.env

# 建立資料庫
alembic upgrade head

# 啟動 dev server
uvicorn app.main:app --reload --port 8010
```

### 前端開發

```bash
cd frontend
npm install
npm run dev   # → http://localhost:3010
```

### Chrome Extension 開發

1. Chrome → `chrome://extensions` → 開啟「開發人員模式」
2. 點「載入未封裝項目」→ 選 `extension/` 資料夾
3. 改 code 後在 extensions 頁面點 reload 圖示

---

## 程式碼風格

### Python（backend）
- 縮排：4 空白
- 行長：100 字元（ruff 與 black 都已設定）
- Import 排序：ruff 自動處理
- 型別註解：新程式碼必填；舊有 untyped corners 漸進補上即可

### TypeScript / React（frontend）
- 縮排：2 空白
- Next.js App Router 規範

### Chrome Extension
- vanilla JS（不引 build step）
- 函式宣告風格、early-return、簡短註解

---

## 跑測試與 lint

```bash
cd backend

# 跑所有測試
pytest

# 跑特定測試
pytest tests/unit/test_observation_mapper.py -v

# 看 coverage
pytest --cov=app --cov-report=term-missing

# lint check
ruff check app tests
ruff format --check app tests

# 自動 fix
ruff check --fix app tests
ruff format app tests

# 型別檢查（非阻擋）
mypy app
```

CI 會在每次 PR / push 跑 `pytest` 與 `ruff check / format --check`，請在開 PR 前在本地確認通過。

---

## PR Checklist

開 PR 之前請確認：

- [ ] `pytest` 全綠
- [ ] `ruff check app tests` 無警告
- [ ] `ruff format --check app tests` 通過
- [ ] 改 schema 的話有對應的 alembic migration（`alembic revision --autogenerate -m "..."`）
- [ ] 新功能 / bug fix 有對應的測試
- [ ] README / 相關文件有更新（若涉及對外行為）
- [ ] commit message 遵循 Conventional Commits（`feat:`、`fix:`、`refactor:`、`docs:`、`test:`、`ci:`、`sec:`）

---

## 修改資料庫 Schema

```bash
cd backend

# 1. 修改 app/models/fhir_store.py 加減欄位
# 2. 生成 migration
alembic revision --autogenerate -m "add foo column to bar"
# 3. 檢查 alembic/versions/<新檔案>.py，確認 upgrade / downgrade 邏輯
# 4. Apply
alembic upgrade head
# 5. 測試 rollback
alembic downgrade -1
alembic upgrade head
```

---

## 如何加入新的 NHI 頁面 / FHIR 資源類型

1. **取得 NHI JSON 端點**：在 NHI 健康存摺頁面打開 DevTools → Network → 找出對應的 `/api/ihke3000/...` 端點
2. **Extension 端**：在 `extension/src/background.js` 的 `runNhiApiSync` / `NHI_API_ENDPOINTS` 加入該端點 + 用 `adapt*()` 把 JSON 轉成 mapper-shape items
3. **Mapper**：在 `packages/mapper/src/` 新增 mapper 函式（或擴充既有的）— 同一份程式碼會被 backend 和 extension 共用
4. **註冊**：把 mapper 加進 `packages/mapper/src/dispatch.ts` 的 `LIST_HANDLERS` 或 `GROUP_HANDLERS`
5. **寫測試**：`backend-ts/tests/unit/<resource>-mapper.test.ts`

---

## 回報問題

開 Issue 時請附：
- 復現步驟
- 期待行為 vs 實際行為
- 環境（OS、Python / Node 版本、瀏覽器）
- 後端 log（loglevel INFO 即可，PHI 自行打碼）

---

## 安全議題

如果你發現安全弱點（例如 OAuth2 流程 bypass、CORS 洩漏、PHI 跨病人查詢），請**不要**在公開 Issue 揭露，先以 email 私下聯繫 voho0000 @ gmail.com。詳見 [SECURITY.md](SECURITY.md)。

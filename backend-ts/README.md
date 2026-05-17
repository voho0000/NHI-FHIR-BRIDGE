# NHI-FHIR-Bridge backend (TypeScript port)

Side-by-side TypeScript port of the FastAPI backend at `../backend/`.
Public API surface is byte-for-byte identical — the Chrome extension,
Next.js dashboard, and SMART apps work without any change.

## Stack
- Node 20 + Hono (web framework)
- Drizzle ORM + better-sqlite3 (synchronous SQLite)
- Zod (validation)
- Vitest (tests) + Biome (lint+format)

## Run

```sh
npm install
npm run dev               # tsx src/main.ts (auto-reload off; restart manually)
```

Default port: `8010` (override via `PORT` env). DB file: `./data/ehr_bridge.db`
(override via `DATABASE_FILE`). Same `.env` keys as the Python backend
(`SYNC_API_KEY`, `LLM_PROVIDER`, `ANTHROPIC_API_KEY`, `OLLAMA_BASE_URL`,
`OLLAMA_MODEL`, `FHIR_BASE_URL`, `ALLOW_CORS_ORIGINS`).

## Tests + lint

```sh
npx vitest run            # 83 tests
npx biome check src tests
npx tsc --noEmit
```

## Docker

```sh
docker compose -f ../docker-compose.ts.yml up --build
```

The `docker-compose.ts.yml` file lives alongside the original
`docker-compose.yml` during cutover so both can boot side-by-side. Once
extension + dashboard smoke-tests pass against the TS backend, rename
`docker-compose.ts.yml` → `docker-compose.yml` and delete `../backend/`.

## Module map (Python → TypeScript)

| Python                       | TypeScript                       |
|------------------------------|----------------------------------|
| `app/core/*.py`              | `src/core/*.ts`                  |
| `app/models/fhir_store.py`   | `src/models/schema.ts` (Drizzle) |
| `app/mapper/*.py`            | `src/mapper/*.ts`                |
| `app/fhir/*.py`              | `src/fhir/*.ts`                  |
| `app/smart/oauth2.py`        | `src/smart/oauth2.ts`            |
| `app/api/{fhir,smart,sync}.py` | `src/api/{fhir,smart,sync}.ts` |
| `app/fallback/*.py`          | `src/fallback/*.ts`              |
| `app/main.py`                | `src/main.ts`                    |
| `alembic/`                   | `drizzle/` + `drizzle.config.ts` |
| `tests/`                     | `tests/`                         |

The Python backend remains intact until the user has completed an
end-to-end smoke (extension sync → dashboard view → SMART app launch)
against the TS backend.

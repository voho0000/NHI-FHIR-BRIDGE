# NHI-FHIR-Bridge backend

Hono + Drizzle + better-sqlite3. FHIR R4 store, SMART on FHIR OAuth2
endpoints, and the `/sync/*` ingestion API the Chrome extension calls.

## Stack
- Node 20 + Hono (web framework)
- Drizzle ORM + better-sqlite3 (synchronous SQLite)
- Zod (validation)
- Vitest (tests) + Biome (lint + format)

## Run

```sh
npm install
npm run dev           # tsx watch src/main.ts
```

Default port: `8010` (override via `PORT`). DB file: `./data/ehr_bridge.db`
(override via `DATABASE_FILE`).

Relevant env:
- `SYNC_API_KEY` — required header on every PHI route. Empty = no auth (dev only)
- `BIND_HOST` — default `127.0.0.1`. Docker compose sets `0.0.0.0` internally
- `FHIR_BASE_URL` — advertised in CapabilityStatement
- `ALLOWED_EXTENSION_IDS` — comma-separated chrome-extension IDs allowed via CORS
- `ALLOW_CORS_ORIGINS` — extra origins beyond the built-in localhost defaults

No LLM / AI integration of any kind. PHI never leaves the host.

## Tests + lint

```sh
npm test              # vitest run
npm run lint
npm run typecheck
```

## Docker

Use the repo-root `docker-compose.yml`:

```sh
docker compose up --build
```

## Source layout

| Path | Purpose |
|------|---------|
| `src/api/fhir.ts`   | `/fhir/*` REST endpoints (Patient + per-patient clinical resource types) |
| `src/api/smart.ts`  | SMART OAuth2 authorize/token/launch-context |
| `src/api/sync.ts`   | `/sync/upload-structured` + audit/log/status reads |
| `src/core/`         | config, sqlite, migrate, auth middleware |
| `src/fhir/`         | FHIR store (upsert, search), CapabilityStatement |
| `src/smart/oauth2.ts` | code/token storage, PKCE verification |
| `src/models/schema.ts` | Drizzle schema |
| `drizzle/`          | SQL migrations |
| `tests/`            | Vitest unit tests |

The NHI → FHIR mapping logic lives in `../packages/mapper`, shared with
the Chrome extension.

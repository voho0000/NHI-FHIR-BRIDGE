# Extension tests

`vitest` unit + snapshot tests for the NHI-FHIR-Bridge Chrome extension.

## Run

```bash
# From repo root
npm run test:extension       # one-shot run
npm run test:coverage        # one-shot run + v8 coverage report
# From extension/
npm run test:watch           # watch mode while editing
```

## What's tested

The extension's `background.js` is a service-worker entry that can't be
loaded under a node test runner (chrome.* APIs, SW globals). So the
unit-testable logic lives in two pure-function modules:

| Module | What | Tested in |
|---|---|---|
| `src/nhi-adapters.js` | Each NHI JSON shape → normalized FHIR-friendly shape | `tests/adapters.test.js` (60+ cases) + `tests/fixtures.snapshot.test.js` |
| `src/nhi-endpoints.js` | Endpoint URL → page_type → adapter registry + 中文 label map | `tests/endpoints.test.js` |

Coverage thresholds (enforced in CI via `vitest.config.js`):

| Metric | Threshold |
|---|---|
| Lines | 90% |
| Functions | 95% |
| Branches | 80% |
| Statements | 90% |

Current coverage at the time of writing: 100% lines / 100% functions /
91% branches. The handful of uncovered branches are graceful-degradation
fallbacks for empty/null values that are exercised in production but
hard to enumerate exhaustively in unit form.

## Why this test layer exists

The v0.6.1 lab-date bug (inpatient labs all collapsed onto the admission
day) shipped because adapter functions had zero coverage. They sat
inside `background.js` next to `chrome.scripting.executeScript` calls,
so vitest couldn't load the file. The fix was structural — extract them
to a pure module, then pin every field-priority decision with tests.

When adding a new adapter:

1. Write the adapter in `src/nhi-adapters.js`. Export it.
2. Register it in `src/nhi-endpoints.js` with a Chinese label (the
   endpoints test will fail loudly if you forget).
3. Add a fixture under `tests/fixtures/` — real captured NHI payload
   when possible, synthetic when not. Document the source in the
   fixture's `_source` / `_note` fields.
4. Add unit tests to `tests/adapters.test.js` covering:
   - The happy path
   - Null / missing optional fields (don't crash)
   - Date field priority (which NHI field wins when multiple are
     present? When real-world payloads have nulls?)
   - Any bilingual / casing variants in NHI's key names
5. Add a snapshot test to `tests/fixtures.snapshot.test.js` running
   the fixture through the adapter. This catches whole-shape drift.

## Fixtures

Real captured payloads carry full provenance in their `_source` field:

```
ihke3409-lab-inpatient.json       — live IHKE3409S01 row, exposed the v0.6.1 date bug
ihke3408-imaging-detail.json      — live IHKE3408S02 row, real_INSPECT_DATE: null case
ihke3301s05-procedures.json       — live IHKE3301S05 main_data (2 rows)
```

Synthetic fixtures are clearly marked in `_note` and follow the
documented schema in the corresponding adapter's docstring.

## Regenerating snapshots

After a deliberate output-shape change:

```bash
cd extension
npx vitest run --update tests/fixtures.snapshot.test.js
```

Review the diff carefully before committing — an unintended change to
adapter output is exactly what the snapshot is designed to catch.

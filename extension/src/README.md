# NHI-FHIR Bridge — Chrome Extension (developer notes)

A Manifest V3 Chrome extension that reads your records from 健保署「健康存摺」
(`myhealthbank.nhi.gov.tw`) and converts them to **HL7 FHIR R4 locally, inside
the extension**. By default the result is **downloaded to your own machine** as
a JSON file; an optional advanced mode uploads to a self-hosted local backend.

> This file is a short developer note. For what the tool does, the step-by-step
> usage, the page→FHIR table, privacy, and the non-official disclaimer, see the
> **[root README](../../README.md)**, [docs/PRIVACY.md](../../docs/PRIVACY.md),
> and [docs/SECURITY_FOR_USERS.md](../../docs/SECURITY_FOR_USERS.md). End users
> install the packaged build from GitHub Releases / the Chrome Web Store rather
> than loading this folder.

---

## Build + load unpacked (development)

```sh
npm run build:extension      # repo root → produces extension/dist/
# or: cd extension && npm run dev   (esbuild watch)
```

1. Open Chrome → `chrome://extensions`
2. Enable **Developer mode** (top-right)
3. **Load unpacked** → select `extension/dist/` (the only folder Chrome loads)
4. After a rebuild, click the card's refresh icon

Tests / typecheck / lint: `npm run test:extension`, `tsc --noEmit`, `biome check src`.

---

## Source layout

```
src/popup/         — popup UI (4-step wizard, date range, settings)
src/background/     — MV3 service worker: NHI API sync, imaging fetch, bundle build
src/manifest.json  — MV3 config; host_permissions: myhealthbank.nhi.gov.tw only
                     (localhost is optional_host_permissions, requested on demand)
packages/mapper/   — shared NHI → FHIR R4 mapping (also imported by backend-ts)
```

The build bundles `src/` into `extension/dist/` (committed to git so users can
load it directly). The same `packages/mapper` runs in both the service worker
(Mode A) and the backend (Mode B), so both modes emit identical FHIR.

> No AI / LLM in the extension or mapper — conversion is pure deterministic
> code. (An external SMART app a user may launch from step ④ — e.g. MediPrisma
> — can use cloud AI; that's the app's optional feature, not this extension.)

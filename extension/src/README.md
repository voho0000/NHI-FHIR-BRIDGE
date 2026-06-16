# NHI-FHIR Bridge — Chrome Extension

A Manifest V3 Chrome extension that reads your records from 健保署健康存摺
(`myhealthbank.nhi.gov.tw`) and converts them to **HL7 FHIR R4 locally, inside
the extension**. By default the result is **downloaded to your own machine** as
a JSON file — nothing is sent to any server. An optional advanced mode can
upload to a self-hosted local backend (see below).

> Data flow: NHI portal → (in-browser conversion) → **Save-as download on your
> machine**. No developer server, no AI/LLM, no telemetry. See
> [docs/PRIVACY.md](../../docs/PRIVACY.md) and
> [docs/SECURITY_FOR_USERS.md](../../docs/SECURITY_FOR_USERS.md).

---

## Installation (Developer Mode)

1. Open Chrome → `chrome://extensions`
2. Enable **Developer mode** (top-right toggle)
3. Run `npm run build:extension` (repo root) to produce `extension/dist/`
4. Click **Load unpacked** → select the `extension/dist/` folder
5. The NHI-FHIR Bridge icon appears in the toolbar

(End users install the packaged build from the Chrome Web Store instead.)

---

## Usage (default: download to disk)

1. Log in to `myhealthbank.nhi.gov.tw` with your IC card or health card
2. Navigate to any 健康存摺 page
3. Click the NHI-FHIR Bridge icon
4. (Optional) Fill in **Patient Override** — 身分證字號 / name / birth date — if
   the portal renders identity as an image that can't be read
5. Pick a date range and click **同步本人資料 / Sync This Patient** — the
   extension calls NHI's underlying JSON endpoints in-page (reusing your
   first-party session), walks every section, and converts to FHIR locally
6. When the **📥 下載健康紀錄檔** button appears, click it → a **Save As**
   dialog lets you choose where the FHIR bundle JSON lands

You can close the popup mid-sync; the background service worker continues.

---

## Output

One FHIR R4 `Bundle` (JSON), file-named
`nhi-<masked-id>-<from>-<to>-v<bridge-version>.json`. Resource types emitted:
`Patient`, `Encounter`, `MedicationRequest`, `Observation`,
`DiagnosticReport`, `Procedure`, `AllergyIntolerance`, `Immunization`,
`Condition`, and more — see the page table in the
[root README](../../README.md).

---

## Patient Override

NHI 健康存摺 sometimes renders patient identity as an image rather than text.
The **Patient Override** section lets you supply 身分證字號 (used to derive the
FHIR Patient id), name, birth date, and gender. These are stored in
`chrome.storage.local` (browser-local only — never synced to your Google
account) and used for that tab session.

---

## Settings

| Field | Default | Description |
|-------|---------|-------------|
| 抓影像 (fetch imaging) | off | Also trigger + retrieve NHI imaging JPEGs (slower) |
| 去識別化 (de-identify) | off | Derive `Patient.id` from the half-masked ID |
| Backend URL | *(empty)* | **Advanced**: self-hosted local FHIR backend to upload to |
| Sync API Key | *(empty)* | **Advanced**: `X-Sync-API-Key` header for backend auth |
| SMART App URL | demo app | URL launched via SMART on FHIR (advanced) |

All settings persist in `chrome.storage.local` (browser-local; not
`chrome.storage.sync` — preferences stay on this machine).

---

## Advanced: local backend mode

Toggling **進階設定 → 啟用本機伺服器模式** switches the output from
download-to-disk to uploading the FHIR resources to a self-hosted backend
(default `http://localhost`, gated behind `optional_host_permissions` requested
at the moment you enable it). This is for users who self-host the Docker
backend + Dashboard; the default flow needs no backend. See
[backend-ts/README.md](../../backend-ts/README.md) and
[docs/ARCHITECTURE.md](../../docs/ARCHITECTURE.md).

---

## Architecture

```
src/popup/          — popup UI (wizard, date range, settings)
src/background/      — MV3 service worker: NHI API sync, imaging fetch, bundle build
src/manifest.json   — MV3 config; host_permissions: myhealthbank.nhi.gov.tw only
packages/mapper/    — shared NHI → FHIR R4 mapping logic (also used by backend-ts)
```

The build (`npm run build:extension`) bundles TypeScript `src/` into
`extension/dist/` (the only folder loaded by Chrome / shipped to the store).

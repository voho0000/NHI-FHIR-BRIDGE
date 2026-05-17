# NHI-FHIR Bridge — Chrome Extension

A Manifest V3 Chrome Extension that captures pages from 健保署健康存摺 (`myhealthbank.nhi.gov.tw`) and sends them to the NHI-FHIR-Bridge backend for FHIR R4 conversion.

---

## Installation (Developer Mode)

1. Open Chrome → `chrome://extensions`
2. Enable **Developer mode** (top-right toggle)
3. Click **Load unpacked** → select this `extension/` folder
4. The NHI-FHIR Bridge icon appears in the toolbar

---

## Usage

### Prerequisites

- Start the backend: `docker compose up --build` (or `cd backend && uvicorn app.main:app --reload`)
- Log in to `myhealthbank.nhi.gov.tw` with your IC card or health card

### Sync Modes

| Mode | When to use | How it works |
|------|-------------|--------------|
| **Capture & Sync** (single page) | Any NHI page | Grabs current page HTML → POST to backend |
| **Sync This Patient** | Any NHI page | Auto-navigates through all 健康存摺 pages in sequence |
| **API-Direct Sync** | When id_no is set in popup | Calls NHI's underlying JSON endpoints directly |

### Step-by-step: Sync This Patient

1. Log in to `myhealthbank.nhi.gov.tw` (IC card or health card required)
2. Navigate to any 健康存摺 page (e.g., 藥品醫囑)
3. Click the NHI-FHIR Bridge extension icon
4. (Optional) Fill in **Patient Override** — 身分證字號 / name / birth date — if the NHI portal hides patient identity
5. Click **Sync This Patient** — the extension drives your tab through each section automatically
6. Progress is shown in the popup; you can close it mid-sync — the background service worker continues

### Step-by-step: Manual Capture

Useful for individual pages or when automatic navigation fails.

1. Navigate to the target NHI page
2. Click the extension icon
3. Confirm the detected page type
4. Click **Capture & Sync**

---

## Recognized NHI Pages

| IHKE Code | Page Type | Content |
|-----------|-----------|---------|
| IHKE3101S01 | `patient_info` | 個人基本資料 |
| IHKE3306S01 / S02 | `medications` | 藥品醫囑 |
| IHKE3303S02 | `encounters` | 就醫紀錄 |
| IHKE3401S01 / IHKE3407S01 | `observations` | 檢驗檢查 |
| IHKE3202S01 | `allergies` | 藥物過敏 |
| IHKE3301S05 | `procedures` | 手術醫療程序 |

---

## Patient Override

NHI 健康存摺 sometimes renders patient identity in images rather than text, making it unscrapeable. The **Patient Override** section in the popup lets you manually supply:

- **身分證字號** (id_no) — used as the FHIR Patient ID
- Name, birth date, gender (optional)

These values are saved in `chrome.storage.local` and sent with every upload from that tab session.

---

## Settings

| Field | Default | Description |
|-------|---------|-------------|
| Backend URL | `http://localhost:8010` | NHI-FHIR-Bridge backend |
| Sync API Key | *(empty)* | Optional `X-Sync-API-Key` header for backend auth |
| SMART App URL | demo app | URL launched via SMART on FHIR |

Settings persist in `chrome.storage.sync` across Chrome profiles.

---

## Architecture

```
popup.js        — UI logic, page detection, button handlers
background.js   — Service worker: runNhiSync() tab-navigation, runNhiApiSync()
manifest.json   — MV3 config, host_permissions for myhealthbank.nhi.gov.tw
```

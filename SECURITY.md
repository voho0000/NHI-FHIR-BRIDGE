# Security Policy

NHI-FHIR-BRIDGE processes sensitive health information (PHI from Taiwan
NHI 健康存摺). We take security reports seriously.

## 通報安全弱點 / Reporting a Vulnerability

如果你發現可能影響 PHI 機密性、完整性、或存取控制的漏洞，**請不要在公開 Issue 揭露**。

請將細節寄到：**voho0000@gmail.com**

請在 email 中包含：

- 漏洞描述與影響範圍
- 重現步驟（包含相關 endpoint、payload、預期 vs 實際行為）
- 你建議的修正方向（若有）
- 如果可能，附上 PoC

我會在 **72 小時內回覆**，並在驗證後與你協調揭露時程。修補通常會在
1-2 週內 push 並 release。

## In Scope

- Auth/authz bypass:
  - `/sync/*`, `/smart/launch-context`, `/fhir/import`, `/fhir/export` SYNC_API_KEY enforcement
  - SMART OAuth2 flow (PKCE, redirect_uri allowlist, token expiry, scope enforcement)
  - Patient-scoped Bearer token leaking other patients' data
- Cross-patient data leaks via search/filter logic
- CORS bypass / wildcard misconfiguration
- SQL injection (especially `LIKE` operator wildcard handling)
- Path traversal in any file path handling
- Extension-level: chrome.storage exfiltration, message-passing auth bypass

## Out of Scope

- Local LPE on the machine running the backend (you already own that machine)
- Issues that require already-compromised browser sessions
- Functional bugs (open an Issue instead)

## Security Architecture

See [docs/ARCHITECTURE.md — 安全模型](docs/ARCHITECTURE.md#安全模型) for the
auth model and CORS dual-tier design.

Key invariants:

- All PHI-writing endpoints gate on `X-Sync-API-Key`
- FHIR-read endpoints gate on SMART OAuth2 Bearer token
- Public clients (SMART apps without client_secret) MUST send PKCE
  `code_challenge` — enforced at `/smart/authorize`
- Patient-scoped tokens use **exact** match against `Patient/<id>`, not
  substring (Taiwan national IDs are fixed-length with no separator, so
  substring matching could leak A12345678 → A123456789)
- The Bridge, backend, and mapper have **no AI / LLM integration** — FHIR
  conversion is pure deterministic code, and none of them send PHI to any
  third-party API. (An external SMART app the user may *choose* to launch —
  e.g. MediPrisma — can use cloud AI; that is the app's own optional feature,
  separate from this project.)

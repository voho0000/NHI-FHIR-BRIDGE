# LOINC Mapping Audit — 2026-05-19

## Why this audit ran

`packages/mapper/src/loinc-tables.ts` is the source of truth for every LOINC code the bridge
attaches to a 健保 lab observation. Downstream SMART clinical apps route lab values into
clinical columns **by LOINC**, so a wrong LOINC isn't a cosmetic bug — it silently routes a
value into the wrong clinical column (data looks present in the EMR but the actual reading
is missing from where it should appear).

Two prior dual-reviewer audits caught copy-paste bugs of the exact same pattern:

1. **FSH (09125C) and Estradiol (09127C)** were once mislabeled with TSH / LH LOINCs
   (corrected in an earlier audit; see inline comments around `NHI_TO_LOINC["09125C"]` in
   the source).
2. **Free T4 (09106C)** was recently (commit
   [`9da5e5b`](https://github.com/voho0000/NHI-FHIR-BRIDGE/commit/9da5e5b)) re-mapped from
   3024-7 → 14920-3 because 3024-7 was thought to be Total T4. **This audit pass discovered
   that premise was inverted** — see finding F below.

This pass verified every LOINC code flagged by an initial scan against
[loinc.org](https://loinc.org) (the source of truth) and turned up **seven critical
wrong-analyte mappings**, three high-severity wrong-domain/wrong-specimen mappings, four
mechanical display-string corruptions, and one issue with the recent Free T4 commit.

## Methodology and confidence

- The flagged codes below were each verified by fetching `https://loinc.org/<code>/`
  directly and reading the Long Common Name / Component / Property fields.
- All seven entries in section A were independently fetched and confirmed (8/8 confirmation
  rate on the flagging agent's hits — the agent was reliable at *finding* wrong LOINCs).
- The agent's *suggested replacement* LOINCs were NOT all reliable (spot-checks showed
  2/3 were also wrong: 2686-4 is Orotate-Urine not Ammonia; 2459-6 is IgA-monoclonal not
  IgM). Hence this audit does **not** propose new LOINCs for the removed entries; that
  decision is deferred to project owner with verified-loinc.org evidence required.
- The audit was NOT a full manual sweep of every single one of the ~115 NHI_TO_LOINC
  entries. It (a) verified every flagged hit, and (b) spot-checked a sample of "verified
  correct" entries (AST 1920-8, Leukocytes 6690-2, HbA1c 4548-4, TSH 3016-3, PSA 83112-3,
  Free PSA 83113-1 — all confirmed correct). Entries not on this list are presumed correct
  but were not individually fetched.

## Findings

### A. NHI_TO_LOINC — wrong analyte entirely (CRITICAL) — REMOVED in this pass

Each row: NHI 醫令碼 → current LOINC → what loinc.org actually says that LOINC means.

| NHI code | NHI comment in file | LOINC | loinc.org Long Common Name | Evidence |
|---|---|---|---|---|
| 14004B | CMV IgG — Ab S/P | 7849-3 | **Taenia solium larva IgM Ab [Presence] in Serum** (pork tapeworm IgM antibody) | https://loinc.org/7849-3/ |
| 14048B | CMV IgM — Ab S/P | 7850-1 | **Taenia solium larva Ab [Units/volume] in Serum** | https://loinc.org/7850-1/ |
| 13013C | TB Culture | 31952-5 | **Rinderpest virus Ag [Presence] in Exudate** (cattle morbillivirus) | https://loinc.org/31952-5/ |
| 09037C | Ammonia — Plasma | 1827-5 | **Alpha 1 antitrypsin MS [Mass/volume] in Serum or Plasma** | https://loinc.org/1827-5/ |
| 12028B | IgM 單向免疫擴散 | 14002-0 | **IgM [Units/volume] in Cord blood** (neonatal cord-blood specimen) | https://loinc.org/14002-0/ |
| 12029B | IgM 免疫比濁法 | 14002-0 | (same as 12028B) | https://loinc.org/14002-0/ |
| 12069B | Cryptococcus Ag — Mass/vol S/P | 5132-6 | **DNA single strand Ab [Units/volume] in Serum** (anti-ssDNA, lupus serology) | https://loinc.org/5132-6/ |

**Action taken (commit `fix(mapper): remove 7 NHI codes mapped to clinically unrelated LOINCs`)**:
deleted each entry from `NHI_TO_LOINC`, leaving an inline `// previously mapped to … which is
actually …` comment in the same style as the existing 13007C / 16008C precedents in the same
file. Bridge now falls back to NHI-code-only coding (no `http://loinc.org` system entry) for
these seven NHI codes — the same fallback path 13007C and 16008C have used in production for
months. Regression tests added in
[`backend-ts/tests/unit/observation-mapper.test.ts`](../backend-ts/tests/unit/observation-mapper.test.ts)
to assert these wrong LOINCs cannot silently come back.

### B. NHI_TO_LOINC — wrong domain / wrong specimen (HIGH) — NOT changed; needs owner

| NHI code | NHI comment in file | LOINC | loinc.org Long Common Name | Evidence |
|---|---|---|---|---|
| 22001C | 純音聽力檢查 | 45498-3 | **Hearing [Minimum Data Set]** — an MDS-3 LTC functional assessment, NOT a pure-tone audiometry result | https://loinc.org/45498-3/ |
| 22015B | 詐聾聽力檢查 | 45498-3 | (same as 22001C) | https://loinc.org/45498-3/ |
| 22025B | 自記聽力檢查 | 46530-2 | **Sensory status - hearing and ability to understand spoken language [OASIS]** — home-care assessment, not audiometry | https://loinc.org/46530-2/ |
| 12052B | β2-微球蛋白 | 10873-8 | **Beta-2-Microglobulin [Mass/time] in 24 hour Urine** — timed urine collection, not serum | https://loinc.org/10873-8/ |

**Why not auto-fixed**: domain judgment is required. For the audiometry codes, the right
substitution depends on what the 健保署 audiometry billing actually produces in the consumer
SMART app's view (a pure-tone threshold table? a single overall status? a procedure tag?). The
LOINC families to consider are 8696-* and 71039-*, but pick one only after talking to
whoever owns the audiology workflow. For 12052B, the right call depends on whether the NHI
billing 12052B in Taiwan typically maps to serum B2M (most common clinical order in TW labs)
or to a timed-urine workup; an owner with access to 院所 billing data can answer this.

### C. LOINC_DISPLAY — `#` character corruption (LOW) — FIXED in this pass

Four entries had the canonical `#/volume` mangled into `,  // /volume` — almost certainly a
botched sed at some past point (`#` is a perfectly valid TypeScript string character; no
escaping was needed):

| LOINC | Was | Restored to |
|---|---|---|
| 6690-2 | `Leukocytes [,  // /volume] in Blood by Automated count` | `Leukocytes [#/volume] in Blood by Automated count` |
| 777-3 | `Platelets [,  // /volume] in Blood by Automated count` | `Platelets [#/volume] in Blood by Automated count` |
| 789-8 | `Erythrocytes [,  // /volume] in Blood by Automated count` | `Erythrocytes [#/volume] in Blood by Automated count` |
| 711-2 | `Eosinophils [,  // /volume] in Blood by Automated count` | `Eosinophils [#/volume] in Blood by Automated count` |

**Action taken (commit `fix(mapper): repair # corruption in 4 LOINC_DISPLAY entries`)**: replaced
`[,  // /volume]` with `[#/volume]` in each entry. Pure cosmetic — these strings are emitted as
`Observation.code.coding[].display` for SMART app consumers; no routing impact.

### D. LOINC_DISPLAY — content mismatches tied to finding F — FIXED in this pass

| LOINC | Was (wrong) | Restored to (loinc.org canonical) |
|---|---|---|
| 3024-7 | `Thyroxine (T4) [Mass/volume] in Serum or Plasma` (missing "free") | `Thyroxine (T4) free [Mass/volume] in Serum or Plasma` |
| 14920-3 | `Thyroxine (T4) free [Mass/volume] in Serum or Plasma` (Mass was a lie) | `Thyroxine (T4) free [Moles/volume] in Serum or Plasma` |

Fixed alongside finding F below.

### F. The Free T4 (09106C) situation — RESOLVED in this pass

Commit
[`9da5e5b`](https://github.com/voho0000/NHI-FHIR-BRIDGE/commit/9da5e5b)
("fix(mapper): Free T4 LOINC was wrong (3024-7 is Total T4, not Free T4)") changed `09106C`
from 3024-7 → 14920-3.

**The premise of that commit was inverted**. Per loinc.org, both codes are Free T4 — the
Component on each page is literally `Thyroxine.free`:

- **[3024-7](https://loinc.org/3024-7/)** — Component `Thyroxine.free`, Property **MCnc**
  (mass concentration). Long Common Name: *"Thyroxine (T4) free [Mass/volume] in Serum or
  Plasma"*. Units: ng/dL.
- **[14920-3](https://loinc.org/14920-3/)** — Component `Thyroxine.free`, Property **SCnc**
  (substance concentration, i.e., molar). Long Common Name: *"Thyroxine (T4) free
  [Moles/volume] in Serum or Plasma"*. Units: pmol/L.

Both 3024-7 and 14920-3 are Free T4. The original mapping was clinically correct; the "fix"
replaced a mass-concentration Free T4 LOINC with a molar Free T4 LOINC. Taiwan lab reports
overwhelmingly use ng/dL (mass) for Free T4, so the original mapping was the LOINC-↔-unit
aligned choice.

**Action taken in this pass** (commit
`fix(mapper): revert 09106C Free T4 to 3024-7 (Mass conc — matches Taiwan ng/dL)`):

- `NHI_TO_LOINC["09106C"]` restored to `3024-7` (mass conc, matches Taiwan ng/dL reports).
- Inline comment in `loinc-tables.ts` near 09106C rewritten to accurately describe both
  LOINCs and the unit-system reasoning.
- LOINC_DISPLAY entries for 3024-7 and 14920-3 fixed (see section D).
- Regression test
  [`Free T4 (NHI 09106C) maps to LOINC 3024-7`](../backend-ts/tests/unit/observation-mapper.test.ts)
  updated to assert 09106C → 3024-7 and explain the MCnc/SCnc reasoning inline.

## Out-of-scope / open items for follow-up

Items not addressed by this audit pass:

1. **Pick correct replacement LOINCs for the 7 removed entries** (from section A). Candidate
   starting points to verify against loinc.org before adopting:
   - CMV IgG (was 14004B → 7849-3 Taenia): 22592-9, 5126-8 — verify before use
   - CMV IgM (was 14048B → 7850-1 Taenia): 7853-5, 47368-6 — verify before use
   - Ammonia (was 09037C → 1827-5 antitrypsin): 32683-5 — verify before use; **note 2686-4
     is Orotate-Urine, verified wrong**
   - IgM serum (was 12028B/12029B → 14002-0 cord blood): 2464-4, 2467-9 — verify; **note
     2459-6 is IgA monoclonal, verified wrong**
   - TB culture (was 13013C → 31952-5 Rinderpest): 530-6, 14127-5 — verify before use
   - Cryptococcus Ag (was 12069B → 5132-6 anti-ssDNA): 31703-2 — verify before use
2. **Section B**: pick a course for the audiometry codes (22001C / 22015B / 22025B) and for
   the β2-microglobulin specimen mismatch (12052B).
3. ~~Section D + F: resolve the Free T4 mapping question and fix both LOINC_DISPLAY entries
   accordingly.~~ **Resolved in this pass** — see section F.
4. **Full sweep**: an exhaustive code-by-code loinc.org verification of every NHI_TO_LOINC
   entry that *wasn't* flagged. The audit was reactive (verified what was flagged) — it
   doesn't guarantee 100% coverage of the table.

## Pattern observation

All three known LOINC-bug pairs in this repo's history follow the same shape:

- FSH/Estradiol confusion (TSH / LH LOINCs pasted in for hormones the developer was actively
  thinking about as TSH/LH).
- Free T4 (3024-7) → wrong-premise "correction" to 14920-3.
- All seven entries in section A (CMV / TB / Ammonia / IgM / Cryptococcus) — the LOINC code
  in the table is a few digits off from the right one, suggesting a fat-finger or
  copy-from-adjacent-row-in-some-list mistake.

**Recommendation for future LOINC additions**: any new NHI_TO_LOINC entry should be added
with a verifying `WebFetch` (or curl) of `https://loinc.org/<code>/` cited in the commit
message — same evidence pattern used in this audit and the prior FSH/Estradiol audit.

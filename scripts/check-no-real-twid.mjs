#!/usr/bin/env node
/**
 * CI guard: no checksum-VALID Taiwan national IDs in git-tracked files.
 *
 * Why: a full TWID (1 letter + 1/2 + 8 digits) that passes the official
 * checksum is presumptively a REAL person's ID — test data must use
 * checksum-INVALID synthetics (e.g. F223456789, B223456789) so a leak is
 * impossible by construction. Added 2026-06-12 after a real ID was found
 * committed in a test file (audit P0-1).
 *
 * Allowlist: A123456789 — the canonical spec example everyone recognizes
 * as fake (it happens to pass the checksum by design).
 *
 * Usage: node scripts/check-no-real-twid.mjs   (exit 1 on violation)
 */
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

const ALLOWLIST = new Set(["A123456789"]);

// Official TWID checksum: letter → 2-digit code, weighted sum mod 10 === 0.
const LETTER_CODE = {
  A: 10, B: 11, C: 12, D: 13, E: 14, F: 15, G: 16, H: 17, I: 34, J: 18,
  K: 19, L: 20, M: 21, N: 22, O: 35, P: 23, Q: 24, R: 25, S: 26, T: 27,
  U: 28, V: 29, W: 32, X: 30, Y: 31, Z: 33,
};

export function isValidTwid(id) {
  const m = /^([A-Z])([12])(\d{8})$/.exec(id);
  if (!m) return false;
  const code = LETTER_CODE[m[1]];
  const digits = (m[2] + m[3]).split("").map(Number);
  let sum = Math.floor(code / 10) + (code % 10) * 9;
  const weights = [8, 7, 6, 5, 4, 3, 2, 1];
  for (let i = 0; i < 8; i++) sum += digits[i] * weights[i];
  sum += digits[8]; // check digit
  return sum % 10 === 0;
}

const BINARY_EXT = /\.(png|jpg|jpeg|gif|ico|woff2?|ttf|zip|pdf|db)$/i;

function main() {
  const files = execSync("git ls-files", { encoding: "utf8" })
    .split("\n")
    .filter((f) => f && !BINARY_EXT.test(f));

  const violations = [];
  for (const file of files) {
    let text;
    try {
      text = readFileSync(file, "utf8");
    } catch {
      continue; // unreadable / deleted — not our problem here
    }
    // Word-ish boundary: avoid matching inside longer hex/base64 runs.
    const re = /(?<![A-Za-z0-9])([A-Z][12]\d{8})(?![0-9])/g;
    for (const m of text.matchAll(re)) {
      const id = m[1];
      if (ALLOWLIST.has(id)) continue;
      if (isValidTwid(id)) {
        const line = text.slice(0, m.index).split("\n").length;
        violations.push(`${file}:${line}: ${id.slice(0, 6)}**** (checksum-valid TWID)`);
      }
    }
  }

  if (violations.length) {
    console.error("❌ checksum-valid Taiwan national ID(s) found in tracked files:");
    for (const v of violations) console.error(`   ${v}`);
    console.error(
      "\nReplace with a checksum-INVALID synthetic ID (e.g. F223456789)." +
        "\nIf this is intentionally the canonical spec example, add it to ALLOWLIST with justification.",
    );
    process.exit(1);
  }
  console.log(`✅ no real-looking TWID in ${files.length} tracked files`);
}

main();

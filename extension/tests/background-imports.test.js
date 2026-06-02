// Static check: in every background module, each adapter / endpoint
// export called directly must also appear in that file's import block.
//
// This catches the regression family we saw in v0.6.3: extracting code
// into a module, removing imports that "looked unused", then having
// production fail at runtime with `<fn> is not defined` because a
// non-registry call site still references the function.
//
// Esbuild doesn't catch undefined names at build time. tsc/jsdoc would
// but the extension is plain JS by choice (TypeScript is a later phase).
// This test is the cheap safety net: reads each file as text, finds
// `<name>(...)` invocations and `import { ... } from ".../nhi-adapters.js"`
// / `nhi-endpoints.js` blocks, then asserts call set ⊆ import set —
// PER FILE, since the bug is a file that calls a name it didn't import.
//
// Scope note: after the v0.13.x background.js split, the SW logic lives
// across src/background.js + src/background/*.js. We glob all of them so
// a missing import in any module is caught, not just the entry file.

import { describe, expect, test } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import * as adapters from "../src/nhi-adapters.js";
import * as endpoints from "../src/nhi-endpoints.js";

const SRC_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "../src");
const BG_DIR = resolve(SRC_DIR, "background");

// All SW source files: the entry + every background/ module.
const FILES = [
  resolve(SRC_DIR, "background.js"),
  ...readdirSync(BG_DIR)
    .filter((f) => f.endsWith(".js"))
    .map((f) => resolve(BG_DIR, f)),
];

// Names we expect to find imported from nhi-adapters.js or nhi-endpoints.js.
// Anything not in this list is presumed local / from another import.
const KNOWN_EXPORTS = new Set([
  ...Object.keys(adapters),
  ...Object.keys(endpoints),
]);

// Strip comments so a comment like "// adaptFoo unfolds rows" doesn't
// get mistaken for a real call site.
function stripComments(s) {
  return s
    .replace(/\/\*[\s\S]*?\*\//g, "")   // /* ... */
    .replace(/^\s*\/\/.*$/gm, "");       // // ...
}

// Direct invocations of an exported name: `adaptXxx(...)` where the
// function is the first thing before `(` — NOT `.adaptXxx(` (method
// call via the registry import, which goes through NHI_API_ENDPOINTS).
function callSitesOf(code) {
  const out = new Set();
  for (const m of code.matchAll(/(?<![\w.$])([a-zA-Z_$][\w$]*)\s*\(/g)) {
    if (KNOWN_EXPORTS.has(m[1])) out.add(m[1]);
  }
  return out;
}

// Names imported from nhi-adapters.js / nhi-endpoints.js (whether the
// module references them as "./nhi-…" or "../nhi-…"). `[^}]*` (no braces
// inside) keeps the match from spanning across two import blocks.
function importedNamesOf(code) {
  const out = new Set();
  for (const m of code.matchAll(
    /import\s*\{([^}]*)\}\s*from\s*["']\.{1,2}\/nhi-(?:adapters|endpoints)\.js["']/g,
  )) {
    for (const piece of m[1].split(",")) {
      const name = piece.trim();
      if (name) out.add(name);
    }
  }
  return out;
}

const perFile = FILES.map((path) => {
  const code = stripComments(readFileSync(path, "utf8"));
  return {
    name: path.slice(SRC_DIR.length + 1),
    callSites: callSitesOf(code),
    importedNames: importedNamesOf(code),
  };
});

describe("background module imports vs direct call sites", () => {
  for (const f of perFile) {
    test(`${f.name}: every adapter/endpoint call is imported`, () => {
      const missing = [...f.callSites].filter((n) => !f.importedNames.has(n));
      expect(
        missing,
        `${f.name} calls ${missing.join(", ") || "(none)"} directly but ` +
        `does not import them — this is exactly the bug pattern that ` +
        `produced "adaptEncounterFromMedExpense is not defined" in v0.6.3 ` +
        `production syncs.`,
      ).toEqual([]);
    });
  }

  test("the SW source actually imports adapter/endpoint exports somewhere", () => {
    // Sanity: not zero across all files. Catches the case where the
    // import blocks got accidentally deleted entirely and the per-file
    // tests silently pass because every callSites set is empty.
    const total = perFile.reduce((n, f) => n + f.importedNames.size, 0);
    expect(total).toBeGreaterThan(0);
  });
});

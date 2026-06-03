// Static check: in every popup module, each cross-module function it
// calls must also be imported into that file.
//
// Same regression family as background-imports.test.js (v0.6.3: a name
// is called but its import was dropped during a module move, and esbuild
// bundles it as an undefined global instead of erroring). After the
// v0.13.x popup.js split the logic lives across src/popup.js +
// src/popup/*.js, none of which run under vitest (chrome.* / DOM), so
// this text scan is the primary static guard until the TypeScript phase.
//
// How it works, per file:
//   callSites = names called as `name(` that are exported by SOME popup
//               module (so we only police cross-module references)
//   allowed   = names defined locally in the file ∪ names it imports
//   missing   = callSites − allowed   → must be empty

import { describe, expect, test } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SRC_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "../src");
const POPUP_DIR = resolve(SRC_DIR, "popup");

// Entry + every popup/ module.
const FILES = [
  resolve(SRC_DIR, "popup.js"),
  ...readdirSync(POPUP_DIR)
    .filter((f) => f.endsWith(".js"))
    .map((f) => resolve(POPUP_DIR, f)),
];

function stripComments(s) {
  return s
    .replace(/\/\*[\s\S]*?\*\//g, "")   // /* ... */
    .replace(/^\s*\/\/.*$/gm, "");       // // ...
}

// Names a file exports (function / const / let / var, plus `export {}`).
function exportedNamesOf(code) {
  const out = new Set();
  for (const m of code.matchAll(/export\s+(?:async\s+)?function\s+([A-Za-z_$][\w$]*)/g))
    out.add(m[1]);
  for (const m of code.matchAll(/export\s+(?:const|let|var)\s+([A-Za-z_$][\w$]*)/g))
    out.add(m[1]);
  for (const m of code.matchAll(/export\s*\{([^}]*)\}/g)) {
    for (const piece of m[1].split(",")) {
      const name = piece.trim().split(/\s+as\s+/).pop()?.trim();
      if (name) out.add(name);
    }
  }
  return out;
}

// Names imported from any relative module ("./x.js" / "../x.js").
function importedNamesOf(code) {
  const out = new Set();
  for (const m of code.matchAll(/import\s*\{([^}]*)\}\s*from\s*["']\.[^"']*["']/g)) {
    for (const piece of m[1].split(",")) {
      const name = piece.trim().split(/\s+as\s+/).pop()?.trim();
      if (name) out.add(name);
    }
  }
  return out;
}

// Names defined locally: function declarations + top-level/inner const/
// let/var bindings. (Destructuring `const { a } =` is intentionally not
// captured — those names are never popup exports.)
function localDefsOf(code) {
  const out = new Set();
  for (const m of code.matchAll(/(?:async\s+)?function\s+([A-Za-z_$][\w$]*)/g))
    out.add(m[1]);
  for (const m of code.matchAll(/(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=/g))
    out.add(m[1]);
  return out;
}

// Direct invocations `name(` — NOT `.name(` (method calls).
function callSitesOf(code, known) {
  const out = new Set();
  for (const m of code.matchAll(/(?<![\w.$])([a-zA-Z_$][\w$]*)\s*\(/g)) {
    if (known.has(m[1])) out.add(m[1]);
  }
  return out;
}

const sources = FILES.map((path) => ({
  name: path.slice(SRC_DIR.length + 1),
  code: stripComments(readFileSync(path, "utf8")),
}));

// Union of every popup-module export — the set of names we police.
const POPUP_EXPORTS = new Set();
for (const f of sources) {
  for (const n of exportedNamesOf(f.code)) POPUP_EXPORTS.add(n);
}

const perFile = sources.map((f) => ({
  name: f.name,
  callSites: callSitesOf(f.code, POPUP_EXPORTS),
  allowed: new Set([...localDefsOf(f.code), ...importedNamesOf(f.code)]),
}));

describe("popup module imports vs cross-module call sites", () => {
  for (const f of perFile) {
    test(`${f.name}: every cross-module call is imported or local`, () => {
      const missing = [...f.callSites].filter((n) => !f.allowed.has(n));
      expect(
        missing,
        `${f.name} calls ${missing.join(", ") || "(none)"} but neither ` +
        `imports nor defines them — the same "X is not defined" bug ` +
        `pattern from v0.6.3, which esbuild bundles silently.`,
      ).toEqual([]);
    });
  }

  test("the popup actually exports a meaningful number of names", () => {
    // Sanity: the split produced real modules. Catches a glob that
    // matched nothing (all callSites empty → every per-file test passes
    // vacuously).
    expect(POPUP_EXPORTS.size).toBeGreaterThan(10);
  });
});

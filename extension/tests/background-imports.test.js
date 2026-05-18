// Static check: every adapter / helper function called directly in
// background.js must also be in its import block.
//
// This catches the regression family we saw in v0.6.3: extracting code
// into a module, removing imports that "looked unused", then having
// production fail at runtime with `<fn> is not defined` because a
// non-registry call site still references the function.
//
// Esbuild doesn't catch undefined names at build time. tsc/jsdoc would
// but the extension is plain JS by choice. This test is the cheap
// safety net: reads the file as text, finds `<name>(...)` invocations
// and `import { ... } from "./nhi-adapters.js"` / `./nhi-endpoints.js`
// blocks, then asserts the call set ⊆ import set.

import { describe, expect, test } from "vitest";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import * as adapters from "../src/nhi-adapters.js";
import * as endpoints from "../src/nhi-endpoints.js";

const SRC = resolve(dirname(fileURLToPath(import.meta.url)), "../src/background.js");
const text = readFileSync(SRC, "utf8");

// Names we expect to find imported from ./nhi-adapters.js or ./nhi-endpoints.js.
// Anything not in this list is presumed local / from another import.
const KNOWN_EXPORTS = new Set([
  ...Object.keys(adapters),
  ...Object.keys(endpoints),
]);

// Strip line-comments so a comment like "// adaptFoo unfolds rows"
// doesn't get mistaken for a real call site.
function stripComments(s) {
  return s
    .replace(/\/\*[\s\S]*?\*\//g, "")   // /* ... */
    .replace(/^\s*\/\/.*$/gm, "");       // // ...
}

const code = stripComments(text);

// Extract every direct invocation of an exported name: `adaptXxx(...)`
// or `rocToISO(...)`, but ONLY where the function is the first thing
// before `(` (not e.g. `.adaptXxx(` which is a method call from a
// registry entry — those go through the registry import).
const callSites = new Set();
for (const m of code.matchAll(/(?<![\w.$])([a-zA-Z_$][\w$]*)\s*\(/g)) {
  if (KNOWN_EXPORTS.has(m[1])) callSites.add(m[1]);
}

// Extract names actually imported in the file. Use `[^}]*` (no braces
// inside) rather than `[\s\S]*?` to avoid the regex engine spanning
// across a "} from "@somewhere"; import { ..." boundary into a second
// import block. Imports don't have braces in their identifier list so
// this is safe.
const importedNames = new Set();
for (const m of code.matchAll(
  /import\s*\{([^}]*)\}\s*from\s*["'](\.\/nhi-(?:adapters|endpoints))\.js["']/g,
)) {
  for (const piece of m[1].split(",")) {
    const name = piece.trim();
    if (name) importedNames.add(name);
  }
}

describe("background.js imports vs direct call sites", () => {
  test("every direct call to an adapter/endpoint export is imported", () => {
    const missing = [...callSites].filter((n) => !importedNames.has(n));
    expect(
      missing,
      `background.js calls ${missing.join(", ") || "(none)"} ` +
      `directly but does not import them — this is exactly the bug ` +
      `pattern that produced "adaptEncounterFromMedExpense is not defined" ` +
      `in v0.6.3 production syncs.`,
    ).toEqual([]);
  });

  test("import block lists at least the function set we know is used", () => {
    // Sanity: not zero. Catches the case where the import block got
    // accidentally deleted entirely and the test silently passes
    // because callSites is empty.
    expect(importedNames.size).toBeGreaterThan(0);
  });
});

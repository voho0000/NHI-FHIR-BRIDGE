/**
 * Extension build script.
 *
 * Bundles `src/{background,popup,sidebar}.js` → `dist/`, inlining the
 * shared mapper from `@nhi-fhir-bridge/mapper` so the service worker
 * and popup can both call `mapPatient`, `linkEncountersInResources`,
 * etc. without runtime module resolution.
 *
 * Static assets (manifest.json, popup.html) are copied verbatim.
 * Run `node build.mjs` for one-shot, `node build.mjs --watch` for dev.
 */

import { copyFileSync, mkdirSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

import * as esbuild from "esbuild";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(__dirname, "dist");
const SRC = resolve(__dirname, "src");

const watch = process.argv.includes("--watch");

rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });

/** Common esbuild options for the three bundled entry points. */
const bundleOpts = {
  bundle: true,
  format: "iife", // service worker accepts classic-script IIFE
  platform: "browser",
  target: "chrome120",
  sourcemap: "inline",
  logLevel: "info",
};

const entries = ["background.js", "popup.js", "sidebar.js"];

const contexts = await Promise.all(
  entries.map((file) =>
    esbuild.context({
      ...bundleOpts,
      entryPoints: [resolve(SRC, file)],
      outfile: resolve(DIST, file),
    }),
  ),
);

// Static files: manifest, popup.html. README is excluded from the
// shipped bundle (lives in source only).
const STATIC_FILES = ["manifest.json", "popup.html"];
for (const f of STATIC_FILES) {
  copyFileSync(resolve(SRC, f), resolve(DIST, f));
}

if (watch) {
  await Promise.all(contexts.map((c) => c.watch()));
  console.log("[build] watching… (Ctrl+C to stop)");
} else {
  await Promise.all(contexts.map((c) => c.rebuild()));
  await Promise.all(contexts.map((c) => c.dispose()));
  console.log(`[build] dist/ ready (${entries.length} bundles + ${STATIC_FILES.length} static files)`);
}

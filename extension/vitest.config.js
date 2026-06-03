import { defineConfig } from "vitest/config";

// Explicit vitest config so coverage scope is bounded to the modules
// we actually unit-test (adapters + endpoint registry). The service
// worker — src/background.ts and the src/background/*.ts modules it was
// split into (v0.13.x) — can't run in a node test environment
// (chrome.* / SW globals), so they're deliberately excluded from
// coverage; including them would drop the percent by ~80% and fail the
// thresholds for no useful reason. Their static safety net is now
// `tsc --noEmit` (the v0.13.4 TS migration retired the
// background-imports / popup-imports regex guards — the compiler catches
// the "called-but-not-imported" bug class they guarded), plus the
// golden-bundle diff that gates each refactor PR.
export default defineConfig({
  test: {
    include: ["tests/**/*.test.js"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/nhi-adapters.ts", "src/nhi-endpoints.ts"],
      // Require keeping the adapter module well-tested. Numbers are
      // tightened-up from the actual coverage we currently achieve;
      // bumping these is intentional engineering effort.
      thresholds: {
        lines: 90,
        functions: 95,
        branches: 80,
        statements: 90,
      },
    },
  },
});

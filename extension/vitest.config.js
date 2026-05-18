import { defineConfig } from "vitest/config";

// Explicit vitest config so coverage scope is bounded to the modules
// we actually unit-test (adapters + endpoint registry). background.js
// can't run in a node test environment — chrome.* / SW globals — so
// it's deliberately excluded from coverage; otherwise the percent
// drops by ~80% for no useful reason.
export default defineConfig({
  test: {
    include: ["tests/**/*.test.js"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/nhi-adapters.js", "src/nhi-endpoints.js"],
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

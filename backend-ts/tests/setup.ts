/**
 * Shared vitest setup.
 *
 * Mirrors `backend/tests/conftest.py`: set env vars BEFORE any `@/`
 * imports happen so the cached `settings` singleton picks up test values.
 */

import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const TEST_DB_DIR = mkdtempSync(join(tmpdir(), "nhi-fhir-bridge-test-"));
const TEST_DB = join(TEST_DB_DIR, "test.db");

// Set BEFORE imports — same pattern as the pytest conftest.
process.env.DATABASE_FILE = TEST_DB;
process.env.LLM_PROVIDER = process.env.LLM_PROVIDER ?? "none";

// Best-effort cleanup at process exit.
process.on("exit", () => {
  try {
    rmSync(TEST_DB_DIR, { recursive: true, force: true });
  } catch {
    /* swallow */
  }
});

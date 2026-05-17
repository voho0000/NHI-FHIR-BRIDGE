/**
 * Runtime configuration loaded from environment variables.
 *
 * Port of `backend/app/core/config.py`. All values are read once at module
 * load time — restart the process to pick up env changes.
 */

import { z } from "zod";

// "claude" was removed in v0.5.0 — sending PHI HTML to a third-party
// cloud LLM contradicts the project's stated privacy posture. Ollama
// stays as the only fallback option (runs locally, doesn't leave host).
const LlmProviderSchema = z.enum(["ollama", "none"]).default("none");

const SettingsSchema = z.object({
  // SQLite file path. The Python `DATABASE_URL` was a SQLAlchemy URL like
  // `sqlite+aiosqlite:///./data/ehr_bridge.db`. Drizzle / better-sqlite3
  // wants just the file path, so we keep a separate `DATABASE_FILE` env var.
  // Default points to the same file the Python backend uses, so a single
  // SQLite file works across both backends during cutover.
  DATABASE_FILE: z.string().default("./data/ehr_bridge.db"),

  // LLM provider for the fallback path. Default "none". Only Ollama
  // (local) is supported; cloud providers are intentionally absent
  // so PHI never leaves the host even on the fallback path.
  LLM_PROVIDER: LlmProviderSchema,
  OLLAMA_BASE_URL: z.string().default("http://host.docker.internal:11434"),
  OLLAMA_MODEL: z.string().default("qwen2.5vl:7b"),

  // API key required as `X-Sync-API-Key` on PHI-writing endpoints.
  // Empty = no auth (single-user localhost only).
  SYNC_API_KEY: z.string().default(""),

  // Public FHIR base URL exposed in CapabilityStatement.
  FHIR_BASE_URL: z.string().default("http://localhost:8010/fhir"),

  // Extra CORS origins (comma-separated) appended to the built-in
  // localhost + voho0000.github.io + nhi.gov.tw defaults.
  ALLOW_CORS_ORIGINS: z.string().default(""),

  // HTTP server port. Loopback-only bind enforced at server.listen time.
  PORT: z.coerce.number().int().default(8010),
});

export type Settings = z.infer<typeof SettingsSchema>;

/**
 * Parsed environment, fail-fast at startup if any field is invalid.
 * Held as a module-level singleton — same pattern as Pydantic's `settings`.
 */
export const settings: Settings = SettingsSchema.parse(process.env);

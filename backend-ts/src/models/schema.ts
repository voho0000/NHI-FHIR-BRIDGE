/**
 * Database schema (Drizzle ORM, SQLite).
 *
 * Port of `backend/app/models/fhir_store.py`. Column types, names, and
 * indexes match the Alembic baseline migration so the same SQLite file
 * works against either backend during cutover.
 */

import { randomUUID } from "node:crypto";
import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * Stores any FHIR R4 resource as JSON.
 *
 * `id` is a backend-generated UUID for row uniqueness. `fhir_id` is the
 * FHIR resource ID exposed in `/fhir/<type>/<id>` URLs. The two are
 * separated because re-syncs upsert by (resource_type, fhir_id) — a
 * stable user-facing ID — while `id` stays unique per row.
 */
export const fhirResources = sqliteTable(
  "fhir_resources",
  {
    id: text("id", { length: 36 })
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    resourceType: text("resource_type", { length: 64 }).notNull(),
    fhirId: text("fhir_id", { length: 255 }).notNull(),
    versionId: text("version_id", { length: 16 }).notNull().default("1"),
    resource: text("resource", { mode: "json" }).$type<Record<string, any>>().notNull(),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => ({
    resourceTypeIdx: index("ix_fhir_resources_resource_type").on(t.resourceType),
    fhirIdIdx: index("ix_fhir_resources_fhir_id").on(t.fhirId),
  }),
);

/** Audit log for each HIS sync job. */
export const syncLogs = sqliteTable("sync_logs", {
  id: text("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  status: text("status", { length: 32 }).notNull().default("running"),
  patientId: text("patient_id", { length: 255 }),
  message: text("message"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  completedAt: integer("completed_at", { mode: "timestamp" }),
});

/** Registered SMART on FHIR clients. */
export const oauthClients = sqliteTable("oauth_clients", {
  clientId: text("client_id", { length: 255 }).primaryKey(),
  clientSecret: text("client_secret", { length: 255 }),
  clientName: text("client_name", { length: 255 }).notNull(),
  redirectUris: text("redirect_uris", { mode: "json" })
    .$type<string[]>()
    .notNull()
    .default(sql`'[]'`),
  allowedScopes: text("allowed_scopes", { mode: "json" })
    .$type<string[]>()
    .notNull()
    .default(sql`'[]'`),
  isConfidential: integer("is_confidential", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

/** Short-lived OAuth2 authorization codes. */
export const authorizationCodes = sqliteTable("authorization_codes", {
  code: text("code", { length: 255 }).primaryKey(),
  clientId: text("client_id", { length: 255 }).notNull(),
  redirectUri: text("redirect_uri", { length: 1024 }).notNull(),
  scopes: text("scopes", { mode: "json" })
    .$type<string[]>()
    .notNull()
    .default(sql`'[]'`),
  patientId: text("patient_id", { length: 255 }),
  codeChallenge: text("code_challenge", { length: 255 }),
  codeChallengeMethod: text("code_challenge_method", { length: 16 }),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  used: integer("used", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

/** Active access tokens issued to SMART apps. */
export const oauthTokens = sqliteTable("oauth_tokens", {
  id: text("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  clientId: text("client_id", { length: 255 }).notNull(),
  accessToken: text("access_token", { length: 512 }).notNull().unique(),
  scopes: text("scopes", { mode: "json" })
    .$type<string[]>()
    .notNull()
    .default(sql`'[]'`),
  patientId: text("patient_id", { length: 255 }),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

/**
 * Tracks the last successful sync timestamp for each patient.
 * The extension records completion here so subsequent syncs can skip
 * patients whose last_synced_at is recent.
 */
export const patientSyncState = sqliteTable("patient_sync_state", {
  patientId: text("patient_id", { length: 255 }).primaryKey(),
  lastSyncedAt: integer("last_synced_at", { mode: "timestamp" }),
  syncLogId: text("sync_log_id", { length: 36 }),
});

/**
 * Per-capture audit trail for /sync/upload-html.
 *
 * Records WHO synced WHAT WHEN, sourced from the HIS user identifier in
 * the captured HTML's navbar (e.g. 使用者:XXXX or 操作人員:XXXX).
 *
 * PHI scope: stores patient_id and his_user (a hospital staff identifier).
 * Both are sensitive; live in the same SQLite DB as the FHIR data.
 */
export const auditLog = sqliteTable(
  "audit_log",
  {
    id: text("id", { length: 36 })
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    timestamp: integer("timestamp", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    hisUser: text("his_user", { length: 64 }),
    hisHost: text("his_host", { length: 255 }),
    pageType: text("page_type", { length: 64 }).notNull(),
    patientId: text("patient_id", { length: 64 }),
    htmlSize: integer("html_size").notNull().default(0),
    resourcesUpserted: integer("resources_upserted").notNull().default(0),
    success: integer("success", { mode: "boolean" }).notNull().default(true),
    error: text("error"),
    // Reserved for future Bearer-token auth.
    authTokenHint: text("auth_token_hint", { length: 64 }),
  },
  (t) => ({
    timestampIdx: index("ix_audit_log_timestamp").on(t.timestamp),
    hisUserIdx: index("ix_audit_log_his_user").on(t.hisUser),
    patientIdIdx: index("ix_audit_log_patient_id").on(t.patientId),
  }),
);

// Convenience type exports for use elsewhere.
export type FHIRResource = typeof fhirResources.$inferSelect;
export type NewFHIRResource = typeof fhirResources.$inferInsert;
export type SyncLog = typeof syncLogs.$inferSelect;
export type NewSyncLog = typeof syncLogs.$inferInsert;
export type OAuthClient = typeof oauthClients.$inferSelect;
export type NewOAuthClient = typeof oauthClients.$inferInsert;
export type AuthorizationCode = typeof authorizationCodes.$inferSelect;
export type NewAuthorizationCode = typeof authorizationCodes.$inferInsert;
export type OAuthToken = typeof oauthTokens.$inferSelect;
export type NewOAuthToken = typeof oauthTokens.$inferInsert;
export type PatientSyncState = typeof patientSyncState.$inferSelect;
export type AuditLog = typeof auditLog.$inferSelect;
export type NewAuditLog = typeof auditLog.$inferInsert;

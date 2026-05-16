/**
 * Database connection (better-sqlite3 + Drizzle).
 *
 * Port of `backend/app/core/database.py`. The Python backend used async
 * SQLAlchemy via aiosqlite. better-sqlite3 is synchronous which actually
 * simplifies most call sites — SQLite has at most one writer anyway and
 * a sync API removes the await-everything overhead.
 */

import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";

import { settings } from "@/core/config";
import * as schema from "@/models/schema";

// Ensure the data directory exists. better-sqlite3 won't create
// missing parents.
mkdirSync(dirname(settings.DATABASE_FILE), { recursive: true });

export const sqlite = new Database(settings.DATABASE_FILE);

// WAL mode → readers don't block writers, which matters for the sync
// path that writes audit_log entries while the dashboard polls FHIR.
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

export const db = drizzle(sqlite, { schema });

export type DB = typeof db;

/**
 * Apply drizzle migrations. Replaces `backend/app/core/main.py`'s call
 * to `alembic upgrade head` in the FastAPI lifespan.
 *
 * Idempotent — no-op when DB is already at head.
 */

import { migrate } from "drizzle-orm/better-sqlite3/migrator";

import { db } from "@/core/database";

export function runMigrations(): void {
  migrate(db, { migrationsFolder: "./drizzle" });
}

// Allow `tsx src/core/migrate.ts` as a manual entry point.
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigrations();
  console.log("[migrate] up to date");
  process.exit(0);
}

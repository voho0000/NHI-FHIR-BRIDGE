import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/models/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    // Default is the file the docker-compose backend mounts. Override
    // for local dev by setting DATABASE_FILE in the environment.
    url: process.env.DATABASE_FILE ?? "./data/ehr_bridge.db",
  },
  verbose: true,
  strict: true,
});

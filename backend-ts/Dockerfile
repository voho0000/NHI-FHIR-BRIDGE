# NHI-FHIR-Bridge backend (TypeScript port).
#
# Runs the TS sources directly via `tsx`. Single stage — keeps things
# simple at POC scale; switch to build/runtime split if image size matters.
#
# IMPORTANT: build context is the REPO ROOT (not backend-ts/) so we can
# also pull in packages/mapper/ for npm workspaces.
#   docker compose up -d --build       # via docker-compose.yml
#   docker build -f backend-ts/Dockerfile .   # raw

FROM node:20-bookworm-slim

WORKDIR /app

# Build deps for better-sqlite3's native binding + CJK fonts for any future
# PDF / image rendering of FHIR resources.
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ \
    fonts-noto-cjk \
    && rm -rf /var/lib/apt/lists/*

# Stage 1: copy ONLY the package manifests so npm install is cached
# unless dependencies change. Workspace members listed in root package.json
# need their manifests at install time even if we won't use their source.
COPY package.json package-lock.json* ./
COPY packages/mapper/package.json     ./packages/mapper/package.json
COPY backend-ts/package.json          ./backend-ts/package.json
COPY extension/package.json           ./extension/package.json

RUN npm install

# Stage 2: copy the source files we actually need for the backend.
COPY packages/mapper/src              ./packages/mapper/src
COPY backend-ts/tsconfig.json         ./backend-ts/tsconfig.json
COPY backend-ts/drizzle.config.ts     ./backend-ts/drizzle.config.ts
COPY backend-ts/src                   ./backend-ts/src
COPY backend-ts/drizzle               ./backend-ts/drizzle

WORKDIR /app/backend-ts
RUN mkdir -p /app/data

EXPOSE 8010

CMD ["npx", "tsx", "src/main.ts"]

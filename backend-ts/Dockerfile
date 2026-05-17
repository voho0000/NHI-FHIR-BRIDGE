# NHI-FHIR-Bridge backend (TypeScript port).
#
# Runs the TS sources directly via `tsx`. Keeping a single stage avoids
# path-alias rewriting plumbing — the POC traffic doesn't warrant a
# bundler step. Switch to a build/runtime split if container size matters.

FROM node:20-bookworm-slim

WORKDIR /app

# Build deps for better-sqlite3's native binding + CJK fonts for any future
# PDF / image rendering of FHIR resources.
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ \
    fonts-noto-cjk \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json* ./
RUN npm install

COPY tsconfig.json ./
COPY drizzle.config.ts ./
COPY src ./src
COPY drizzle ./drizzle

RUN mkdir -p /app/data

EXPOSE 8010

CMD ["npx", "tsx", "src/main.ts"]

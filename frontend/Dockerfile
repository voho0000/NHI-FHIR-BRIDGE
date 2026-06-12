# Production image (audit P2-5) — multi-stage build replacing the old
# `npm install` + `next dev` container. Build stage compiles the app;
# runtime stage runs Next's standalone server as the non-root `node` user.

# ── Build stage ────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# NEXT_PUBLIC_* vars are inlined into the browser bundle at BUILD time —
# setting them at runtime (docker-compose `environment:`) has no effect on
# client code. The default below matches docker-compose's public backend
# URL; pass a build arg if the public URL ever differs. Server-side-only
# vars (BACKEND_INTERNAL_URL, SYNC_API_KEY, DASHBOARD_ALLOWED_HOSTS) are
# read at runtime by the /api/backend proxy and stay in `environment:`.
ARG NEXT_PUBLIC_API_URL=http://localhost:8010

RUN npm run build

# ── Runtime stage ──────────────────────────────────────────────────────
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

# Standalone output = server.js + pruned node_modules; static assets are
# served from .next/static which standalone expects alongside server.js.
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

USER node

EXPOSE 3000

CMD ["node", "server.js"]

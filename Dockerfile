# syntax=docker/dockerfile:1.7

FROM node:26-bookworm-slim AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

FROM base AS dependencies
COPY package.json package-lock.json ./
COPY patches ./patches
RUN npm ci

FROM base AS builder
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production \
    NODE_OPTIONS=--max-old-space-size=2048 \
    CMS_ENABLED=false \
    PAYLOAD_DB=postgres \
    PAYLOAD_SECRET=build-time-only-not-used-at-runtime \
    DATABASE_URL=postgres://build:build@127.0.0.1:5432/build
RUN npm run build:server

# One-off image used by Compose to apply checked-in Payload migrations.
FROM base AS migrator
COPY --from=dependencies /app/node_modules ./node_modules
COPY package.json package-lock.json next.config.mjs tsconfig.json ./
COPY src ./src
COPY scripts ./scripts
COPY lib ./lib
COPY components ./components
RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs --home-dir /app nextjs \
  && mkdir -p /app/public/media/cms /app/private/career-files \
  && chown -R nextjs:nodejs /app/public/media/cms /app/private/career-files
ENV NODE_ENV=production PAYLOAD_DB=postgres CMS_ENABLED=true
USER nextjs
CMD ["npm", "run", "cms:migrate"]

FROM node:26-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=3000 \
    PAYLOAD_DB=postgres \
    CMS_ENABLED=true

RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs --home-dir /app nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
RUN mkdir -p /app/public/media/cms /app/private/career-files \
  && chown -R nextjs:nodejs /app/public/media/cms /app/private/career-files

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]

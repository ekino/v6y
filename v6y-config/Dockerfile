# syntax=docker/dockerfile:1.9

# One multi-stage build for every v6y service. The heavy stages (deps, source,
# backend-deps) are shared, so the published images reuse each other's layers
# instead of each carrying its own copy of the monorepo.
#
# Build a single service with:
#   docker build -f v6y-config/Dockerfile --target bff -t v6y-bff .
# Build them all with:
#   docker buildx bake -f docker-bake.hcl

ARG NODE_VERSION=22-alpine
ARG PNPM_VERSION=11.17.0
ARG PRISMA_VERSION=7.8.0

# --------------------------------------------------------------------- base
# Runtime foundation. openssl is required by the Prisma query engine and
# libc6-compat by the prebuilt native addons (sharp, swc) on musl.
FROM node:${NODE_VERSION} AS base
RUN apk add --no-cache openssl libc6-compat
# Every build stage inherits this. Harmless for the builds themselves, but it
# does break vitest if you run it inside one of them: under NODE_ENV=production
# Vite externalises Node built-ins for the browser and the jsdom suites die with
# ERR_UNKNOWN_BUILTIN_MODULE. Debug tests with `-e NODE_ENV=test`.
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

# ---------------------------------------------------------------- pnpm-base
# Build-time foundation. Kept separate so runtime images never ship pnpm.
FROM base AS pnpm-base
ARG PNPM_VERSION
RUN npm install -g pnpm@${PNPM_VERSION}
# pnpm 11 re-verifies node_modules before running any script and can trigger an
# implicit reinstall; every stage below already installs a coherent tree.
# HUSKY=0 keeps the root "prepare" script inert: git hooks are meaningless here,
# and husky is a dev dependency that a --prod install does not even provide.
ENV npm_config_verify_deps_before_run=false \
    HUSKY=0 \
    CI=true

# ---------------------------------------------------------------- manifests
# Only the files that describe the dependency graph. This layer is invalidated
# by a manifest or lockfile change, never by a source edit.
FROM pnpm-base AS manifests
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY v6y-apps/bff/package.json                  v6y-apps/bff/
COPY v6y-apps/bfb-main-analyzer/package.json    v6y-apps/bfb-main-analyzer/
COPY v6y-apps/bfb-static-auditor/package.json   v6y-apps/bfb-static-auditor/
COPY v6y-apps/bfb-dynamic-auditor/package.json  v6y-apps/bfb-dynamic-auditor/
COPY v6y-apps/bfb-devops-auditor/package.json   v6y-apps/bfb-devops-auditor/
COPY v6y-apps/front/package.json                v6y-apps/front/
COPY v6y-apps/front-bo/package.json             v6y-apps/front-bo/
COPY v6y-libs/core-logic/package.json           v6y-libs/core-logic/
COPY v6y-libs/ui-kit/package.json               v6y-libs/ui-kit/
COPY v6y-libs/ui-kit-front/package.json         v6y-libs/ui-kit-front/

# ------------------------------------------------------------ build-toolchain
# node-gyp needs python3/make/g++ to compile bcrypt and event-loop-stats.
FROM manifests AS build-toolchain
RUN apk add --no-cache python3 make g++

# --------------------------------------------------------------------- deps
# Full install (dev dependencies included) used only to build.
FROM build-toolchain AS deps
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile --store-dir=/pnpm/store

# ------------------------------------------------------------------- source
# Shared parent of every build stage: sources plus a generated Prisma client.
FROM deps AS source
COPY . .
# Must run before any type-check: @v6y/core-logic re-exports types from
# @prisma/client, and both the Next builds and the backend compilation
# type-check against them. Skipping this is what broke every previous docker
# publish run.
RUN pnpm --filter @v6y/core-logic db:generate

# ------------------------------------------------------------------- builder
# Next.js production builds.
FROM source AS builder
# NEXT_PUBLIC_* values are inlined into the browser bundle by next build, so
# they have to be supplied here. Overriding them at container runtime has no
# effect on client-side code.
ARG NEXT_PUBLIC_V6Y_BFF_PATH=""
ENV NEXT_PUBLIC_V6Y_BFF_PATH=${NEXT_PUBLIC_V6Y_BFF_PATH}
RUN pnpm --filter @v6y/front build \
    && pnpm --filter @v6y/front-bo build

# ------------------------------------------------------------- backend-build
# Compiles the shared library and the five Node services to JavaScript. The app
# tsconfigs are emitDeclarationOnly because sources import each other with .ts
# specifiers; tsconfig.build.json turns on rewriteRelativeImportExtensions so
# TypeScript rewrites those to .js and real emit becomes possible.
FROM source AS backend-build
RUN pnpm --filter @v6y/core-logic build:prod \
    && pnpm --filter @v6y/bff build:prod \
    && pnpm --filter @v6y/bfb-main-analyzer build:prod \
    && pnpm --filter @v6y/bfb-static-auditor build:prod \
    && pnpm --filter @v6y/bfb-dynamic-auditor build:prod \
    && pnpm --filter @v6y/bfb-devops-auditor build:prod

# ------------------------------------------------------------- backend-deps
# Production-only tree for the five Node services. The filters pull in each
# service plus its workspace dependencies and nothing else, so the Next/antd
# dependency trees stay out of the backend images.
#
# --no-optional matters more than it looks: @prisma/client declares prisma and
# typescript as optional peer dependencies, which otherwise drags the Prisma
# CLI, Prisma Studio, pglite and two TypeScript copies (~307 MB of development
# tooling) into every backend image.
FROM build-toolchain AS backend-deps
ARG PRISMA_VERSION
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile --prod --no-optional --store-dir=/pnpm/store \
    --filter "@v6y/bff..." \
    --filter "@v6y/bfb-main-analyzer..." \
    --filter "@v6y/bfb-static-auditor..." \
    --filter "@v6y/bfb-dynamic-auditor..." \
    --filter "@v6y/bfb-devops-auditor..."
# The Prisma CLI is a dev dependency, so it is absent from this tree; fetch it
# on the fly to generate the client into the production node_modules.
COPY v6y-libs/core-logic/prisma                           v6y-libs/core-logic/prisma
COPY v6y-libs/core-logic/prisma.config.ts                 v6y-libs/core-logic/
COPY v6y-libs/core-logic/src/database/buildDatabaseUrl.ts v6y-libs/core-logic/src/database/
RUN cd v6y-libs/core-logic \
    && pnpm dlx prisma@${PRISMA_VERSION} generate

# --------------------------------------------------------- backend-runtime
# Shared runtime layer for the five Node services: production dependencies plus
# compiled JavaScript. No TypeScript sources, no transpiler, no pnpm.
FROM base AS backend-runtime
COPY --from=backend-deps --chown=node:node /app /app
COPY --from=backend-build --chown=node:node /app/v6y-libs/core-logic/dist          /app/v6y-libs/core-logic/dist
COPY --from=backend-build --chown=node:node /app/v6y-apps/bff/dist                 /app/v6y-apps/bff/dist
COPY --from=backend-build --chown=node:node /app/v6y-apps/bfb-main-analyzer/dist    /app/v6y-apps/bfb-main-analyzer/dist
COPY --from=backend-build --chown=node:node /app/v6y-apps/bfb-static-auditor/dist   /app/v6y-apps/bfb-static-auditor/dist
COPY --from=backend-build --chown=node:node /app/v6y-apps/bfb-dynamic-auditor/dist  /app/v6y-apps/bfb-dynamic-auditor/dist
COPY --from=backend-build --chown=node:node /app/v6y-apps/bfb-devops-auditor/dist   /app/v6y-apps/bfb-devops-auditor/dist
# @v6y/core-logic resolves to src/index.ts for development tooling, and a few
# backend modules deep-import its internals. The images ship no sources, so
# remap the package onto its compiled output; see the script for why the deep
# imports are mapped rather than rewritten.
COPY v6y-config/repoint-core-logic.cjs /tmp/repoint-core-logic.cjs
RUN node /tmp/repoint-core-logic.cjs /app/v6y-libs/core-logic/package.json \
    && rm /tmp/repoint-core-logic.cjs
USER node

# --------------------------------------------------------------------- bff
FROM backend-runtime AS bff
ENV V6Y_BFF_API_PORT=4001
WORKDIR /app/v6y-apps/bff
EXPOSE 4001
HEALTHCHECK --interval=30s --timeout=10s --retries=3 --start-period=40s \
    CMD wget -q --spider "http://127.0.0.1:${V6Y_BFF_API_PORT}/health" || exit 1
CMD ["node", "dist/index.js"]

# ------------------------------------------------------- bfb-main-analyzer
FROM backend-runtime AS bfb-main-analyzer
ENV V6Y_MAIN_API_PORT=4002
WORKDIR /app/v6y-apps/bfb-main-analyzer
EXPOSE 4002
HEALTHCHECK --interval=30s --timeout=10s --retries=3 --start-period=40s \
    CMD wget -q --spider "http://127.0.0.1:${V6Y_MAIN_API_PORT}/health" || exit 1
CMD ["node", "dist/index.js"]

# ------------------------------------------------- bfb-static-code-auditor
FROM backend-runtime AS bfb-static-code-auditor
ENV V6Y_STATIC_ANALYZER_API_PORT=4003
WORKDIR /app/v6y-apps/bfb-static-auditor
EXPOSE 4003
HEALTHCHECK --interval=30s --timeout=10s --retries=3 --start-period=40s \
    CMD wget -q --spider "http://127.0.0.1:${V6Y_STATIC_ANALYZER_API_PORT}/health" || exit 1
CMD ["node", "dist/index.js"]

# ------------------------------------------------- bfb-url-dynamic-auditor
FROM backend-runtime AS bfb-url-dynamic-auditor
ENV V6Y_DYNAMIC_ANALYZER_API_PORT=4004
WORKDIR /app/v6y-apps/bfb-dynamic-auditor
EXPOSE 4004
HEALTHCHECK --interval=30s --timeout=10s --retries=3 --start-period=40s \
    CMD wget -q --spider "http://127.0.0.1:${V6Y_DYNAMIC_ANALYZER_API_PORT}/health" || exit 1
CMD ["node", "dist/index.js"]

# ----------------------------------------------------- bfb-devops-auditor
FROM backend-runtime AS bfb-devops-auditor
ENV V6Y_DEVOPS_API_PORT=4005
WORKDIR /app/v6y-apps/bfb-devops-auditor
EXPOSE 4005
HEALTHCHECK --interval=30s --timeout=10s --retries=3 --start-period=40s \
    CMD wget -q --spider "http://127.0.0.1:${V6Y_DEVOPS_API_PORT}/health" || exit 1
CMD ["node", "dist/index.js"]

# ---------------------------------------------------------------- frontend
# next build with output: 'standalone' emits a self-contained server bundle, so
# these images carry no node_modules and no build toolchain at all.
FROM base AS frontend
ENV PORT=4006 \
    HOSTNAME=0.0.0.0
COPY --from=builder --chown=node:node /app/v6y-apps/front/.next/standalone ./
COPY --from=builder --chown=node:node /app/v6y-apps/front/.next/static ./v6y-apps/front/.next/static
COPY --from=builder --chown=node:node /app/v6y-apps/front/public ./v6y-apps/front/public
USER node
EXPOSE 4006
HEALTHCHECK --interval=30s --timeout=10s --retries=3 --start-period=40s \
    CMD wget -q --spider "http://127.0.0.1:${PORT}/health" || exit 1
CMD ["node", "v6y-apps/front/server.js"]

# ------------------------------------------------------------- frontend-bo
FROM base AS frontend-bo
ENV PORT=4008 \
    HOSTNAME=0.0.0.0
COPY --from=builder --chown=node:node /app/v6y-apps/front-bo/.next/standalone ./
COPY --from=builder --chown=node:node /app/v6y-apps/front-bo/.next/static ./v6y-apps/front-bo/.next/static
COPY --from=builder --chown=node:node /app/v6y-apps/front-bo/public ./v6y-apps/front-bo/public
USER node
EXPOSE 4008
HEALTHCHECK --interval=30s --timeout=10s --retries=3 --start-period=40s \
    CMD wget -q --spider "http://127.0.0.1:${PORT}/health" || exit 1
CMD ["node", "v6y-apps/front-bo/server.js"]

# ------------------------------------------------------------- migrate-deps
# Short-lived job image. Unlike the services it keeps the Prisma CLI (a dev
# dependency) and the TypeScript prisma.config.ts, both of which migrate deploy
# needs, so it is installed without --prod.
FROM build-toolchain AS migrate-deps
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile --store-dir=/pnpm/store \
    --filter "@v6y/core-logic..."

# ----------------------------------------------------------------- migrate
# Restarts from pnpm-base rather than inheriting migrate-deps, so the compiler
# toolchain needed to build bcrypt during the install stays out of the image.
FROM pnpm-base AS migrate
COPY --from=migrate-deps --chown=node:node /app /app
COPY --chown=node:node v6y-libs/core-logic/prisma           v6y-libs/core-logic/prisma
COPY --chown=node:node v6y-libs/core-logic/prisma.config.ts v6y-libs/core-logic/
COPY --chown=node:node v6y-libs/core-logic/src              v6y-libs/core-logic/src
USER node
CMD ["pnpm", "--filter", "@v6y/core-logic", "db:migrate:deploy"]

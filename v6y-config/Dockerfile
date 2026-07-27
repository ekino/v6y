# syntax=docker/dockerfile:1.9

# One multi-stage build for every v6y service. The heavy stages (deps, builder,
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
ARG TSX_VERSION=4.21.0

# --------------------------------------------------------------------- base
# Runtime foundation. openssl is required by the Prisma query engine and
# libc6-compat by the prebuilt native addons (sharp, swc) on musl.
FROM node:${NODE_VERSION} AS base
RUN apk add --no-cache openssl libc6-compat
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

# ------------------------------------------------------------------- builder
FROM deps AS builder
# NEXT_PUBLIC_* values are inlined into the browser bundle by next build, so
# they have to be supplied here. Overriding them at container runtime has no
# effect on client-side code.
ARG NEXT_PUBLIC_V6Y_BFF_PATH=""
ENV NEXT_PUBLIC_V6Y_BFF_PATH=${NEXT_PUBLIC_V6Y_BFF_PATH}
COPY . .
# Must run before any type-check: @v6y/core-logic re-exports types from
# @prisma/client, and the Next builds type-check against them. Skipping this is
# what broke every previous docker publish run.
RUN pnpm --filter @v6y/core-logic db:generate
RUN pnpm --filter @v6y/front build \
    && pnpm --filter @v6y/front-bo build

# ------------------------------------------------------------- backend-deps
# Production-only tree for the five Node services. The filters pull in each
# service plus its workspace dependencies and nothing else, so the Next/antd
# dependency trees stay out of the backend images.
FROM build-toolchain AS backend-deps
ARG PRISMA_VERSION
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile --prod --store-dir=/pnpm/store \
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
# Shared runtime layer for the five Node services. They execute their
# TypeScript sources through tsx: the app tsconfigs are emitDeclarationOnly and
# use .ts import specifiers, so there is no JavaScript build output to run.
# tsx is a dev dependency, so the production install above does not provide it.
# It is installed into an isolated prefix and linked into the workspace root
# node_modules rather than promoted to a production dependency, which would
# desynchronise pnpm-lock.yaml.
#
# The link is what makes it resolvable, not just runnable: core-logic's
# WorkerHelper spawns worker threads whose eval code calls
# import('tsx/esm/api'), and ESM resolution walks node_modules upwards from the
# app directory - it never consults globally installed packages.
FROM base AS backend-runtime
ARG TSX_VERSION
RUN mkdir -p /opt/tsx \
    && cd /opt/tsx \
    && npm init -y > /dev/null \
    && npm install --no-save tsx@${TSX_VERSION} \
    && ln -s /opt/tsx/node_modules/.bin/tsx /usr/local/bin/tsx
COPY --from=backend-deps --chown=node:node /app /app
COPY --chown=node:node . .
RUN ln -s /opt/tsx/node_modules/tsx /app/node_modules/tsx
USER node

# --------------------------------------------------------------------- bff
FROM backend-runtime AS bff
ENV V6Y_BFF_API_PORT=4001
WORKDIR /app/v6y-apps/bff
EXPOSE 4001
HEALTHCHECK --interval=30s --timeout=10s --retries=3 --start-period=40s \
    CMD wget -q --spider "http://127.0.0.1:${V6Y_BFF_API_PORT}/health" || exit 1
CMD ["tsx", "src/index.ts"]

# ------------------------------------------------------- bfb-main-analyzer
FROM backend-runtime AS bfb-main-analyzer
ENV V6Y_MAIN_API_PORT=4002
WORKDIR /app/v6y-apps/bfb-main-analyzer
EXPOSE 4002
HEALTHCHECK --interval=30s --timeout=10s --retries=3 --start-period=40s \
    CMD wget -q --spider "http://127.0.0.1:${V6Y_MAIN_API_PORT}/health" || exit 1
CMD ["tsx", "src/index.ts"]

# ------------------------------------------------- bfb-static-code-auditor
FROM backend-runtime AS bfb-static-code-auditor
ENV V6Y_STATIC_ANALYZER_API_PORT=4003
WORKDIR /app/v6y-apps/bfb-static-auditor
EXPOSE 4003
HEALTHCHECK --interval=30s --timeout=10s --retries=3 --start-period=40s \
    CMD wget -q --spider "http://127.0.0.1:${V6Y_STATIC_ANALYZER_API_PORT}/health" || exit 1
CMD ["tsx", "src/index.ts"]

# ------------------------------------------------- bfb-url-dynamic-auditor
FROM backend-runtime AS bfb-url-dynamic-auditor
ENV V6Y_DYNAMIC_ANALYZER_API_PORT=4004
WORKDIR /app/v6y-apps/bfb-dynamic-auditor
EXPOSE 4004
HEALTHCHECK --interval=30s --timeout=10s --retries=3 --start-period=40s \
    CMD wget -q --spider "http://127.0.0.1:${V6Y_DYNAMIC_ANALYZER_API_PORT}/health" || exit 1
CMD ["tsx", "src/index.ts"]

# ----------------------------------------------------- bfb-devops-auditor
FROM backend-runtime AS bfb-devops-auditor
ENV V6Y_DEVOPS_API_PORT=4005
WORKDIR /app/v6y-apps/bfb-devops-auditor
EXPOSE 4005
HEALTHCHECK --interval=30s --timeout=10s --retries=3 --start-period=40s \
    CMD wget -q --spider "http://127.0.0.1:${V6Y_DEVOPS_API_PORT}/health" || exit 1
CMD ["tsx", "src/index.ts"]

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
# Short-lived job image. It keeps the Prisma CLI (a dev dependency) and the
# TypeScript prisma.config.ts, both of which migrate deploy needs.
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

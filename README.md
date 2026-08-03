# Vitality (v6y)

<img src="v6y-apps/front/public/vitality_logo.svg" alt="Vitality logo" width="120" />

Vitality (v6y) is a project health monitoring platform built by Ekino. It audits codebases and running applications, then turns the results into a single, readable view so teams can see the state of their projects and know what to fix first.

## Table of Contents
1. [Why Vitality Exists](#why-vitality-exists)
2. [Architecture](#architecture)
3. [Prerequisites](#prerequisites)
4. [Project Setup](#project-setup)
5. [Running the Project](#running-the-project)
6. [Testing, Linting and Code Quality](#testing-linting-and-code-quality)
7. [Contributing](#contributing)
8. [License](#license)

## Why Vitality Exists

Project health data is usually scattered across many tools: static analysis output, dependency reports, runtime checks, DevOps signals. Each source speaks a different language, and most of them are too technical or too noisy to read quickly.

Vitality exists to solve that problem for teams maintaining many projects at once, developers, technical leads, and engineering managers. It collects those signals, audits applications automatically, and presents the results as structured, human-readable reports instead of raw logs. The goal is that anyone can look at a project, understand its health in a few seconds, and decide what needs attention without needing to be an expert in every underlying tool.

Vitality is not a generic analytics dashboard or a raw audit log viewer. It is a monitoring product: clarity and trust in what it reports matter more than covering every possible metric.

## Architecture

The repository is an Nx/pnpm monorepo made of several applications and shared libraries.

### Applications (`v6y-apps/`)
- **front**: Next.js web application, the main dashboard used to browse projects and audit reports.
- **back-office**: Next.js admin application (built on ra-core + shadcn/Tailwind) used to administer accounts, applications and configuration.
- **bff**: Backend-for-frontend exposing a GraphQL API consumed by `front` and `back-office`.
- **bfb-main-analyzer**: Orchestrates analysis jobs and dispatches work to the specialized auditor services below.
- **bfb-static-auditor**: Runs static code analysis (code quality, dependency and duplication checks) on a codebase.
- **bfb-dynamic-auditor**: Runs runtime/browser checks (e.g. Lighthouse) against a deployed application URL.
- **bfb-devops-auditor**: Audits operational/DevOps aspects of a project (CI, deployment configuration, etc.).

### Libraries (`v6y-libs/`)
- **core-logic**: Shared domain logic, database access and the Prisma schema used across the backend services.
- **ui-kit** / **ui-kit-front**: Shared, framework-agnostic UI components used by `front` and `back-office`.

Each service is independent (own `package.json`, own start/build/test scripts) and orchestrated through Nx targets and pnpm workspaces.

## Prerequisites

- Node.js `v22.11.0` (see [.nvmrc](.nvmrc))
- pnpm (installed via Corepack, version pinned in [package.json](package.json))
- Docker and Docker Compose, for the local PostgreSQL database and containerized runs
- A GitHub and/or GitLab personal access token if you plan to analyze repositories hosted there

## Project Setup

1. **Install dependencies** from the repository root (this installs every app and library through the pnpm workspace):
   ```bash
   pnpm install
   ```

2. **Configure environment variables**. Each app has its own `env-template` file; the root [env-template](env-template) covers the shared/database variables. Copy it to `.env` and fill in real values:
   ```bash
   cp env-template .env
   ```
   Key variables include the PostgreSQL connection settings (`PSQL_DB_*`, `DATABASE_URL`), the initial admin account (`SUPERADMIN_*`), source-control tokens (`GITLAB_PRIVATE_TOKEN`, `GITHUB_PRIVATE_TOKEN`), `JWT_SECRET`, and the API path/port for each backend service.

3. **Start the database** (and apply migrations) using Docker Compose:
   ```bash
   docker compose up v6y-database v6y-migrate
   ```
   Alternatively, once dependencies are installed and `DATABASE_URL` is set, migrations can be run directly with:
   ```bash
   pnpm run init-db
   ```

## Running the Project

- **Everything with Docker Compose** (database, migrations, BFF, and all analyzer services):
  ```bash
  docker compose up
  ```

- **Everything locally in development mode**, with hot reload:
  ```bash
  pnpm run start:dev:all
  ```

- **A single service**, for example the frontend or the BFF:
  ```bash
  pnpm run start:frontend
  pnpm run start:bff
  ```
  See the `scripts` section of the root [package.json](package.json) for the full list of `start:*` commands, one per app.

- **Stop everything**:
  ```bash
  pnpm run stop:all
  ```

## Testing, Linting and Code Quality

Run these from the repository root; Nx fans them out to every affected app and library:

```bash
pnpm run test              # unit tests
pnpm run lint               # lint all apps/libs
pnpm run lint:fix           # lint and auto-fix
pnpm run format:check       # verify formatting
pnpm run build              # build all apps/libs
pnpm run verify:code:duplication  # duplication check (jscpd)
```

`front` also exposes `pnpm --filter @v6y/front run test:e2e` for Playwright end-to-end tests.

## Contributing

Contributions are welcome. Please read the guidelines in the project [Wiki](https://github.com/ekino/v6y/wiki) before opening a pull request.

## License

Vitality (v6y) is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

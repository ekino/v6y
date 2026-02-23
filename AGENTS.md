# Vitality (v6y) - AI Agent Contribution Guide

**Project Name**: Vitality (v6y)  
**Description**: A web-based codebase health and performance monitoring platform for analyzing, auditing, and optimizing application quality.  
**Language**: TypeScript  
**Package Manager**: pnpm  
**Monorepo Tool**: Nx (v22.0.2)  

---

## Project Vision

Vitality is a comprehensive platform that enables developers and teams to continuously monitor and optimize the health and performance of their codebases. It provides real-time insights through static analysis, dynamic monitoring, code quality checks, and operational auditing.

---

## Architecture Overview

### Monorepo Structure
```
v6y/
├── v6y-apps/           # Application packages
├── v6y-libs/           # Shared libraries
├── v6y-database/       # Database initialization
├── v6y-e2e/            # End-to-end tests
├── v6y-bruno/          # API testing collections
└── v6y-config/         # Docker configuration
```

### Application Packages

#### **BFF (Backend for Frontend)** - `@v6y/bff`
- **Stack**: Express.js 5.2, Apollo GraphQL 4.11, Node.js
- **Database**: PostgreSQL with Sequelize ORM 6.37
- **Port**: Default 4000
- **Key Features**:
  - GraphQL API server
  - Response caching via Apollo plugins
  - Authentication via Passport.js
  - Status monitoring with express-status-monitor
  - CORS-enabled for frontend clients
- **Entry**: `src/index.ts`
- **Start**: `npm run start:bff`

#### **Frontend (User Portal)** - `@v6y/front`
- **Stack**: Next.js 15.4, React 19, TypeScript, TailwindCSS
- **Key Features**:
  - User dashboard for monitoring codebase health
  - Real-time data via TanStack React Query (v5.90)
  - GraphQL client integration
  - i18n support (i18next)
  - Responsive design with React Window virtualization
  - Toast notifications (Sonner)
  - Form validation with React Hook Form + Zod
  - Storybook integration for component development
- **Port**: Default 3000
- **Testing**: Vitest with React Testing Library
- **Start**: `npm run start:frontend`

#### **Frontend BO (Backoffice)** - `@v6y/front-bo`
- **Stack**: Next.js 15.4, React 19, TypeScript, TailwindCSS
- **Purpose**: Administrative interface for system management
- **Port**: Default 3001
- **Start**: `npm run start:frontend:bo`

#### **Auditor Services** - Analysis Engines
1. **Static Auditor** - `@v6y/bfb-static-auditor`
   - Analyzes code structure, complexity, dependencies
   - Uses Graphology for dependency graph analysis
   - Uses Typhonjs ESComplex for complexity metrics
   - Generates static analysis reports

2. **Dynamic Auditor** - `@v6y/bfb-url-dynamic-auditor`
   - Runtime application monitoring
   - Detects performance issues and errors

3. **DevOps Auditor** - `@v6y/bfb-devops-auditor`
   - Infrastructure and deployment health checks
   - Operational metrics analysis

4. **Main Analyzer** - `@v6y/bfb-main-analyzer`
   - Orchestrates multiple auditor services
   - Aggregates analysis results
   - Triggers comprehensive codebase analysis

### Shared Libraries

- **Core Logic** - `@v6y/core-logic`
  - Shared database schemas (Sequelize models)
  - API utilities and helpers
  - Configuration management
  - Type definitions
  - Test utilities
  
- **UI Kit** - `@v6y/ui-kit`
  - Shared React components
  - Design system components

- **UI Kit Front** - `@v6y/ui-kit-front`
  - Frontend-specific UI components

---

## Tech Stack

### Core Technologies
- **Runtime**: Node.js (TypeScript + ts-node)
- **Language**: TypeScript (strict mode)
- **Package Manager**: pnpm
- **Monorepo**: Nx
- **Database**: PostgreSQL + Sequelize ORM

### Frontend
- React (Server Components support)
- Next.js (App Router)
- TailwindCSS
- TanStack Query (React Query)
- GraphQL Client (graphql-request)
- Form handling: React Hook Form + Zod validation

### Backend
- Express.js
- Apollo GraphQL
- Sequelize
- Passport.js authentication
- Axios for HTTP requests

### Development & Quality
- **Linting**: ESLint + Prettier
- **Testing**: Vitest + jsdom
- **Coverage**: V8 coverage via @vitest/coverage-v8
- **Type Checking**: TypeScript compiler
- **Code Duplication**: jscpd
- **Dead Code Detection**: Knip
- **Git Hooks**: Husky + lint-staged
- **Bundle Analysis**: @next/bundle-analyzer

### Analysis Tools
- Graphology (graph analysis library)
- ESComplex (code complexity metrics)
- Madge (dependency analysis)
- XML parsing (xml2js)

---

## Directory Layout

### Key Paths
```
src/                          # Application source code
├── components/               # React components (reusable UI)
├── app/                       # Next.js App Router pages
├── hooks/                     # Custom React hooks
├── lib/                       # Utilities and helpers
├── services/                  # API service clients
├── types/                     # TypeScript type definitions
├── __tests__/                 # Test files
└── [feature]/                 # Feature-based organization

dist/                         # Compiled output
coverage/                     # Test coverage reports
node_modules/                 # Dependencies (pnpm)
```

---

## Key Scripts

### Development
```bash
pnpm start:frontend           # Start user portal (Next.js dev)
pnpm start:frontend:bo        # Start backoffice (Next.js dev)
pnpm start:bff                # Start BFF server
pnpm start:all                # Start all services concurrently
pnpm start:dev:all            # Start all in dev mode
```

### Quality & Testing
```bash
pnpm test                     # Run all tests (Vitest)
pnpm lint                     # Run ESLint across all packages
pnpm lint:fix                 # Lint and auto-fix
pnpm format                   # Format code with Prettier
pnpm format:check             # Check format without modifying
pnpm ts-coverage              # TypeScript coverage report
pnpm verify:code:duplication  # Check code duplication
pnpm knip                     # Find unused code
```

### Build & Deployment
```bash
pnpm build                    # Build all packages
pnpm build:tsc                # TypeScript compilation only
pnpm nx:analyze:graph         # Visualize dependency graph
```

---

## Database

### Setup
- **Type**: PostgreSQL
- **ORM**: Sequelize 6.37.5
- **Initialization**: `v6y-database/init-db.sh`
- **Migrations**: `migrations.json` (Sequelize migrations configuration)
- **Models**: Defined via `@sequelize/core` in core-logic

### Environment
- **Docker Compose**: `docker-compose.yml` + `docker-compose.base.yml`
- **Init Script**: `v6y-database/init-db.sh`
- **Template**: `env-template` files in root and app directories

---

## Figma Integration (MCP)

**MCPServer**: Figma MCP enabled via `.vscode/mcp.json`
- **URL**: https://mcp.figma.com/mcp
- **Purpose**: Design-to-code workflow for UI components
- **Usage**: Direct component code generation from Figma designs

---

## Testing Strategy

### Test Types
- **Unit Tests**: Component and utility function tests
- **Integration Tests**: Service and API integration
- **E2E Tests**: Full user workflow testing (`v6y-e2e`)

### Testing Framework
- **Framework**: Vitest 3.0.5
- **DOM Testing**: jsdom
- **React Testing**: @testing-library/react 16.1.0
- **Coverage Tool**: V8 (@vitest/coverage-v8)
- **UI Viewer**: @vitest/ui for visual test debugging

### Test Locations
```
src/__tests__/          # Test files alongside source
*.test.ts               # Test file convention
*.spec.ts               # Alternative convention
```

---

## Authentication & Security

- **Method**: Passport.js integration
- **Session Handling**: Express sessions
- **CORS**: Configured for cross-origin requests
- **Dependencies**: Locked versions (pnpm overrides for security)

---

## API Collections

**Bruno API Testing**: `v6y-bruno/`
- BFF endpoints testing
- DevOps Auditor health checks
- Dynamic Auditor workflows
- Static Auditor analysis triggers
- Environment configs for Development

---

## Containerization

- **Docker Compose**: Multi-service orchestration
- **Base Config**: `docker-compose.base.yml`
- **Services**: Application services as containers
- **Build Context**: `v6y-config/Dockerfile`

---

## Code Quality Rules

### Formatting
- **Formatter**: Prettier 3.4.2
- **Import Sorting**: @trivago/prettier-plugin-sort-imports
- **Auto-fix**: Via `pnpm format` & Git hooks

### Linting
- **Linter**: ESLint 9.18.0
- **Plugins**: 
  - @typescript-eslint
  - prettier integration
- **Cache**: Enabled for performance

### Git Hooks
- **Pre-commit**: Format + lint via lint-staged
- **Tool**: Husky 9.1.7

### Dependency Management
- **Dead Code**: Knip detection
- **Duplication**: jscpd verification
- **Lockfile**: pnpm-lock.yaml (strict pinning)

---

## Development Workflow

### Before Coding
1. Create branch from `main`
2. Check `.env-template` files for required environment variables
3. Install dependencies: `pnpm install`
4. Initialize database: `pnpm init-db` (if needed)

### During Development
1. Run relevant service: `pnpm start:frontend` or `pnpm start:bff`
2. Follow git hooks (auto-format + lint)
3. Write tests alongside code
4. Use Storybook for component development (`pnpm storybook`)

### Before Committing
1. Run all tests: `pnpm test`
2. Check linting: `pnpm lint`
3. Verify no duplication: `pnpm verify:code:duplication`
4. Check dead code: `pnpm knip`

### Before Pushing
1. Run full build: `pnpm build`
2. Verify TypeScript: `pnpm build:tsc`
3. No lint errors across all packages
4. All tests pass

---

## Dependencies & Constraints

### Critical Constraints
- **TypeScript**: Strict mode enabled
- **Node.js**: 18+ recommended
- **pnpm**: Latest stable (for workspace strict peer dependencies)
- **Nx**: Latest stable (caching and task orchestration)

### Important Dependencies
- **React**: Latest (Server Components support needed)
- **Next.js**: Latest (App Router is required)
- **Sequelize**: Latest (ORM for all database ops)
- **GraphQL**: Latest (must match across BFF and clients)

### Pnpm Overrides (Security/Compatibility)
Specific versions are pinned in `package.json` for critical security dependencies. Check `pnpm` overrides section for current versions.

---

## Common Pitfalls for AI Agents

1. **Workspace Imports**: Always prefix with `@v6y/` for inter-package imports
2. **Database Models**: Changes require migration + Sequelize sync
3. **GraphQL Updates**: Update both BFF schema and client queries
4. **Environment Variables**: Check `env-template` files before running services
5. **Port Conflicts**: Verify port availability (3000, 3001, 4000 reserved)
6. **Type Strictness**: Enable strict mode in tsconfig.json - no `any` types
7. **Asset Imports**: Use absolute imports with `@` alias when available
8. **CSS Modules**: Respect TailwindCSS for styling (not CSS Modules)
9. **Testing**: Always mock external API calls in tests
10. **Monorepo Caching**: Run `pnpm nx:clear:cache` if cache causes issues

---

## Quick Start for New Features

### Adding a New Component
```bash
# 1. Create in appropriate lib or app
# 2. Add to Storybook if frontend
# 3. Export from index.ts for consumption
# 4. Test with Vitest
# 5. Add to CHANGELOG if public API
```

### Adding a New API Endpoint
```bash
# 1. Define Sequelize model in core-logic/database
# 2. Create resolver in BFF
# 3. Add GraphQL type definition
# 4. Create React Query hook in service layer
# 5. Test with Bruno API collection
```

### Adding a New Service
```bash
# 1. Create package in v6y-apps/
# 2. Configure tsconfig, eslint.config.mjs, package.json
# 3. Define Nx targets (start, build, lint, test)
# 4. Add to docker-compose.yml if needs persistence
# 5. Document in README
```

---

## Documentation Files

- **This File**: Architecture and contribution guidelines
- **CLAUDE.md**: Claude AI-specific context and guidelines
- **README.md**: User-focused project overview
- **package.json**: Dependency versions and scripts
- **nx.json**: Monorepo configuration

---

## Code Ownership & Patterns

### Package Responsibilities
| Package | Owns | Depends On |
|---------|------|-----------|
| core-logic | Database, types, APIs | None (library) |
| ui-kit | Base components | None (library) |
| ui-kit-front | Frontend UI | ui-kit |
| bff | GraphQL API | core-logic |
| front | User dashboard | bff (via GraphQL) |
| front-bo | Admin interface | bff (via GraphQL) |
| bfb-* | Analysis engines | core-logic, bff |

---

## Integration Points

### Service Communication
- **Frontend ↔ BFF**: GraphQL via Apollo Client
- **BFF ↔ Auditors**: HTTP REST (axios)
- **Auditors ↔ Database**: Sequelize ORM
- **Auditors ↔ Analytics**: Custom metrics publishing

### Data Flow
1. User action in frontend
2. GraphQL query/mutation to BFF
3. BFF processes and triggers analysis if needed
4. Auditor services perform analysis
5. Results stored in PostgreSQL
6. Frontend polls for updates via React Query

---

## Definition of Done

A feature is complete when:
- [ ] Code passes all linters and formatters
- [ ] TypeScript strict mode compilation succeeds
- [ ] All tests pass with coverage requirements met
- [ ] No console warnings or errors
- [ ] Database migrations (if any) tested
- [ ] Documentation updated (CHANGELOG, README)
- [ ] API documentation updated (if applicable)
- [ ] Performance benchmarks checked (if critical path)
- [ ] Accessibility standards met (for UI)
- [ ] Security review completed (for auth/data)

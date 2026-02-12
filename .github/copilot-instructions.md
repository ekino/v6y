# Copilot Instructions for Vitality (v6y)

## Project Overview

**Vitality (v6y)** is a comprehensive codebase health and performance monitoring platform. It provides continuous code quality analysis, runtime monitoring, and detailed reports with actionable insights.

### Architecture

This is a **fullstack monorepo project** managed with **NX** and **pnpm workspaces**. The project follows a modular architecture with:

- **Frontend Applications** (Next.js-based)
- **Backoffice Application** (Refine + Ant Design)
- **Backend Services** (Express.js + GraphQL)
- **Shared Libraries** (Core Logic, UI Components)

---

## Tech Stack Overview

### Frontend Applications

#### **@v6y/front** (Customer-facing)
- **Framework**: Next.js 15.4.10 with React 19
- **Build Tool**: Next.js built-in
- **Styling**: Custom components via @v6y/ui-kit-front
- **State Management**: TanStack React Query 5.90.2
- **Data Fetching**: GraphQL Request 7.1.2, GraphQL WS for subscriptions
- **Forms**: react-hook-form 7.54.2
- **Internationalization**: i18next + react-i18next 15.4.0
- **Browser Client**: graphql-request with websocket support
- **Virtual Lists**: react-virtualized for performance optimization

#### **@v6y/front-bo** (Backoffice Admin Panel)
- **Framework**: Refine 4.57.5 (Next.js-based RAD framework)
- **UI Components**: Ant Design 5.23.1 + @refinedev/antd 5.45.1
- **Icons**: @ant-design/icons 6.1.0
- **State Management**: TanStack React Query 4.36.1
- **Data Fetching**: GraphQL with @refinedev/graphql 7.1.1
- **Forms**: Refine built-in form handling with Ant Design forms
- **Internationalization**: i18next + next-i18next 15.4.1
- **Advanced Features**: 
  - @refinedev/inferencer (auto-generated CRUD interfaces)
  - @refinedev/devtools (development utilities)
  - @refinedev/kbar (command palette)
  - @refinedev/simple-rest fallback support

### Backend Services

#### **@v6y/bff** (Backend for Frontend)
- **Framework**: Express.js 5.2.0 (ES modules)
- **GraphQL Server**: Apollo Server 4.11.3
- **Database ORM**: Sequelize Core 7.0.0-alpha.43
- **Authentication**: JWT + Passport.js
- **API Patterns**: RESTful + GraphQL hybrid
- **Response Caching**: apollo-server-plugin-response-cache 3.8.2
- **HTTP Client**: axios 1.12.2 with retry middleware
- **CORS**: Properly configured for frontend consumption
- **Monitoring**: express-status-monitor integration

#### **Analyzer Services** (BFB Suite)
- **@v6y/bfb-main-analyzer**: Orchestration service for analysis workflows
- **@v6y/bfb-static-auditor**: Static code analysis (AST-based)
- **@v6y/bfb-dynamic-auditor**: Runtime behavior analysis
- **@v6y/bfb-devops-auditor**: Infrastructure and deployment pipeline analysis
- All built with Express.js, TypeScript, modular architecture

### Shared Libraries

#### **@v6y/core-logic**
- **Purpose**: Core business logic, shared utilities, database models
- **Database**: Sequelize ORM with migrations
- **Authentication**: JWT token handling, Passport strategies
- **Types**: Centralized TypeScript type definitions
- **Responsibilities**:
  - Domain models and business logic
  - Database schema and migrations
  - Authentication/authorization primitives
  - Shared API utilities
  - Validation and transformation logic

#### **@v6y/ui-kit**
- **Purpose**: Shared Ant Design component library
- **Components**: Pre-configured Ant Design components with Refine integration
- **Usage**: Primarily for @v6y/front-bo (backoffice)
- **Refine Integration**: @refinedev/antd for List, Create, Edit, Show views

#### **@v6y/ui-kit-front**
- **Purpose**: Custom React components for customer frontend
- **Usage**: @v6y/front application

---

## Project Structure

### Folder Organization
```
v6y/
├── v6y-apps/                          # Application packages
│   ├── front/                         # Customer-facing Next.js app
│   ├── front-bo/                      # Refine + Ant Design backoffice
│   ├── bff/                           # Express.js GraphQL BFF
│   ├── bfb-main-analyzer/             # Main analysis orchestrator
│   ├── bfb-static-auditor/            # Static analysis service
│   ├── bfb-dynamic-auditor/           # Dynamic analysis service
│   ├── bfb-devops-auditor/            # DevOps auditor service
│   └── code-analysis-workspace/       # Code analysis tools workspace
├── v6y-libs/                          # Shared libraries
│   ├── core-logic/                    # Business logic & ORM
│   ├── ui-kit/                        # Ant Design components
│   └── ui-kit-front/                  # Custom React components
├── v6y-database/                      # Database initialization & migrations
├── v6y-bruno/                         # Bruno API testing collection
├── v6y-config/                        # Docker configuration
└── v6y-e2e/                           # E2E test suites
```

---

## Development Guidelines

### Code Quality Standards

#### **TypeScript**
- **Version**: 5.7.3
- **Strict Mode**: Enabled in all packages
- **Compilation**: Run `pnpm build:tsc` to validate all packages
- **Type Coverage**: Use `pnpm ts-coverage` to check coverage
- **Best Practices**:
  - Always define explicit return types on functions
  - Use discriminated unions for complex types
  - Leverage generics appropriately but avoid over-engineering
  - Use `readonly` for immutable data structures
  - Prefer `type` for object shapes, `interface` for class contracts

#### **Linting & Formatting**
- **Linter**: ESLint 9.18.0 with @typescript-eslint integration
- **Formatter**: Prettier 3.4.2 with import sorting plugin
- **Commands**:
  - `pnpm lint` - Check all packages
  - `pnpm lint:fix` - Auto-fix issues
  - `pnpm format` - Format code with Prettier
  - `pnpm format:check` - Validate formatting without changes
- **Pre-commit Hooks**: Husky + lint-staged automatically runs on commit
- **Configuration**: ESLint configs in each app/lib package

#### **Unused Code Detection**
- **Tool**: Knip 5.76.3
- **Commands**:
  - `pnpm knip` - Interactive unused imports/exports detection
  - `pnpm knip:ci` - CI-friendly non-interactive mode
- **Purpose**: Maintain clean dependency trees and clean exports

#### **Code Duplication**
- **Tool**: jscpd 4.0.5
- **Command**: `pnpm verify:code:duplication`
- **Configuration**: `.jscpd.json` at project root
- **Target**: Identify similar code patterns for potential refactoring

### Testing Strategy

#### **Testing Framework**: Vitest 3.0.5
- **Coverage Tool**: @vitest/coverage-v8
- **UI Dashboard**: @vitest/ui for interactive test exploration
- **Commands**:
  - `pnpm test` - Run all tests with coverage (watch=false)
  - `pnpm test:watch` - Run in watch mode during development
  - `pnpm test:ui` - Open interactive test UI dashboard

#### **Testing Coverage Requirements**
- **Minimum Coverage**: 70% for new code
- **Focus Areas**:
  - Business logic in @v6y/core-logic
  - API endpoints in BFF and analyzers
  - Complex UI components with user interactions
  - Utility functions and transformers

#### **Testing Best Practices**
- **Unit Tests**: Test in isolation with mocks/stubs
  - Use `sequelize-mock` for database ORM mocks
  - Mock external API calls with axios mocking
  - Test edge cases and error scenarios
- **Integration Tests**: Test component interactions
  - Use @testing-library/react for component testing
  - Test form submissions and validations
  - Test API integration with MSW mocks if needed
- **E2E Tests**: Critical user flows
  - Utilize @testing-library/user-event for realistic user interactions
  - Test authentication flows
  - Test data submission and retrieval workflows

#### **Testing Tools by Package**
- **Core Logic**: `vitest` with `@vitest/coverage-v8` and `chai`
- **Front**: `vitest` with React Testing Library and jsdom
- **Front-BO**: `vitest` with React Testing Library and jsdom
- **BFF**: `vitest` with `chai` and axios mocking
- **Analyzer Services**: `vitest` with `chai`

### Database Management

#### **ORM**: Sequelize Core 7.0.0-alpha.43
- **Location**: @v6y/core-logic
- **Migrations**: Sequelize CLI managed
- **Commands**:
  - `pnpm init-db` - Initialize database schema
  - `pnpm migrate-db` - Apply pending migrations
  - `pnpm migrate-undo-db` - Rollback last migration
- **Migration Files**: Located in `v6y-database/` or within @v6y/core-logic
- **Best Practices**:
  - One logical change per migration file
  - Write both up and down migrations
  - Use descriptive migration names with timestamps
  - Test migrations in development before deploying
  - Never manually alter production schema

### Package Management

- **Package Manager**: pnpm with workspaces
- **Lock File**: pnpm-lock.yaml (commit this)
- **Workspace Config**: pnpm-workspace.yaml
- **Key Commands**:
  - `pnpm install` - Install all dependencies
  - `pnpm add <pkg> -w` - Add to workspace root
  - `pnpm add <pkg> --filter @v6y/<app>` - Add to specific package
  - `pnpm install --frozen-lockfile` - CI mode

#### **Dependency Overrides**
- **Purpose**: Pin critical dependencies to specific versions
- **File**: `pnpm.overrides` in root package.json
- **Current Overrides**: form-data, axios, lodash, sha.js, tar-fs, vite
- **Rationale**: Security patches and compatibility fixes

### Monorepo with NX

#### **NX Configuration**
- **Version**: 22.0.2
- **Cache**: Enabled for build, lint, test, e2e
- **File**: nx.json at project root
- **Task Runner**: Default with caching

#### **Key Commands**
- `nx graph` - Visualize dependency graph
- `nx graph --affected` - Show affected projects for current changes
- `nx reset` - Clear NX cache (`pnpm nx:clear:cache`)
- `nx run-many --target=<task> --all` - Run task across all packages

#### **Dependency Management**
- Workspace dependencies prefixed with `@v6y/`
- Use `workspace:^` in package.json
- Always import from package root exports, not internal paths

---

## Working with Specific Apps

### Frontend (@v6y/front)

**Stack**: Next.js 15, React 19, React Query 5, GraphQL

#### **File Structure**
```
src/
├── app/                 # Next.js app router
├── components/          # React components
├── hooks/              # Custom React hooks
├── services/           # API client functions
├── types/              # TypeScript definitions
├── utils/              # Utility functions
├── public/             # Static assets
└── styles/             # CSS modules or Tailwind
```

#### **Key Development Tasks**
1. **Component Development**
   - Use functional components with hooks exclusively
   - Keep components small and focused (single responsibility)
   - Use TypeScript for all prop types
   - Implement proper error boundaries for error handling

2. **Data Fetching**
   - Use TanStack React Query hooks for server state
   - Implement proper loading, error, and success states
   - Use GraphQL endpoint from environment variables
   - Handle network errors gracefully

3. **Forms**
   - Use react-hook-form with TypeScript validation
   - Combine with zod or custom validators for schema validation
   - Display validation errors near form fields
   - Handle async validation (duplicate checks, API calls)

4. **Internationalization**
   - Use `useTranslation()` from react-i18next
   - Define keys in namespace files
   - Support browser language detection
   - Document new translation keys

#### **Running**
```bash
pnpm start:frontend       # Production build + start
pnpm -C v6y-apps/front start:dev   # Dev mode with hot reload
```

#### **Testing**
```bash
pnpm -C v6y-apps/front test        # Run tests
pnpm -C v6y-apps/front test:watch  # Watch mode
```

### Backoffice (@v6y/front-bo)

**Stack**: Refine, Next.js 15, React 19, Ant Design 5, React Query 4

#### **File Structure**
```
src/
├── app/                 # Next.js app router
├── pages/              # Refine page components
├── components/         # Ant Design + custom components
├── hooks/              # Custom hooks
├── services/           # API/GraphQL clients
├── resources/          # Refine resource definitions
├── types/              # TypeScript definitions
└── utils/              # Utility functions
```

#### **Key Concepts**

1. **Refine Framework**: RAD (Rapid Application Development)
   - Handles CRUD operations automatically
   - Resource definitions map to API endpoints
   - Create, List, Edit, Show views
   - Built-in routing, authentication, notifications

2. **Ant Design Components**
   - Use @v6y/ui-kit for pre-configured components
   - All form components from antd
   - Table component for data lists
   - Modal, Drawer for dialogs
   - Message, Notification for feedback

3. **GraphQL with Refine**
   - Use @refinedev/graphql data provider
   - Define resources with GraphQL queries/mutations
   - Automatic query/mutation generation possible with @refinedev/inferencer
   - Handle subscriptions with graphql-ws

4. **Authentication**
   - JWT-based via authProvider
   - Stored in cookies (js-cookie)
   - Token refresh on expiration
   - Logout clears cookies

#### **Running**
```bash
pnpm start:frontend:bo       # Production build + start
pnpm -C v6y-apps/front-bo start:dev   # Dev mode
```

#### **Testing**
```bash
pnpm -C v6y-apps/front-bo test        # Run tests
pnpm -C v6y-apps/front-bo test:watch  # Watch mode
```

### Backend for Frontend (@v6y/bff)

**Stack**: Express.js, Apollo Server 4, Sequelize, JWT, Passport.js

#### **File Structure**
```
src/
├── index.ts              # Express app setup
├── apollo/               # Apollo Server configuration
├── schema/               # GraphQL schema definitions
├── resolvers/            # GraphQL resolvers
├── middleware/           # Express middleware (auth, cors, etc)
├── services/             # Business logic layer
├── models/               # Sequelize models (via core-logic)
├── types/                # TypeScript type definitions
├── utils/                # Utility functions
├── config/               # Configuration
└── constants/            # Constants and enums
```

#### **Key Responsibilities**

1. **GraphQL API**
   - Define complete schema in SDL
   - Implement resolvers for queries and mutations
   - Handle subscriptions with apollo-server-express
   - Cache responses with apollo-server-plugin-response-cache

2. **Authentication & Authorization**
   - JWT tokens generated on login
   - Passport JWT strategy validates incoming tokens
   - Auth context available to all resolvers
   - Check user roles/permissions in resolvers

3. **Data Fetching & Transformation**
   - Transform database models to GraphQL types
   - Aggregate data from multiple sources if needed
   - Apply field-level filtering (privacy)
   - Handle N+1 query problems with DataLoader

4. **Error Handling**
   - Return structured GraphQL errors
   - Log errors with context
   - Don't leak sensitive information
   - Provide helpful error messages to clients

5. **Performance**
   - Use database indexes
   - Implement pagination for large datasets
   - Cache frequently accessed data
   - Monitor resolver execution time

#### **Running**
```bash
pnpm start:bff           # Production
pnpm -C v6y-apps/bff start:dev  # Development with hot reload
```

#### **Testing**
```bash
pnpm -C v6y-apps/bff test       # Run tests
pnpm -C v6y-apps/bff test:watch # Watch mode
```

#### **GraphQL Testing**
- Use `graphql-request` library for client testing
- Mock database with Sequelize mocks
- Test resolver functions directly
- Verify schema validity

### Core Logic Library (@v6y/core-logic)

**Purpose**: Shared business logic, types, database models, and utilities

#### **Structure**
```
src/
├── models/               # Sequelize models
├── migrations/           # Database migrations
├── services/             # Shared business logic
├── types/                # TypeScript type definitions
├── utils/                # Shared utilities
├── auth/                 # Authentication logic
├── validators/           # Input validation functions
├── constants/            # Shared constants
└── index.ts              # Public API exports
```

#### **Key Responsibilities**

1. **Database Models**
   - Define Sequelize models for all entities
   - Include validations and constraints at model level
   - Use proper relationships (hasMany, belongsTo, etc)
   - Add indexes for frequently queried fields

2. **Business Logic**
   - Implement domain logic independent of HTTP/GraphQL
   - Use service layer for complex operations
   - Keep functions pure when possible
   - Document side effects clearly

3. **Type Definitions**
   - Strong, exported types for all entities
   - Discriminated unions for polymorphic types
   - Branded types for IDs to prevent mixing (e.g., `UserId`)
   - Document complex type unions

4. **Authentication**
   - JWT generation and validation
   - Password hashing (bcrypt)
   - Passport strategies

5. **Migrations**
   - One logical change per migration
   - Always include rollback (down) migration
   - Test migrations before pushing
   - Document data transformations

#### **Testing**
```bash
pnpm -C v6y-libs/core-logic test       # Run tests
pnpm -C v6y-libs/core-logic test:watch # Watch mode
```

### Analyzer Services (BFB Suite)

Each analyzer service follows similar architecture:

**Stack**: Express.js, JavaScript/TypeScript, Node.js

#### **Responsibilities**

1. **Main Analyzer (@v6y/bfb-main-analyzer)**
   - Orchestrate analysis workflows
   - Aggregate results from other analyzers
   - Trigger dependent analyses
   - Store results in database

2. **Static Auditor (@v6y/bfb-static-auditor)**
   - Parse source code (AST analysis)
   - Detect code quality issues
   - Check coding standards compliance
   - Analyze dependencies and imports
   - Report security vulnerabilities in code

3. **Dynamic Auditor (@v6y/bfb-dynamic-auditor)**
   - Run application in controlled environment
   - Monitor runtime behavior
   - Detect memory leaks, performance issues
   - Test API endpoints
   - Validate output correctness

4. **DevOps Auditor (@v6y/bfb-devops-auditor)**
   - Analyze CI/CD pipelines
   - Check infrastructure configuration
   - Validate deployment readiness
   - Inspect Docker images and configurations
   - Review security practices

#### **Common Patterns**
- RESTful endpoints for triggering audits
- Background job execution (long-running analyses)
- Event-driven communication with main analyzer
- Structured result reporting (JSON)
- Error handling and retry logic

---

## Common Development Workflows

### Adding a New Feature

1. **Create branches from `main`**: `feature/description`
2. **Install dependencies**: `pnpm install`
3. **Start dev servers**: `pnpm start:dev:all` (or specific app)
4. **Implement feature**:
   - Write types first (TypeScript)
   - Implement business logic in core-logic if shared
   - Add UI components
   - Write tests alongside code
5. **Run quality checks**:
   ```bash
   pnpm lint:fix        # Fix linting issues
   pnpm format          # Format code
   pnpm build:tsc       # Validate types
   pnpm test            # Run all tests
   pnpm knip            # Check for unused code
   ```
6. **Commit**: Husky + lint-staged will auto-format staged files
7. **Create PR**: Request review from team members

### Database Schema Changes

1. **Create migration file**: Use descriptive timestamps
   ```bash
   pnpm -C v6y-libs/core-logic migrate-db
   ```
2. **Define up and down migrations**: Both directions required
3. **Test locally**: 
   ```bash
   pnpm -C v6y-libs/core-logic migrate-db
   pnpm -C v6y-libs/core-logic migrate-undo-db
   ```
4. **Update models**: Reflect schema changes in Sequelize models
5. **Create seeds** if needed for testing data
6. **Document breaking changes** if any

### Updating Dependencies

1. **Check for updates**: `pnpm outdated`
2. **Review changelogs**: Especially major versions
3. **Update in specific package**: 
   ```bash
   pnpm -C v6y-apps/<app> add <pkg>@latest
   ```
4. **Run quality checks**: Tests, linting, type checking
5. **Test integration**: Particularly for breaking changes
6. **Document in PR**: Explain why update was necessary

### Debugging

1. **Frontend**:
   - Use browser DevTools (React Developer Tools)
   - React Query DevTools in app
   - Network tab for API debugging
   - Console for runtime errors

2. **BFF/Backend**:
   - Add console.log() or use debugger statement
   - Run with `--inspect` flag for Node debugger
   - Use Apollo DevTools for GraphQL debugging
   - Check server logs for request/response bodies

3. **Database**:
   - Use Sequelize logging: set `logging: console`
   - Inspect raw SQL in development
   - Use database GUI tools if needed

---

## Code Organization Principles

### Imports & Exports

1. **Public API**: Export only intended interfaces from package root
   ```typescript
   // Correct: export from index.ts
   export * from './models/User'
   export { userService } from './services/UserService'
   
   // Avoid: importing from internal paths
   // import User from '../../../src/models/User'
   ```

2. **Import Ordering** (enforced by Prettier):
   - External dependencies first
   - Workspace dependencies (@v6y/*)
   - Relative imports last
   - Grouped and sorted alphabetically

3. **Type Imports**: Use `import type` for TypeScript-only imports
   ```typescript
   import type { User } from '@v6y/core-logic'
   import { userService } from '@v6y/core-logic'
   ```

### Component Organization

1. **Props Type Definition**
   ```typescript
   interface MyComponentProps {
     // Required props
     title: string
     onSubmit: (data: SubmissionData) => Promise<void>
     // Optional props
     className?: string
     disabled?: boolean
   }
   
   export function MyComponent({ title, onSubmit }: MyComponentProps) {
     // Implementation
   }
   ```

2. **Custom Hooks**
   - Extract logic to custom hooks
   - Use `use` prefix: `useUserData`, `usePagination`
   - Handle loading and error states
   - Return memoized values when appropriate

3. **Services/Utilities**
   - Keep pure functions in utils
   - Contain side effects in services
   - Use dependency injection for testability

### Error Handling

1. **API Errors**
   ```typescript
   try {
     const result = await graphqlClient.request(query)
   } catch (error) {
     if (error instanceof GraphQLError) {
       // Handle GraphQL-specific errors
     } else {
       // Handle network errors
     }
   }
   ```

2. **Async Operations**
   - Always handle loading state
   - Always handle error state with retry option
   - Provide user-friendly error messages
   - Log errors for debugging

3. **Validation**
   - Validate at form level (frontend)
   - Validate at resolver level (GraphQL)
   - Validate at model level (database constraints)

---

## Performance Considerations

### Frontend Optimization

1. **React Query Caching**
   - Configure appropriate stale times
   - Use background refetching strategically
   - Understand cache invalidation patterns

2. **Component Splitting**
   - Use React.memo() for expensive renders
   - Split large components into smaller ones
   - Lazy load non-critical components

3. **Bundle Size**
   - Use dynamic imports for large libraries
   - Monitor bundle with `pnpm analyze`
   - Tree-shake unused exports

4. **Network Optimization**
   - Batch GraphQL queries when possible
   - Use pagination for large lists
   - Compress images and assets

### Backend Optimization

1. **Database**
   - Add indexes to frequently queried columns
   - Use appropriate data types
   - Avoid N+1 queries (use includes/associations)
   - Connection pooling configured

2. **GraphQL**
   - Cache scalar values and frequently queried objects
   - Implement DataLoader for batch operations
   - Optimize resolver complexity
   - Return only requested fields

3. **Server**
   - Use compression middleware
   - Implement rate limiting for public endpoints
   - Monitor memory usage
   - Use connection keep-alive

---

## Security Best Practices

### Authentication & Authorization

1. **JWT Handling**
   - Store tokens securely (httpOnly cookies preferred)
   - Include expiration (short lived for access token)
   - Validate signature on every request
   - Refresh token strategy implemented

2. **Password Security**
   - Hash with bcrypt (salt rounds ≥ 10)
   - Never log passwords
   - Enforce password complexity requirements
   - Support password reset flows

3. **Authorization**
   - Check permissions in resolvers
   - Implement role-based access control (RBAC)
   - Scope database queries to user's data
   - Audit sensitive operations

### API Security

1. **Input Validation**
   - Validate all user inputs
   - Sanitize before database operations
   - Reject oversized payloads
   - Validate email/URL formats

2. **CORS Configuration**
   - Restrict to known frontend origins
   - Limit allowed methods
   - Disable credentials if not needed

3. **Data Privacy**
   - Don't expose internal IDs unnecessarily
   - Implement field-level authorization
   - Encrypt sensitive data at rest
   - Redact errors in production

---

## Deployment & DevOps

### Docker

- **Config**: v6y-config/Dockerfile
- **Compose**: docker-compose.yml for local development
- **Build**: Each app has its own build step
- **Environment**: Use .env files (never commit secrets)

### CI/CD

- **NX Caching**: Speeds up builds
- **Task Execution**: Only run affected projects
- **Quality Gates**: 
  - All tests must pass
  - Linting must pass
  - Type checking must succeed
  - No unused imports (knip check)

### Environment Configuration

- **Template Files**: `env-template` in each app
- **Development**: Load from .env.local
- **Production**: Use deployment platform secrets
- **Key Variables**:
  - API endpoints (GraphQL, REST)
  - Authentication tokens
  - Feature flags
  - Analytics keys

---

## Code Review Checklist

When reviewing PRs, verify:

- [ ] **Types**: No `any` types without justification
- [ ] **Tests**: Critical logic has test coverage
- [ ] **Linting**: `pnpm lint` passes
- [ ] **Formatting**: Code matches Prettier style
- [ ] **Documentation**: Complex logic documented
- [ ] **Performance**: No obvious regressions
- [ ] **Security**: No exposed secrets or vulnerabilities
- [ ] **Database**: Schema changes have migrations
- [ ] **Error Handling**: Proper error states handled
- [ ] **Accessibility**: Components are accessible (WCAG)
- [ ] **i18n**: Text is translatable (no hardcoded strings)

---

## Resources & References

- **NX Documentation**: https://nx.dev
- **Next.js Guide**: https://nextjs.org/docs
- **Refine Documentation**: https://refine.dev/docs
- **Ant Design Components**: https://ant.design/components/overview/
- **Apollo Server**: https://www.apollographql.com/docs/apollo-server/
- **Sequelize ORM**: https://sequelize.org
- **TanStack React Query**: https://tanstack.com/query/latest
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/
- **Vitest Documentation**: https://vitest.dev

---

## Getting Help

- **Architecture Questions**: Check NX graph (`pnpm nx:analyze:graph`)
- **API Documentation**: Refer to GraphQL introspection
- **Component Usage**: Check Storybook for front components
- **Database Schema**: Review @v6y/core-logic models
- **Team Communication**: Use project Wiki and documentation

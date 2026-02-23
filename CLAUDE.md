# CLAUDE.md - Vitality (v6y) AI Context

This file provides Claude (or similar AI agents) with condensed, actionable context for efficient code comprehension and contribution to the Vitality project.

---

## Project Snapshot

**Vitality (v6y)**: A TypeScript/React monorepo platform that continuously monitors and optimizes codebase health through static analysis, dynamic monitoring, and operational auditing.

**Tech Stack**: 
- Frontend: Next.js + React + TypeScript + TailwindCSS
- Backend: Express.js + Apollo GraphQL + Node.js
- Database: PostgreSQL + Sequelize ORM
- Monorepo: pnpm workspaces + Nx
- Testing: Vitest + jsdom + React Testing Library

---

## Core Principles

1. **Strict TypeScript**: No `any` types, strict mode enabled everywhere
2. **Monorepo Discipline**: Always use `@v6y/` workspace imports
3. **Test-First**: Write tests alongside implementation
4. **GraphQL-First APIs**: BFF uses GraphQL, not REST
5. **Component Isolation**: Reusable components in ui-kit libraries
6. **Performance**: React Query for async state, virtualization for large lists
7. **Security**: Environment variables required, dependency pinning enforced
8. **Design System**: Figma MCP integration for design-code sync

---

## Architecture Layers

```
┌─────────────────────────────────────────┐
│  Frontend Apps                          │
│  (front, front-bo)                      │
│  Next.js + React                        │
└────────────┬────────────────────────────┘
             │ GraphQL
┌────────────▼────────────────────────────┐
│  BFF (@v6y/bff)                         │
│  Express.js + Apollo GraphQL            │
└────────────┬────────────────────────────┘
             │ REST/Events
┌────────────▼────────────────────────────┐
│  Core Logic Layer                       │
│  Database Models, APIs, Types           │
│  (@v6y/core-logic)                      │
└────────────┬────────────────────────────┘
             │
┌────────────▼────────────────────────────┐
│  PostgreSQL Database                    │
│  (Sequelize ORM)                        │
└─────────────────────────────────────────┘
             ▲
             │ HTTP Requests
    ┌────────┴────────┐
    │                 │
┌───▼────┐    ┌──────▼──────┐
│Auditors│    │Analyzers     │
│(Static,│    │(Main, DevOps)│
│Dynamic,│    └──────────────┘
│DevOps) │
└────────┘
```

---

## Package-Level Guidelines

### When Working on Core Logic (`@v6y/core-logic`)
- **Purpose**: Shared database models, types, API utilities
- **Key Patterns**:
  - Sequelize models in `database/` (use `@sequelize/core`)
  - Type definitions centralized in `types/`
  - API clients in `apis/`
  - Helper functions in `utils/`
- **Rules**:
  - Changes here affect ALL packages
  - Graph impact using `pnpm nx:analyze:graph`
  - Always export from `index.ts`
  - No React dependencies

### When Working on Frontend (`@v6y/front`)
- **Entry Point**: `src/app/` (Next.js App Router)
- **Key Directories**:
  - `components/` - Reusable React components
  - `hooks/` - Custom React hooks (use React Query patterns)
  - `services/` - GraphQL client hooks (graphql-request)
  - `lib/` - Utilities (form validation, string helpers, etc.)
- **Styling**: 
  - Use Tailwind classes only (NO CSS modules)
  - Colors from design system tokens
  - Responsive via Tailwind breakpoints
- **Testing**:
  - Use `@testing-library/react`
  - Mock GraphQL queries with `graphql-request`
  - Test user interactions, not implementation
- **Performance**:
  - Use `React.memo` for expensive components
  - Lazy load routes with `next/dynamic`
  - Virtualize lists with `react-window`

### When Working on BFF (`@v6y/bff`)
- **Entry Point**: `src/index.ts` (Express + Apollo)
- **Key Patterns**:
  - Apollo resolvers in `src/resolvers/`
  - Type definitions in `src/types/schema.ts`
  - DB queries using Sequelize models
  - Cache strategies via Apollo plugins
- **Database**:
  - Use Sequelize models from `@v6y/core-logic`
  - No raw SQL (uses ORM always)
  - Transactions for multi-step operations
- **Authentication**:
  - Passport.js strategies in context
  - User info attached to GraphQL context
  - Validate permissions in resolvers

### When Working on Auditors (`bfb-*-auditor`)
- **Purpose**: Specialized analysis engines (static, dynamic, devops)
- **Pattern**:
  - Fetch codebase via HTTP from repositories
  - Initialize scheduled jobs (cron)
  - Store results in PostgreSQL via `@v6y/core-logic`
  - Trigger via BFF or scheduled tasks
- **Analysis Output**:
  - Metrics (complexity, coverage, etc.)
  - Violations/Issues
  - Dependency graphs
  - Performance data

### When Working on UI Kits (`@v6y/ui-kit*`)
- **Purpose**: Reusable component libraries
- **Rules**:
  - Base UI Kit: No Next.js-specific code
  - UI Kit Front: Can use Next.js, React features
  - All components in Storybook
  - Props validated with TypeScript (no PropTypes)
  - Export from `index.ts` in root `src/`

---

## Common Tasks & Patterns

### Task: Add a New GraphQL Query
```typescript
// 1. In BFF resolver: src/resolvers/example.resolver.ts
export const exampleResolver = {
  Query: {
    getExample: async (parent, { id }, context) => {
      const example = await Example.findByPk(id);
      return example;
    }
  }
};

// 2. In BFF schema: src/types/schema.ts
const typeDefs = gql`
  type Example {
    id: ID!
    name: String!
  }
  
  type Query {
    getExample(id: ID!): Example
  }
`;

// 3. In Frontend service: src/services/example.service.ts
export const useGetExample = (id: string) => {
  return useQuery(
    GET_EXAMPLE,
    ({ id }),
    { enabled: !!id }
  );
};

// 4. In Component
const Example = ({ id }) => {
  const { data } = useGetExample(id);
  return <div>{data?.name}</div>;
};
```

### Task: Add a New Database Model
```typescript
// 1. In core-logic: src/database/models/example.ts
import { Model, DataTypes } from '@sequelize/core';

export class Example extends Model {
  declare id: number;
  declare name: string;
}

export const initExample = (sequelize) => {
  Example.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false }
  }, { sequelize, tableName: 'examples' });
};

// 2. Export from core-logic index.ts
export { Example } from './database/models/example';

// 3. Create migration (if needed):
// npx sequelize-cli migration:create --name add-example-table

// 4. Use in BFF resolver or auditor services
```

### Task: Add Component to Storybook
```typescript
// 1. Create component: src/components/Button.tsx
export const Button: FC<ButtonProps> = ({ children, ...props }) => (
  <button {...props}>{children}</button>
);

// 2. Create story: src/components/Button.stories.tsx
import { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = { component: Button };
export default meta;

export const Primary: StoryObj<typeof Button> = {
  args: { children: 'Click me' }
};

// 3. Run Storybook: pnpm storybook
```

### Task: Add a Test
```typescript
// File: src/components/Button.test.ts
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('renders and responds to click', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const btn = screen.getByRole('button', { name: /click me/i });
    await userEvent.click(btn);
    
    expect(handleClick).toHaveBeenCalledOnce();
  });
});
```

---

## Essential Commands Reference

```bash
# Development
pnpm start:frontend          # Launch user portal (hot reload)
pnpm start:bff               # Launch GraphQL server
pnpm test                    # Run all tests (watch disabled)
pnpm lint                    # Check all packages for errors
pnpm lint:fix                # Auto-fix lint issues

# Analysis & Quality
pnpm ts-coverage             # TypeScript unused types report
pnpm knip                    # Find unused exports/imports
pnpm verify:code:duplication # Check code duplication (jscpd)
pnpm nx:analyze:graph        # Visual dependency graph

# Building
pnpm build                   # Compile all packages
pnpm build:tsc               # TypeScript check only

# Database
pnpm init-db                 # Initialize database (Docker required)

# Cleanup
pnpm nx:clear:cache          # Reset Nx cache if issues
```

---

## Critical Gotchas

1. **Import Conflicts**: 
   - `import { Button } from '@v6y/ui-kit'`
   - `import { Button } from '../../../ui-kit/src/components'`

2. **Sequelize Quirks**:
   - Always initialize models in DB setup
   - Use `findByPk()` not manual `where: { id }`
   - Relationships must be defined after model init

3. **Next.js App Router**:
   - Server components by default (performance!)
   - Client components need `'use client'` directive
   - API routes go in `app/api/` folder

4. **GraphQL Caching**:
   - Apollo caches by type + ID
   - Large list queries need custom cache policies
   - Use `refetchQueries` for mutations affecting lists

5. **Environment Variables**:
   - Frontend: Only `NEXT_PUBLIC_*` vars exposed to browser
   - Backend: All vars available, use `.env` or pass via process.env
   - Check `env-template` files before running services

6. **Port Collisions**:
   - Frontend: 3000
   - Frontend BO: 3001
   - BFF: 4000
   - Ensure none conflict with host machine

7. **Testing**:
   - Mock all external API calls
   - Use `beforeEach` to reset mocks
   - Test behaviors, not implementation details
   - Use `userEvent` not `fireEvent` for interactions

8. **TypeScript Strict Mode**:
   - Do NOT use `any` - use generics or `unknown` + type guards
   - All function parameters must be typed
   - Null checks required (`?.` operator)

---

## Code Style Expectations

### File Organization
```typescript
// 1. Imports (sorted by plugin)
import { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@v6y/ui-kit';
import { useExample } from '@/services';

// 2. Types/Interfaces
interface ExampleProps {
  id: string;
  onSelect?: (id: string) => void;
}

// 3. Component
export const Example: FC<ExampleProps> = ({ id, onSelect }) => {
  return <Button onClick={() => onSelect?.(id)}>Select</Button>;
};

// 4. Exports
export default Example;
```

### Naming Conventions
- Components: PascalCase (`Button.tsx`)
- Utilities: camelCase (`formatDate.ts`)
- Constants: UPPER_SNAKE_CASE (`MAX_RETRIES`)
- Types: PascalCase (`UserType.ts`)
- Tests: `__tests__/` folder or `.test.ts` suffix

### Comments
- Use comments for **WHY**, not WHAT (code explains itself)
- Multi-line complex logic needs brief explanation
- TODO items: `// TODO: Refactor after v2 release`
- Doc comments for public APIs: `/** Fetches user by ID */`

---

## Debugging Tips

### Common Issues & Solutions

| Issue | Root Cause | Solution |
|-------|-----------|----------|
| GraphQL query undefined | Type mismatch in resolver | Verify schema matches resolver return type |
| Component not rendering | Missing `'use client'` | Add `'use client'` directive at top of file |
| Database connection fails | `.env` not loaded | Check `.env` exists, has `DATABASE_URL` |
| Tests fail in CI but pass locally | Mock differences | Verify mocks reset in `beforeEach` |
| Hot reload not working | Module caching | Run `pnpm nx:clear:cache` and restart |
| Infinite React Query loop | Missing dependency | Add query deps to useQuery options |
| Tailwind styles not applying | Purge issue | Rebuild with `pnpm build`, check `tailwind.config.js` |

### Debug Commands
```bash
# Check what's installed
pnpm ls @v6y/core-logic

# See dependency tree
pnpm ls --depth=3

# Watch tests with UI
pnpm test:ui

# Check TypeScript errors
pnpm build:tsc --noEmit

# View Nx graph of changes
pnpm nx:analyze:graph:affected
```

---

## Performance Considerations

### Frontend Optimization
- **Code Splitting**: Use `next/dynamic` for route-based chunks
- **Image Optimization**: Use `next/image` (lazy loading, WebP)
- **List Virtualization**: Use `react-window` for 100+ items
- **Query Batching**: Combine related GraphQL queries
- **Memoization**: Memoize expensive selectors, components with memo()

### Backend Optimization
- **Database Indexing**: Ensure common filters have indexes
- **Query Optimization**: Use Sequelize includes wisely (N+1)
- **Caching**: Apollo plugins cache non-mutative queries
- **Rate Limiting**: Implement for public APIs
- **Pagination**: Always paginate list endpoints

### Monorepo Optimization
- **Nx Caching**: Enabled for build, lint, test
- **pnpm**: Strict peer deps, flat node_modules
- **Lazy Loading**: Libraries only loaded when needed
- **Incremental Testing**: Run tests only on affected packages

---

## Security Checklist

- [ ] No hardcoded secrets in code or `.env` examples
- [ ] Validate/sanitize user input (use Zod/React Hook Form)
- [ ] Authenticate GraphQL queries (check context.user)
- [ ] CORS enabled only for trusted domains
- [ ] Database passwords in `.env`, never committed
- [ ] Dependencies kept current (run `pnpm audit`)
- [ ] SQL injection prevented (use Sequelize ORM, never raw SQL)
- [ ] XSS prevented (React auto-escapes, use DOMPurify if needed)

---

## AI Assistant Role

As Claude assisting with this codebase, follow these principles:

1. **Context First**: Always check `AGENTS.md` and existing code patterns before suggesting changes
2. **Respect Architecture**: Don't suggest changes that break monorepo boundaries
3. **Test-First Mindset**: Suggest tests alongside implementations
4. **Explicit Typing**: Preference for explicit types over inference
5. **Performance Aware**: Consider React re-renders, database N+1, bundle size
6. **DRY Principle**: Suggest library reuse before new implementations
7. **Error Handling**: Always include proper error boundaries and try-catch
8. **Accessibility**: Suggest ARIA labels, semantic HTML for UI changes
9. **Documentation**: Include TypeScript doc comments for public APIs
10. **Backward Compatible**: Suggest non-breaking changes or version planning

---

## Files You Should Read First

In priority order:
1. `package.json` - Scripts, root dependencies
2. `pnpm-workspace.yaml` - Workspace structure
3. `nx.json` - Monorepo configuration
4. `v6y-apps/front/tsconfig.json` - TypeScript strictness
5. `v6y-apps/bff/src/index.ts` - Server entry point
6. `v6y-apps/front/src/app/page.tsx` - Frontend entry point
7. `v6y-libs/core-logic/src/index.ts` - Shared exports
8. `.env-template` - Required env variables

---

## Before Making Changes

1. **Understand Impact**: Will this affect other packages?
   ```bash
   pnpm nx:analyze:graph | grep affected-file
   ```

2. **Check Existing Patterns**: Similar code already exists somewhere?
   ```bash
   pnpm knip  # See what's currently used
   ```

3. **Run Tests Locally**: 
   ```bash
   pnpm test  # Pass? Then safe to change
   ```

4. **Consider Types**: Is TypeScript happy?
   ```bash
   pnpm build:tsc --noEmit
   ```

5. **Lint Check**: Does it follow project standards?
   ```bash
   pnpm lint
   ```

---

## Tips for Efficient Code Changes

- **Use Find Multi-Replace**: For monorepo-wide refactors
- **Test in Isolation**: Test individual app before testing all-packages
- **Leverage Nx Caching**: Run `pnpm nx:clear:cache` only when necessary
- **Check Git History**: Look at recent commits for pattern examples
- **Ask for Impact**: Check `pnpm nx graph` before major refactors
- **Use Storybook**: Develop UI components in isolation first
- **Hot Reload**: Use `pnpm start:frontend` for rapid iteration

---

## Success Criteria for Contributions

Code compiles with strict TypeScript  
All tests pass (`pnpm test`)  
No linting errors (`pnpm lint`)  
No type errors (`pnpm build:tsc`)  
Coverage meets project threshold  
No dead code detected (`pnpm knip`)  
No duplication introduced (`pnpm verify:code:duplication`)  
Documentation updated if public API changes  
Component storybook updated if UI changes  
GraphQL schema updated if data model changes  

---

**Last Updated**: February 2026  
**Project**: Vitality (v6y) - Codebase Health Monitoring Platform  
**Status**: Active Development

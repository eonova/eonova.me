# AI Agent Guide for eonova.me

This document provides comprehensive guidance for AI agents working with the eonova.me codebase. It serves as a knowledge base to help AI understand our project structure, conventions, and requirements.

## Project Overview

eonova.me is a personal website and portfolio built with Next.js 15+, React 19, and modern web technologies. It uses a flat source structure within a pnpm workspace.

## Project Structure for AI Navigation

```
eonova.me/
├── data/               # Content data (MDX, JSON)
├── src/                # Application source code
│   ├── app/            # Next.js App Router
│   ├── components/     # React components
│   │   ├── base/       # Reusable UI primitives (shadcn/ui style)
│   │   ├── layouts/    # Layout components (header, footer, etc.)
│   │   ├── modules/    # Feature-specific components
│   │   └── pages/      # Page-specific components
│   ├── db/             # Database layer (Drizzle ORM)
│   ├── hooks/          # Custom React hooks and Query hooks
│   ├── lib/            # Core libraries and integrations
│   ├── orpc/           # Type-safe API (oRPC)
│   └── utils/          # Utility functions
```

### Key Directories AI Should Understand

- `src/app`: Main application routes and layouts.
- `src/components/base`: Basic UI components (Buttons, Inputs, etc.). Always check here before creating new UI elements.
- `src/components/modules`: Components grouped by feature (e.g., `account`, `comment-section`, `email`, `player`).
- `src/db/schemas`: Database schema definitions.
- `src/orpc`: API routers and schemas.

## Technology Stack

### Core Technologies

- **Framework**: Next.js 15+ with App Router
- **Language**: TypeScript 5.7+ (strict mode)
- **Styling**: Tailwind CSS 4 with `cva` (Class Variance Authority)
- **Database**: PostgreSQL with Drizzle ORM
- **Cache/KV**: Redis (Upstash)
- **Authentication**: Better Auth
- **API**: oRPC (type-safe RPC)
- **Email**: React Email (Resend)
- **Testing**: Playwright (E2E), Vitest (Unit)
- **Package Manager**: pnpm (with catalogs)

### Content Management

- **Content Collections**: For structured MDX content handling.
- **MDX**: For blog posts, notes, and projects.

## Coding Conventions for AI Agents

### TypeScript Guidelines

- Always use arrow functions for components and utilities.
- Use `const` unless reassignment is absolutely necessary.
- Avoid `any` types; use `unknown` if type is truly ambiguous, but prefer specific types.
- Use `interface` or `type` aliases appropriately (prefer `type` for props).
- Strict type checking is enabled.

### Import Aliases

- `~/*` maps to `./src/*` (Primary alias for source code)
- `@/*` maps to `./*` (Root alias)

### File Naming Conventions

- Files: `kebab-case` (e.g., `use-debounce.ts`, `button.tsx`).
- Components: `PascalCase` export in `kebab-case` file.

### Component Structure

```tsx
import type { VariantProps } from 'cva'
import { cva } from 'cva'
import { cn } from '~/utils/cn'

// 1. Variants definition (if needed)
const componentVariants = cva('base-classes', {
  variants: {
    variant: {
      default: '...',
      outline: '...',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

// 2. Props definition
interface ComponentProps
  extends React.ComponentProps<'div'>,
  VariantProps<typeof componentVariants> {
  // custom props
}

// 3. Component definition
function Component({ className, variant, ...props }: ComponentProps) {
  // 4. Render
  return (
    <div className={cn(componentVariants({ variant }), className)} {...props}>
      {/* Content */}
    </div>
  )
}

// 5. Export
export { Component, componentVariants }
```

### Styling Conventions

- Use Tailwind CSS utilities.
- Use `cn()` helper from `~/utils/cn` for conditional classes and merging.
- Use `cva` for managing component variants.
- Follow mobile-first responsive design.

## Database Operations

### Schema Modifications

1. Edit schema files in `src/db/schemas/`.
2. Generate migration: `pnpm db:generate`.
3. Apply migration: `pnpm db:migrate`.
4. Update seed data in `src/db/seed.ts` if necessary.

## API Development (oRPC)

### Creating New Routes

```ts
// In apps/web/src/orpc/routers/todo.route.ts
import * as z from 'zod'
import { protectedProcedure, publicProcedure } from '../root'

// Router name convention: use verb-noun format
// e.g., get-user, create-post, update-profile
export const listTodos = publicProcedure.output(todoSchema).handler(async ({ context }) => {
  // Implementation
})

export const createTodo = protectedProcedure
  .input(createTodoInputSchema)
  .output(todoSchema)
  .handler(async ({ input, context }) => {
    // Implementation
  })
```

### Updating Main Router

```ts
// In apps/web/src/orpc/routers/index.ts

export const router = {
  todo: {
    list: listTodos,
    create: createTodo
  }
}
```

### Creating Reusable Query Hooks

```tsx
// In apps/web/src/hooks/queries/todo.query.ts
import { useQuery } from '@tanstack/react-query'
import { orpc } from '~/orpc/tanstack-query/client'

export function useTodos() {
  return useQuery(orpc.todo.listTodos.queryOptions())
}
```

## Testing Requirements

### Running Tests

```bash
# Run E2E tests
pnpm test:e2e

# Run unit tests
pnpm test:unit
```

### Writing Tests

- Unit tests: `src/tests/**/*.test.{ts,tsx}` (configured in `vitest.config.ts`).
- E2E tests: `src/e2e/**/*.spec.ts` (configured in `playwright.config.ts`).

## Development Commands

```bash
# Install dependencies
pnpm install

# Development
pnpm dev              # Run app

# Database
pnpm db:generate      # Generate migrations
pnpm db:migrate       # Apply migrations
pnpm db:seed          # Seed database
pnpm db:studio        # Open Drizzle Studio

# Quality Checks
pnpm lint             # Run ESLint
pnpm format           # Format code with Prettier
pnpm typecheck        # Run TypeScript checks
```

## Common Patterns

### Data Fetching

- **Client Components**: Use `orpc` hooks (TanStack Query wrapper).
- **Server Components**: Use direct DB calls or `orpc` caller if available/appropriate.

### Error Handling

- Use `sonner` for toast notifications (`import { toast } from 'sonner'`).
- Handle errors gracefully in `orpc` procedures.

## Getting Help

- Refer to `package.json` for available scripts and dependencies.
- Check `pnpm-workspace.yaml` for workspace configuration (if applicable).
- Search the codebase using `SearchCodebase` for existing patterns before implementing new ones.

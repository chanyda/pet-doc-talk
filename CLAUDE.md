# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PetDocTalk — AI 수의사 상담 + 반려인 커뮤니티 서비스. Monorepo with three directories:
- **`server/`** — NestJS 11 backend (port 3000)
- **`client/`** — Next.js 16 frontend (port 3001)
- **`react/`** — Legacy React directory (minimal use)

## Common Commands

### Server (`server/` directory)
```bash
yarn start:dev          # Dev server with watch mode
yarn build              # Production build
yarn test               # Run all tests (Jest)
yarn test -- auth       # Run tests matching "auth" pattern
yarn format             # Prettier format all source files
yarn migrate:dev        # Generate Prisma client + run migrations
yarn seed:dev           # Seed database
```

### Client (`client/` directory)
```bash
yarn dev                # Dev server on port 3001
yarn build              # Production build
yarn lint               # ESLint
```

### Infrastructure
```bash
docker compose up -d    # Start PostgreSQL (port 5432)
```

## Architecture

### Server — Controller → Service → Repository Pattern

Each domain module follows this strict layered architecture:

```
Controller (HTTP + Swagger decorators)
  → Service (business logic, @Transactional() for DB transactions)
    → Repository (data access via TransactionHost<TransactionalAdapterPrisma>)
      → Prisma Client (generated in generated/prisma/)
```

Module directory structure:
```
src/{domain}/
  {domain}.controller.ts
  {domain}.service.ts
  {domain}.repository.ts
  {domain}.module.ts
  {domain}.spec.ts                    # Colocated tests
  dtos/requests/                      # Input DTOs (class-validator decorated)
  dtos/responses/                     # Output DTOs
  interfaces/{domain}.interface.ts    # Entity interface (I-prefixed)
  interfaces/{domain}.repository.interface.ts  # Repository contract
  constants/                          # SELECT statements, domain constants
```

All repositories must implement an interface (`IUsersRepository`, etc.). Reference modules: `users/`, `auth/`.

### Authentication
- JWT Bearer tokens stored in httpOnly cookies
- `@Auth()` decorator combines AuthGuard + Swagger docs; `@Public()` for open endpoints
- `AuthRequest` type extends Express Request with `user` payload (userId, email)
- OAuth: Kakao login flow implemented

### Client Architecture
- State management: Zustand (`src/store/authStore.ts`)
- API client: Axios with token refresh interceptor (`src/lib/api.ts`)
- Path alias: `@/*` → `src/*`
- UI: Tailwind CSS 4 + TipTap rich text editor
- XSS protection: dompurify

### Database
- PostgreSQL 18 via Docker, Prisma ORM 7
- Schema: `server/prisma/schema.prisma`
- Key models: User, Pet (DOG/CAT), Consultation, ConsultationConversation, ConsultationMessage, Post, Comment, Category
- Cursor-based pagination (not offset-based)

## Code Style

- **Indentation**: 4 spaces
- **Quotes**: Double quotes
- **Print width**: 120 characters
- **Trailing commas**: Always
- **File names**: kebab-case (`create-user.dto.ts`)
- **Classes**: PascalCase (`UsersController`)
- **Interfaces**: I-prefix (`IUser`, `IUsersRepository`)
- **Constants**: UPPER_SNAKE_CASE (`ACCESS_TOKEN_EXP_TIME`)

### Import Order
1. External libraries (NestJS, Prisma, etc.)
2. Internal modules (`src/` path)
3. Generated files (`generated/` path)
4. Type definitions (`types/` path)

## Testing

- Framework: Jest + ts-jest
- Tests are colocated with source: `{domain}.spec.ts`
- Uses `@nestjs/testing` TestingModule with mocked dependencies
- Path aliases configured in `jest.config.ts`

## Environment Setup

Server requires `.env` (see `.env.example`): DATABASE_URL, JWT_SECRET_KEY, JWT token expiry times, KAKAO OAuth credentials, OPENAI_API_KEY.

Client requires `NEXT_PUBLIC_API_URL=http://localhost:3000`.

Config is managed via `@nestjs/config` with typed config files in `server/src/config/` and validation in `env.validation.ts`.

## New Feature Checklist (Server)

When adding a new domain module, ensure:
- Swagger decorators on all controller endpoints
- Validation decorators on DTOs
- Repository interface defined and implemented
- `@Transactional()` on service methods needing DB transactions
- `@Auth()` on endpoints requiring authentication
- Dependencies registered in module

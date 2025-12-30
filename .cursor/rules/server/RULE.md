---
globs: server/**
alwaysApply: false
---

# Pet Doc Talk Server Development Rules

This rule provides guidelines for consistent development in a NestJS-based backend project.

## Project Overview

- **Framework**: NestJS (TypeScript)
- **Database**: PostgreSQL (Prisma ORM)
- **Authentication**: JWT Bearer Token
- **API Documentation**: Swagger/OpenAPI
- **Transactions**: @nestjs-cls/transactional

## Architecture Pattern

### Layer Structure

The project follows **Controller → Service → Repository** pattern:

```
Controller (HTTP request handling)
  ↓
Service (Business logic)
  ↓
Repository (Data access)
  ↓
Prisma (Database)
```

### Module Structure

Each domain is organized as an independent module:

```
src/
  {domain}/
    {domain}.controller.ts    # HTTP endpoints
    {domain}.service.ts        # Business logic
    {domain}.repository.ts     # Data access
    {domain}.module.ts         # Module definition
    dtos/                      # DTO files
    interfaces/                # Interface definitions
```

**Reference**: See `server/src/users/` module

### Repository Pattern

All repositories must implement an interface:

**Reference**: `scripts/repository-interface-example.md`, `scripts/repository-example.md`

## Coding Style

### Formatting

- **Indentation**: 4 spaces (no tabs)
- **Quotes**: Double quotes (`"`)
- **Print Width**: 120 characters
- **Trailing Commas**: Always
- **Semicolons**: Required (TypeScript default)

**Reference**: `server/.prettierrc`

### Naming Conventions

- **File names**: kebab-case (e.g., `users.controller.ts`, `find-my-profile-response.dto.ts`)
- **Class names**: PascalCase (e.g., `UsersController`, `LoginDto`)
- **Interfaces**: `I` prefix (e.g., `IUser`, `IUsersRepository`)
- **Variables/functions**: camelCase (e.g., `findByEmail`, `createUserDto`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `ACCESS_TOKEN_EXP_TIME`)

### Import Order

1. External libraries (NestJS, Prisma, etc.)
2. Internal modules (`src/` path)
3. Generated files (`generated/` path)
4. Type definitions (`types/` path)

```typescript
import { Injectable, NotFoundException } from "@nestjs/common";
import { UsersRepository } from "./users.repository";
import { CreateUserDto } from "./dtos/create-user.dto";
import { IUser } from "./interfaces/users.interface";
import { UserSelect } from "generated/prisma/models";
```

## DTO Writing Rules

### DTO Structure

All DTOs use `class-validator` and `@nestjs/swagger` decorators:

**Reference**: `scripts/dto-example.md`

### DTO File Naming

- Request DTO: `{action}-{entity}.dto.ts` (e.g., `create-user.dto.ts`, `update-user.dto.ts`)
- Response DTO: `{action}-{entity}-response.dto.ts` (e.g., `find-my-profile-response.dto.ts`, `login-response.dto.ts`)

**Reference**: `server/src/auth/dto/`, `server/src/users/dtos/`

## Controller Writing Rules

### Basic Structure

**Reference**: `scripts/controller-example.md`

### Swagger Decorators

All endpoints must use Swagger decorators for documentation:

- `@ApiTags("{domain}")`: Controller level
- `@ApiBearerAuth()`: Required for authenticated endpoints
- `@ApiOkResponse()`: Success response
- `@ApiBadRequestResponse()`: 400 error
- `@ApiNotFoundResponse()`: 404 error
- `@ApiUnauthorizedResponse()`: 401 error

**Reference**: `server/src/auth/auth.controller.ts`, `server/src/users/users.controller.ts`

## Service Writing Rules

### Business Logic

Services handle business logic and access data through repositories:

**Reference**: `scripts/service-example.md`

### Transaction Handling

Use `@Transactional()` decorator when database transactions are needed:

```typescript
import { Transactional } from "@nestjs-cls/transactional";

@Transactional()
async create(dto: CreateDto): Promise<Entity> {
    // Code executed within transaction
    return this.repository.create(dto);
}
```

**Reference**: `server/src/auth/auth.service.ts` - `login` method

## Repository Writing Rules

### Prisma Usage

Repositories access Prisma client through `TransactionHost`:

**Reference**: `scripts/repository-example.md`

### Select Option

Select only needed fields for performance optimization:

```typescript
async findProfileByEmail(email: string): Promise<ProfileDto> {
    return this.repository.findByEmail(email, {
        id: true,
        email: true,
        name: true,
        // Select only needed fields
    });
}
```

**Reference**: `server/src/users/users.repository.ts`

## Error Handling

### NestJS Exceptions

Use standard HTTP exceptions:

- `BadRequestException`: Invalid request (400)
- `UnauthorizedException`: Authentication failed (401)
- `ForbiddenException`: No permission (403)
- `NotFoundException`: Resource not found (404)
- `ConflictException`: Duplicate/conflict (409)

**Reference**: `scripts/error-handling-example.md`

## Authentication & Security

### Auth Guard

Use `AuthGuard` for endpoints requiring authentication:

```typescript
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/auth/guards/auth.guard";

@UseGuards(AuthGuard)
@Controller("users")
export class UsersController {
  @Get("me")
  findMe(@Req() req: AuthRequest): Promise<ResponseDto> {
    // req.user contains JWT payload
    return this.service.findByEmail(req.user.email);
  }
}
```

**Reference**: `server/src/auth/guards/auth.guard.ts`, `server/src/users/users.controller.ts`

### Request Type

Use `AuthRequest` type for authenticated requests:

```typescript
import { AuthRequest } from "src/types/request.type";

findMe(@Req() req: AuthRequest): Promise<ResponseDto> {
    const userId = req.user.userId;
    const email = req.user.email;
    // ...
}
```

## Module Configuration

### Module Structure

Each module explicitly imports required dependencies:

**Reference**: `scripts/module-example.md`

**Reference**: `server/src/users/users.module.ts`, `server/src/auth/auth.module.ts`

## Prisma Usage Rules

### Schema Location

Prisma schema is defined in `prisma/schema.prisma`.

### Generated Client

Prisma client is generated in `generated/prisma/` directory:

```typescript
import { UserSelect } from "generated/prisma/models";
import { LoginFrom } from "generated/prisma/enums";
```

### Migrations

Run migrations with:

```bash
yarn migrate:dev  # Development environment
```

## Testing

### Test File Location

Test files are located in the same directory as source files:

- `{file}.spec.ts`: Unit tests
- `{file}.e2e-spec.ts`: E2E tests (optional)

**Reference**: `server/src/auth/auth.service.spec.ts`, `server/src/users/users.controller.spec.ts`

## Environment Configuration

### Config Module

Environment variables are managed through `@nestjs/config`:

```typescript
import { ConfigService } from "@nestjs/config";
import { ConfigType } from "src/types/config.type";

constructor(
    private configService: ConfigService<ConfigType, true>
) {}

const value = this.configService.getOrThrow("app.port", { infer: true });
```

**Reference**: `server/src/config/` directory

## Logging

### Logging Interceptor

All HTTP requests are logged through `LoggingInterceptor`:

- Request method, URL, status code, and response time are automatically logged.
- Error information is also logged when errors occur.

**Reference**: `server/src/common/interceptors/logging.interceptor.ts`

## API Design Rules

### RESTful API

- **GET**: Resource retrieval
- **POST**: Resource creation
- **PATCH**: Partial resource update
- **DELETE**: Resource deletion

### Response Format

- Success: HTTP Status Code + JSON response
- Failure: HTTP Status Code + Error message

**Reference**: `server/documents/API_DESIGN.md`

## Checklist

When adding new features, verify:

- [ ] Swagger decorators added to Controller
- [ ] Validation decorators added to DTOs
- [ ] Appropriate exception handling in Service
- [ ] Repository interface defined and implemented
- [ ] Required dependencies added to module
- [ ] `@Transactional()` used when transactions are needed
- [ ] `@UseGuards(AuthGuard)` added when authentication is required
- [ ] Prettier formatting applied

## Reference Files

### Code Examples

- **Controller**: `scripts/controller-example.md`
- **Service**: `scripts/service-example.md`
- **Repository**: `scripts/repository-example.md`
- **Repository Interface**: `scripts/repository-interface-example.md`
- **DTO**: `scripts/dto-example.md`
- **Module**: `scripts/module-example.md`
- **Error Handling**: `scripts/error-handling-example.md`

### Project Files

- **Architecture Examples**: `server/src/users/`, `server/src/auth/`
- **API Design**: `server/documents/API_DESIGN.md`
- **Coding Style**: `server/.prettierrc`, `server/eslint.config.mjs`
- **Prisma Schema**: `server/prisma/schema.prisma`
- **Main Configuration**: `server/src/main.ts`, `server/src/app.module.ts`

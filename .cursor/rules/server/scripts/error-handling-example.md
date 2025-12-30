# Error Handling Example

Reference: `server/src/auth/auth.service.ts`, `server/src/users/users.service.ts`

```typescript
// Example: Error handling in Service
// Reference: server/src/auth/auth.service.ts, server/src/users/users.service.ts

import { BadRequestException, NotFoundException } from "@nestjs/common";

// NotFoundException example
async findById(id: number): Promise<Entity> {
    const entity = await this.repository.findById(id);

    if (!entity) {
        throw new NotFoundException("Entity not exists.");
    }

    return entity;
}

// BadRequestException example
async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.repository.findByEmail(loginDto.email);

    if (user && user.loginFrom !== loginDto.loginFrom) {
        throw new BadRequestException(`Already signed up using ${user.loginFrom}.`);
    }

    // ... rest of logic
}

// Standard HTTP exceptions:
// - BadRequestException (400)
// - UnauthorizedException (401)
// - ForbiddenException (403)
// - NotFoundException (404)
// - ConflictException (409)
```

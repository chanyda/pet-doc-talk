# Service Example

Reference: `server/src/users/users.service.ts`, `server/src/auth/auth.service.ts`

```typescript
// Example: Service implementation
// Reference: server/src/users/users.service.ts, server/src/auth/auth.service.ts

import { Injectable, NotFoundException } from "@nestjs/common";
import { {Domain}Repository } from "./{domain}.repository";
import { Create{Domain}Dto } from "./dtos/create-{domain}.dto";
import { Update{Domain}Dto } from "./dtos/update-{domain}.dto";
import { I{Domain} } from "./interfaces/{domain}.interface";
import { FindMyProfileResponseDto } from "./dtos/find-my-profile-response.dto";
import { Transactional } from "@nestjs-cls/transactional";

@Injectable()
export class {Domain}Service {
    constructor(private readonly {domain}Repository: {Domain}Repository) {}

    create(create{Domain}Dto: Create{Domain}Dto): Promise<I{Domain}> {
        return this.{domain}Repository.create(create{Domain}Dto);
    }

    async findProfileByEmail(email: string): Promise<FindMyProfileResponseDto> {
        const entity = await this.{domain}Repository.findByEmail(email, {
            id: true,
            email: true,
            name: true,
            // Select only needed fields for performance
        });

        if (!entity) {
            throw new NotFoundException("Entity not exists.");
        }

        return entity;
    }

    @Transactional()
    async updateById(id: number, update{Domain}Dto: Update{Domain}Dto): Promise<I{Domain}> {
        const entity = await this.{domain}Repository.findById(id);

        if (!entity) {
            throw new NotFoundException("Entity not exists.");
        }

        return this.{domain}Repository.updateById(id, update{Domain}Dto);
    }
}
```

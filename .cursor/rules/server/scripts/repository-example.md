# Repository Example

Reference: `server/src/users/users.repository.ts`

```typescript
// Example: Repository implementation
// Reference: server/src/users/users.repository.ts

import { Injectable } from "@nestjs/common";
import { I{Domain}Repository } from "./interfaces/{domain}.repository.interface";
import { Create{Domain}Dto } from "./dtos/create-{domain}.dto";
import { Update{Domain}Dto } from "./dtos/update-{domain}.dto";
import { I{Domain} } from "./interfaces/{domain}.interface";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { TransactionHost } from "@nestjs-cls/transactional";
import { PrismaService } from "src/prisma/prisma.service";
import { {Model}Select } from "generated/prisma/models";

@Injectable()
export class {Domain}Repository implements I{Domain}Repository {
    constructor(
        private readonly txHost: TransactionHost<TransactionalAdapterPrisma<PrismaService>>
    ) {}

    async create(create{Domain}Dto: Create{Domain}Dto): Promise<I{Domain}>) {
        return this.txHost.tx.{model}.create({
            data: create{Domain}Dto,
        });
    }

    async findById(id: number, select?: {Model}Select): Promise<I{Domain} | null> {
        return this.txHost.tx.{model}.findUnique({
            where: { id },
            select,
        });
    }

    async findByEmail(email: string, select?: {Model}Select): Promise<I{Domain} | null> {
        return this.txHost.tx.{model}.findUnique({
            where: { email },
            select,
        });
    }

    async updateById(id: number, update{Domain}Dto: Update{Domain}Dto): Promise<I{Domain}>) {
        return this.txHost.tx.{model}.update({
            where: { id },
            data: update{Domain}Dto,
        });
    }
}
```

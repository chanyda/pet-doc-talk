# Repository Interface Example

Reference: `server/src/users/interfaces/users.repository.interface.ts`

```typescript
// Example: Repository interface
// Reference: server/src/users/interfaces/users.repository.interface.ts

import { {Model}Select } from "generated/prisma/models";
import { Create{Domain}Dto } from "../dtos/create-{domain}.dto";
import { Update{Domain}Dto } from "../dtos/update-{domain}.dto";
import { I{Domain} } from "./{domain}.interface";

export interface I{Domain}Repository {
    create(create{Domain}Dto: Create{Domain}Dto): Promise<I{Domain}>;
    findById(id: number, select?: {Model}Select): Promise<I{Domain} | null>;
    findByEmail(email: string, select?: {Model}Select): Promise<I{Domain} | null>;
    updateById(id: number, update{Domain}Dto: Update{Domain}Dto): Promise<I{Domain}>;
}
```

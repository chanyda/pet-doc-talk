# Module Example

Reference: `server/src/users/users.module.ts`, `server/src/auth/auth.module.ts`

```typescript
// Example: Module configuration
// Reference: server/src/users/users.module.ts, server/src/auth/auth.module.ts

import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { {Domain}Controller } from "./{domain}.controller";
import { {Domain}Service } from "./{domain}.service";
import { {Domain}Repository } from "./{domain}.repository";

@Module({
    imports: [PrismaModule],
    controllers: [{Domain}Controller],
    providers: [{Domain}Service, {Domain}Repository],
    exports: [{Domain}Service], // Export if used by other modules
})
export class {Domain}Module {}
```

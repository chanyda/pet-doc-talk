# Controller Example

Reference: `server/src/users/users.controller.ts`, `server/src/auth/auth.controller.ts`

```typescript
// Example: Controller implementation
// Reference: server/src/users/users.controller.ts, server/src/auth/auth.controller.ts

import { Controller, Get, HttpCode, HttpStatus, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "src/auth/guards/auth.guard";
import { AuthRequest } from "src/types/request.type";
import { {Domain}Service } from "./{domain}.service";
import { FindProfileResponseDto } from "./dtos/find-profile-response.dto";

@ApiBearerAuth()
@ApiTags("{domain}")
@UseGuards(AuthGuard)
@Controller("{domain}")
export class {Domain}Controller {
    constructor(private readonly {domain}Service: {Domain}Service) {}

    @Get("me")
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ description: "Find my profile successful.", type: FindProfileResponseDto })
    @ApiNotFoundResponse({ description: "Entity not exists." })
    findProfile(@Req() req: AuthRequest): Promise<FindProfileResponseDto> {
        return this.{domain}Service.findProfileByEmail(req.user.email);
    }
}
```

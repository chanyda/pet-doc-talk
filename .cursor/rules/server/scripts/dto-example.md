# DTO Example

Reference: `server/src/auth/dto/login.dto.ts`, `server/src/users/dtos/create-user.dto.ts`

```typescript
// Example: DTO with validation and Swagger decorators
// Reference: server/src/auth/dto/login.dto.ts, server/src/users/dtos/create-user.dto.ts

import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsString, MaxLength, MinLength, IsNotEmpty } from "class-validator";
import { LoginFrom } from "src/auth/auth.enums";

export class Create{Domain}Dto {
    @ApiProperty({ description: "User email address" })
    @IsEmail()
    email: string;

    @ApiProperty({ description: "User name", minLength: 2, maxLength: 100 })
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: "Social login route.", enum: LoginFrom })
    @IsEnum(LoginFrom)
    loginFrom: LoginFrom;
}

// Response DTO example
export class FindMyProfileResponseDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    email: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    nickname: string;

    @ApiProperty({ required: false })
    profileImageUrl?: string | null;
}
```

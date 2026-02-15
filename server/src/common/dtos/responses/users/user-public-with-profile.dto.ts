import { ApiProperty } from "@nestjs/swagger";
import { IsUrl } from "class-validator";

import { UserPublicDto } from "./user-public.dto";

export class UserPublicWithProfileDto extends UserPublicDto {
    @ApiProperty({ type: String, nullable: true })
    @IsUrl()
    profileImageUrl: string | null;
}

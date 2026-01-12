import { ApiProperty } from "@nestjs/swagger";
import { UserPublicDto } from "./user-public.dto";
import { IsUrl } from "class-validator";

export class UserPublicWithProfileDto extends UserPublicDto {
    @ApiProperty({ type: String, nullable: true })
    @IsUrl()
    profileImageUrl: string | null;
}

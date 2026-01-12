import { ApiProperty } from "@nestjs/swagger";
import { UserPublicDto } from "./user-public.dto";
import { IsUrl } from "class-validator";

export class UserPublicWithProfile extends UserPublicDto {
    @ApiProperty({ type: String })
    @IsUrl()
    profileImageUrl: string | null;
}

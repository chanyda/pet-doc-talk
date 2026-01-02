import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsJWT, IsOptional } from "class-validator";
import { UpdateProfileDto } from "./update-profile-dto";

export class UpdateUserDto extends UpdateProfileDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsJWT()
    refreshToken?: string;
}

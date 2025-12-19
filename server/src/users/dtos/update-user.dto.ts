import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsJWT, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength, MinLength } from "class-validator";

export class UpdateUserDto {
    @ApiPropertyOptional({ minLength: 1, maxLength: 20 })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(20)
    nickname?: string | null;

    @ApiPropertyOptional()
    @IsOptional()
    @IsUrl({}, { message: "profileImageUrl must be a valid URL" })
    profileImageUrl?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNotEmpty()
    @IsJWT()
    refreshToken?: string;
}

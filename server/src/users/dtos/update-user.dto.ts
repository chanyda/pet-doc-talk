import { IsJWT, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength, MinLength } from "class-validator";

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(20)
    nickname?: string | null;

    @IsOptional()
    @IsUrl({}, { message: "profileImageUrl must be a valid URL" })
    profileImageUrl?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsJWT()
    refreshToken?: string;
}

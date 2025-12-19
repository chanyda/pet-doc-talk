import { IsBoolean, IsJWT, IsNotEmpty } from "class-validator";

export class GenerateTokenResponseDto {
    @IsJWT()
    @IsNotEmpty()
    accessToken: string;

    @IsJWT()
    @IsNotEmpty()
    refreshToken: string;
}

export class LoginResponseDto extends GenerateTokenResponseDto {
    @IsBoolean()
    isNewUser: boolean;
}

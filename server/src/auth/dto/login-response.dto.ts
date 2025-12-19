import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsJWT, IsNotEmpty } from "class-validator";

export class GenerateTokenResponseDto {
    @ApiProperty()
    @IsJWT()
    @IsNotEmpty()
    accessToken: string;

    @ApiProperty()
    @IsJWT()
    @IsNotEmpty()
    refreshToken: string;
}

export class LoginResponseDto extends GenerateTokenResponseDto {
    @ApiProperty()
    @IsBoolean()
    isNewUser: boolean;
}

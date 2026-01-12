import { ApiProperty } from "@nestjs/swagger";

export class GenerateTokenResponseDto {
    @ApiProperty()
    accessToken: string;

    @ApiProperty()
    refreshToken: string;
}

export class LoginResponseDto extends GenerateTokenResponseDto {
    @ApiProperty()
    isNewUser: boolean;
}

import { ApiProperty } from "@nestjs/swagger";

export class AuthenticateResponseDto {
    @ApiProperty({ description: "The email of kakao.", type: String })
    email: string;

    @ApiProperty({ description: "The name of kakao.", type: String })
    name: string;
}

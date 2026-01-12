import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString, MaxLength, MinLength } from "class-validator";

export class UserPublicDto {
    @ApiProperty({ description: "The ID of user." })
    @IsInt()
    id: number;

    @ApiProperty({ description: "The nickname of user." })
    @IsString()
    @MinLength(1)
    @MaxLength(20)
    nickname: string;
}

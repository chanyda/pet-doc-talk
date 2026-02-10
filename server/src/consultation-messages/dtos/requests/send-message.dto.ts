import { IsString, MaxLength, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SendMessageDto {
    @ApiProperty({
        description: "Message content",
        example: "강아지가 기침을 해요",
        minLength: 1,
        maxLength: 5000,
    })
    @IsString()
    @MinLength(1)
    @MaxLength(5000)
    content: string;
}

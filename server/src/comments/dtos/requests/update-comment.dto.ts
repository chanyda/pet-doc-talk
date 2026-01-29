import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class UpdateCommentDto {
    @ApiProperty({ description: "The content of comment.", minLength: 1, maxLength: 500 })
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(500)
    content: string;
}

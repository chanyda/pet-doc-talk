import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class UpdateCommentDto {
    @ApiProperty({ description: "The content of comment.", minLength: 1 })
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    content: string;
}

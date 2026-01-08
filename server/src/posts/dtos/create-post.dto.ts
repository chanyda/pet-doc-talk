import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString, MaxLength, Min, MinLength } from "class-validator";

export class CreatePostDto {
    @ApiProperty({ description: "The category ID of post.", minimum: 1 })
    @IsInt()
    @IsNotEmpty()
    @Min(1)
    categoryId: number;

    @ApiProperty({ description: "The title of post.", minLength: 1, maxLength: 255 })
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(255)
    title: string;

    @ApiProperty({ description: "The content of post.", minLength: 1 })
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    content: string;
}

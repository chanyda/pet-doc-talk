import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsInt, IsNotEmpty, IsString, MaxLength, Min, MinLength } from "class-validator";

export class PostResponseDto {
    @ApiProperty({ description: "The ID of post." })
    @IsInt()
    id: number;

    @ApiProperty({ description: "The ID of user." })
    @IsInt()
    userId: number;

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

    @ApiProperty({ description: "The view count of post." })
    @IsInt()
    viewCount: number;

    @ApiProperty({ type: Date, description: "The creation date of post." })
    @IsDate()
    createdAt: Date;

    @ApiProperty({ type: Date, description: "The update date of post." })
    @IsDate()
    updatedAt: Date;
}

import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsInt, IsString, MaxLength, MinLength, ValidateNested } from "class-validator";

class PostUserDto {
    @ApiProperty({ description: "The ID of user." })
    @IsInt()
    id: number;

    @ApiProperty({ description: "The nickname of user." })
    @IsString()
    @MinLength(1)
    @MaxLength(20)
    nickname: string;
}

class PostCategoryDto {
    @ApiProperty({ description: "The category ID of post.", minimum: 1 })
    @IsInt()
    id: number;

    @ApiProperty({ description: "The category name of post.", minimum: 1, maximum: 100 })
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    name: string;
}

export class PostSummaryDto {
    @ApiProperty({ description: "The ID of post." })
    @IsInt()
    id: number;

    @ApiProperty({ description: "The title of post.", minLength: 1, maxLength: 255 })
    @IsString()
    @MinLength(1)
    @MaxLength(255)
    title: string;

    @ApiProperty({ description: "The view count of post." })
    @IsInt()
    viewCount: number;

    @ApiProperty({ type: Date, description: "The creation date of post." })
    @IsDate()
    createdAt: Date;

    @ApiProperty({ type: Date, description: "The update date of post." })
    @IsDate()
    updatedAt: Date;

    @ApiProperty({ description: "The user of post." })
    @ValidateNested()
    user: PostUserDto;

    @ApiProperty({ description: "The category of post." })
    @ValidateNested()
    category: PostCategoryDto;
}

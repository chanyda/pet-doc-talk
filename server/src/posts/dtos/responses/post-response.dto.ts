import { ApiProperty } from "@nestjs/swagger";

export class PostResponseDto {
    @ApiProperty({ description: "The ID of post." })
    id: number;

    @ApiProperty({ description: "The ID of user." })
    userId: number;

    @ApiProperty({ description: "The category ID of post.", minimum: 1 })
    categoryId: number;

    @ApiProperty({ description: "The title of post.", minLength: 1, maxLength: 255 })
    title: string;

    @ApiProperty({ description: "The content of post.", minLength: 1 })
    content: string;

    @ApiProperty({ description: "The view count of post." })
    viewCount: number;

    @ApiProperty({ type: Date, description: "The creation date of post." })
    createdAt: Date;

    @ApiProperty({ type: Date, description: "The update date of post." })
    updatedAt: Date;
}

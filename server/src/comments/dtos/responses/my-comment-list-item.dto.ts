import { ApiProperty } from "@nestjs/swagger";

class CommentedPostDto {
    @ApiProperty({ description: "The ID of post." })
    id: number;

    @ApiProperty({ description: "The title of post.", minLength: 1, maxLength: 255 })
    title: string;

    @ApiProperty({ description: "The comment count of post." })
    commentCount: number;
}

export class MyCommentListItemDto {
    @ApiProperty({ description: "The ID of comment." })
    id: number;

    @ApiProperty({ description: "The content of comment." })
    content: string;

    @ApiProperty({ description: "The post of comment.", type: CommentedPostDto })
    post: CommentedPostDto;

    @ApiProperty({ type: Date, description: "The creation date of comment." })
    createdAt: Date;

    @ApiProperty({ type: Date, description: "The update date of comment." })
    updatedAt: Date;
}

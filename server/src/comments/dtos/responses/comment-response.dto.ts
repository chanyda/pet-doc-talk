import { ApiProperty } from "@nestjs/swagger";

export class CommentResponseDto {
    @ApiProperty({ description: "The ID of comment." })
    id: number;

    @ApiProperty({ description: "The ID of post." })
    postId: number;

    @ApiProperty({ description: "The ID of user." })
    userId: number;

    @ApiProperty({ description: "The parent comment ID for reply.", nullable: true, required: false })
    parentId: number | null;

    @ApiProperty({ description: "The user ID to mention in reply.", nullable: true, required: false })
    mentionUserId: number | null;

    @ApiProperty({ description: "The content of comment." })
    content: string;

    @ApiProperty({ type: Date, description: "The creation date of comment." })
    createdAt: Date;

    @ApiProperty({ type: Date, description: "The update date of comment." })
    updatedAt: Date;

    @ApiProperty({ description: "The delete date of comment.", nullable: true, required: false })
    deletedAt: Date | null;
}

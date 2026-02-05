import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { CommentReplyItemDto } from "./comment-reply-item.dto";

export class CommentReplyListResponseDto {
    @ApiProperty({
        description: "The list of comments (only parent comments).",
        type: [CommentReplyItemDto],
    })
    replies: CommentReplyItemDto[];

    @ApiProperty({ description: "Total number of reply comments." })
    totalReplyCount: number;

    @ApiPropertyOptional({
        description: "The cursor for the next page.",
        nullable: true,
        type: Number,
    })
    nextCursor: number | null;
}

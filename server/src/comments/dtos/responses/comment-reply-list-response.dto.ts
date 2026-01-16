import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { CommentReplyListItemDto } from "./comment-reply-list-item.dto";

export class CommentReplyListResponseDto {
    @ApiProperty({
        description: "The list of comments (only parent comments).",
        type: [CommentReplyListItemDto],
    })
    replies: CommentReplyListItemDto[];

    @ApiPropertyOptional({
        description: "The cursor for the next page.",
        nullable: true,
        type: Number,
    })
    nextCursor: number | null;
}

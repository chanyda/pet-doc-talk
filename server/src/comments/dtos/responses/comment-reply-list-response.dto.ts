import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { CommentReplyItemDto } from "./comment-reply-item.dto";

export class CommentReplyListResponseDto {
    @ApiProperty({
        description: "The list of comments (only parent comments).",
        type: [CommentReplyItemDto],
    })
    replies: CommentReplyItemDto[];

    @ApiPropertyOptional({
        description: "The cursor for the next page.",
        nullable: true,
        type: Number,
    })
    nextCursor: number | null;
}

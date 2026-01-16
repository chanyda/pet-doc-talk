import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { CommentListItemDto } from "./comment-list-item.dto";

export class CommentListResponseDto {
    @ApiProperty({
        description: "The list of comments (only parent comments).",
        type: [CommentListItemDto],
    })
    comments: CommentListItemDto[];

    @ApiPropertyOptional({
        description: "The cursor for the next page.",
        nullable: true,
        type: Number,
    })
    nextCursor: number | null;
}

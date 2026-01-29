import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { CommentItemDto } from "./comment-item.dto";

export class CommentListResponseDto {
    @ApiProperty({
        description: "The list of comments (only parent comments).",
        type: [CommentItemDto],
    })
    comments: CommentItemDto[];

    @ApiProperty({ description: "Total number of parent comments." })
    totalParentCommentCount: number;

    @ApiProperty({ description: "Total number of comments." })
    totalCommentCount: number;

    @ApiPropertyOptional({
        description: "The cursor for the next page.",
        nullable: true,
        type: Number,
    })
    nextCursor: number | null;
}

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { PostSummaryDto } from "./post-summary-dto";

export class PostListResponseDto {
    @ApiProperty({ type: [PostSummaryDto] })
    posts: Array<PostSummaryDto>;

    @ApiPropertyOptional({ type: Number, nullable: true })
    nextCursor: number | null;
}

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { PostSummaryDto } from "./post-summary-dto";

export class PostListResponseDto {
    @ApiProperty({ type: [PostSummaryDto] })
    posts: Array<PostSummaryDto>;

    @ApiPropertyOptional({ type: Number, nullable: true })
    nextCursor: number | null;

    @ApiProperty({ description: "Total number of posts written by the user" })
    totalPostCount: number;
}

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsInt, ValidateIf } from "class-validator";
import { PostSummaryDto } from "./post-summary-dto";

export class PostListResponseDto {
    @ApiProperty({ type: PostSummaryDto })
    @IsArray()
    posts: Array<PostSummaryDto>;

    @ApiPropertyOptional({ type: Number, nullable: true })
    @ValidateIf(({ nextCursor }) => nextCursor !== null)
    @IsInt()
    nextCursor: number | null;
}

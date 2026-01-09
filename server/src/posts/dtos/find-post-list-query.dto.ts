import { PaginationQueryDto } from "src/common/dtos/pagination-query.dto";
import { PostOrderBy } from "../posts.enums";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsInt, IsOptional, IsString, MaxLength, Min } from "class-validator";

export class FindPostListQueryDto extends PaginationQueryDto {
    @ApiPropertyOptional({ description: "The category ID of post.", minimum: 1 })
    @IsInt()
    @IsOptional()
    @Min(1)
    categoryId?: number;

    // TODO: 추후 작성자 닉네임으로 조회할 수 있도록
    @ApiPropertyOptional({ description: "검색어 (제목, 내용)", example: "강아지", maximum: 100 })
    @IsString()
    @IsOptional()
    @MaxLength(100)
    keyword?: string;

    @ApiPropertyOptional({
        description: "정렬 기준 (createdAt: 최신순, likeCount: 인기순, viewCount: 조회순)",
        enum: PostOrderBy,
        default: PostOrderBy.CREATED_AT,
    })
    @IsEnum(PostOrderBy)
    @IsOptional()
    orderBy: PostOrderBy = PostOrderBy.CREATED_AT;
}

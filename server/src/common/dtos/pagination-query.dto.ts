import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsOptional, Max, Min } from "class-validator";

export class PaginationQueryDto {
    @ApiPropertyOptional({ description: "cursor 값", example: 1 })
    @IsOptional()
    @IsInt()
    cursor?: number;

    @ApiPropertyOptional({ description: "페이지 크기", example: 10, default: 10, minimum: 1, maximum: 30 })
    @IsOptional()
    @IsInt()
    @Min(1)
    // 과도한 요청을 방지하기 위해 pageSize의 최대값을 30으로 설정
    @Max(30)
    pageSize: number = 10;
}

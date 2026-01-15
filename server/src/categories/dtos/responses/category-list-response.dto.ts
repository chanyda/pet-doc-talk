import { ApiProperty } from "@nestjs/swagger";

export class CategoryListResponseDto {
    @ApiProperty({ description: "The ID of category." })
    id: number;

    @ApiProperty({ description: "The name of category." })
    name: string;
}

import { ApiProperty } from "@nestjs/swagger";

export class PostCategoryDto {
    @ApiProperty({ description: "The category ID of post.", minimum: 1 })
    id: number;

    @ApiProperty({ description: "The category name of post.", minimum: 1, maximum: 100 })
    name: string;
}

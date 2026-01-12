import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString, MaxLength, MinLength } from "class-validator";

export class PostCategoryDto {
    @ApiProperty({ description: "The category ID of post.", minimum: 1 })
    @IsInt()
    id: number;

    @ApiProperty({ description: "The category name of post.", minimum: 1, maximum: 100 })
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    name: string;
}

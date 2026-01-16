import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class CreateCommentDto {
    @ApiProperty({ description: "The content of comment.", minLength: 1 })
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    content: string;

    @ApiPropertyOptional({ description: "The parent comment ID for reply.", nullable: true })
    @IsInt()
    @IsOptional()
    parentId?: number | null;

    @ApiPropertyOptional({ description: "The user ID to mention in reply.", nullable: true })
    @IsInt()
    @IsOptional()
    mentionUserId?: number | null;
}

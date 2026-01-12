import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsInt, IsString, MaxLength, MinLength, ValidateNested } from "class-validator";
import { PostCategoryDto } from "./categories/post-category.dto";
import { UserPublicDto } from "src/common/dtos/users/user-public.dto";

export class PostSummaryDto {
    @ApiProperty({ description: "The ID of post." })
    @IsInt()
    id: number;

    @ApiProperty({ description: "The title of post.", minLength: 1, maxLength: 255 })
    @IsString()
    @MinLength(1)
    @MaxLength(255)
    title: string;

    @ApiProperty({ description: "The view count of post." })
    @IsInt()
    viewCount: number;

    // @ApiProperty({ description: "The like count of post." })
    // @IsInt()
    // likeCount: number;

    // @ApiProperty({ description: "The comment count of post." })
    // @IsInt()
    // commentCount: number;

    // @ApiProperty({ description: "Whether the current user liked this post." })
    // @IsBoolean()
    // isLiked: boolean;

    @ApiProperty({ type: Date, description: "The creation date of post." })
    @IsDate()
    createdAt: Date;

    @ApiProperty({ type: Date, description: "The update date of post." })
    @IsDate()
    updatedAt: Date;

    @ApiProperty({ description: "The user of post." })
    @ValidateNested()
    user: UserPublicDto;

    @ApiProperty({ description: "The category of post." })
    @ValidateNested()
    category: PostCategoryDto;
}

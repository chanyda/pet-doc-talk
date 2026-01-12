import { ApiProperty } from "@nestjs/swagger";
import { PostCategoryDto } from "./categories/post-category.dto";
import { UserPublicDto } from "src/common/dtos/responses/users/user-public.dto";

export class PostSummaryDto {
    @ApiProperty({ description: "The ID of post." })
    id: number;

    @ApiProperty({ description: "The title of post.", minLength: 1, maxLength: 255 })
    title: string;

    @ApiProperty({ description: "The view count of post." })
    viewCount: number;

    // @ApiProperty({ description: "The like count of post." })
    // likeCount: number;

    // @ApiProperty({ description: "The comment count of post." })
    // commentCount: number;

    // @ApiProperty({ description: "Whether the current user liked this post." })
    // isLiked: boolean;

    @ApiProperty({ type: Date, description: "The creation date of post." })
    createdAt: Date;

    @ApiProperty({ type: Date, description: "The update date of post." })
    updatedAt: Date;

    @ApiProperty({ description: "The user of post." })
    user: UserPublicDto;

    @ApiProperty({ description: "The category of post." })
    category: PostCategoryDto;
}

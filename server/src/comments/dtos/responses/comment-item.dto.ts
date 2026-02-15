import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import { UserPublicDto } from "@/common/dtos/responses/users/user-public.dto";
import { UserPublicWithProfileDto } from "@/common/dtos/responses/users/user-public-with-profile.dto";

export class CommentItemDto {
    @ApiProperty({ description: "The ID of comment." })
    id: number;

    @ApiProperty({ description: "The content of comment." })
    content: string;

    @ApiPropertyOptional({
        description: "The parent comment ID for reply.",
        type: Number,
        nullable: true,
    })
    parentId: number | null;

    @ApiProperty({ description: "The user of comment.", type: UserPublicWithProfileDto })
    user: UserPublicWithProfileDto;

    @ApiProperty({ description: "The mention user of comments.", type: UserPublicDto, nullable: true })
    mentionUser: UserPublicDto | null;

    @ApiProperty({ description: "The reply count of comment." })
    replyCount: number;

    // TODO: 좋아요 기능 추가 시 해당 컬럼들 필요
    // @ApiProperty({ description: "The like count of comment.", default: 0 })
    // likeCount: number;

    // @ApiProperty({ description: "Whether the current user liked this comment.", default: false })
    // isLiked: boolean;

    @ApiProperty({ type: Date, description: "The creation date of comment." })
    createdAt: Date;

    @ApiProperty({ type: Date, description: "The update date of comment." })
    updatedAt: Date;

    @ApiPropertyOptional({
        description: "The delete date of comment.",
        nullable: true,
    })
    deletedAt: Date | null;
}

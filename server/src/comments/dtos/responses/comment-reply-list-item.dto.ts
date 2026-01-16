import { UserPublicDto } from "src/common/dtos/responses/users/user-public.dto";
import { ApiProperty, OmitType } from "@nestjs/swagger";
import { CommentListItemDto } from "./comment-list-item.dto";

export class CommentReplyListItemDto extends OmitType(CommentListItemDto, ["replyCount"] as const) {
    @ApiProperty({ description: "The mention user of comments.", type: UserPublicDto, nullable: true })
    mentionUser: UserPublicDto | null;
}

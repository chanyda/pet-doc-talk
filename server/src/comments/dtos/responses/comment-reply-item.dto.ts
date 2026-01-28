import { CommentItemDto } from "./comment-item.dto";

export class CommentReplyItemDto extends OmitType(CommentItemDto, ["replyCount"] as const) {
    @ApiProperty({ description: "The mention user of comments.", type: UserPublicDto, nullable: true })
    mentionUser: UserPublicDto | null;
}

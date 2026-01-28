import { OmitType } from "@nestjs/swagger";
import { CommentItemDto } from "./comment-item.dto";

export class CommentReplyItemDto extends OmitType(CommentItemDto, ["replyCount"] as const) {}

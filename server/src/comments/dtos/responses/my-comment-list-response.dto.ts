import { ApiProperty, OmitType } from "@nestjs/swagger";
import { CommentListResponseDto } from "./comment-list-response.dto";
import { MyCommentListItemDto } from "./my-comment-list-item.dto";

export class MyCommentListResponseDto extends OmitType(CommentListResponseDto, ["comments"] as const) {
    @ApiProperty({ type: [MyCommentListItemDto] })
    comments: Array<MyCommentListItemDto>;

    @ApiProperty({ description: "Total number of comments written by the user" })
    totalCommentCount: number;
}

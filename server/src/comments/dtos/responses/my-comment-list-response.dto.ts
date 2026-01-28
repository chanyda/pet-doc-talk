import { ApiProperty, OmitType } from "@nestjs/swagger";
import { CommentListResponseDto } from "./comment-list-response.dto";
import { MyCommentItemDto } from "./my-comment-item.dto";

export class MyCommentListResponseDto extends OmitType(CommentListResponseDto, ["comments"] as const) {
    @ApiProperty({ type: [MyCommentItemDto] })
    comments: Array<MyCommentItemDto>;

    @ApiProperty({ description: "Total number of comments written by the user" })
    totalCommentCount: number;
}

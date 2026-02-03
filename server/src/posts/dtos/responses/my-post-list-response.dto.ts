import { ApiProperty, OmitType } from "@nestjs/swagger";
import { PostListResponseDto } from "./post-list-response.dto";
import { MyPostSummaryDto } from "./my-post-summary-dto";

export class MyPostListResponseDto extends OmitType(PostListResponseDto, ["posts"] as const) {
    @ApiProperty({ type: [MyPostSummaryDto] })
    posts: Array<MyPostSummaryDto>;
}

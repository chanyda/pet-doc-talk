import { ApiProperty, OmitType } from "@nestjs/swagger";
import { UserPublicWithProfileDto } from "src/common/dtos/responses/users/user-public-with-profile.dto";
import { PostSummaryDto } from "./post-summary-dto";

// 게시글 상세조회에선 작성자의 profile 이미지도 보여줘야하므로 user를 재정의하여 타입을 UserPublicWithProfileDto로 지정
export class PostDetailResponseDto extends OmitType(PostSummaryDto, ["user"]) {
    @ApiProperty({ description: "The content of post.", minLength: 1, type: String })
    content: string;

    @ApiProperty({ description: "The user of post." })
    user: UserPublicWithProfileDto;
}

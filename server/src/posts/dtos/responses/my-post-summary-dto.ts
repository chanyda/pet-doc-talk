import { OmitType } from "@nestjs/swagger";
import { PostSummaryDto } from "./post-summary-dto";

export class MyPostSummaryDto extends OmitType(PostSummaryDto, ["user"] as const) {}

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import { MyConsultationItemDto } from "./my-consultation-item.dto";

export class MyConsultationListResponseDto {
    @ApiProperty({ type: [MyConsultationItemDto] })
    consultations: Array<MyConsultationItemDto>;

    @ApiProperty({ description: "Total number of consultations by the user." })
    totalConsultationCount: number;

    @ApiPropertyOptional({ type: Number, nullable: true })
    nextCursor: number | null;
}

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { PetSummaryDto } from "./pet-summary.dto";

export class PetListResponseDto {
    @ApiProperty({ type: [PetSummaryDto] })
    pets: Array<PetSummaryDto>;

    @ApiPropertyOptional({ type: Number, nullable: true })
    nextCursor: number | null;
}

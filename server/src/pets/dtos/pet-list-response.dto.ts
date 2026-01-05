import { IsArray, IsInt, ValidateIf } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { PetSummaryDto } from "./pet-summary.dto";

export class PetListResponseDto {
    @ApiProperty({ type: PetSummaryDto })
    @IsArray()
    pets: Array<PetSummaryDto>;

    @ApiPropertyOptional({ type: Number, nullable: true })
    @ValidateIf(({ nextCursor }) => nextCursor !== null)
    @IsInt()
    nextCursor: number | null;
}

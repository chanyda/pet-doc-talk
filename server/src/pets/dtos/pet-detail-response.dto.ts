import { ApiPropertyOptional } from "@nestjs/swagger";
import { Decimal } from "@prisma/client/runtime/index-browser";
import { IsBoolean, IsDate, IsNumber, IsOptional } from "class-validator";
import { PetSummaryDto } from "./pet-summary.dto";

export class PetDetailResponseDto extends PetSummaryDto {
    @ApiPropertyOptional({ description: "The weight of pet in kg.", example: 5.85 })
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    weight?: Decimal | null;

    @ApiPropertyOptional({ type: Date, description: "The age of pet in months." })
    @IsOptional()
    @IsDate()
    birthDate?: Date | null;

    @ApiPropertyOptional({ type: Boolean, description: "Whether the pet is neutered." })
    @IsOptional()
    @IsBoolean()
    isNeutered?: boolean | null;
}

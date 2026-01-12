import { ApiPropertyOptional } from "@nestjs/swagger";
import { Decimal } from "@prisma/client/runtime/index-browser";
import { PetSummaryDto } from "./pet-summary.dto";

export class PetDetailResponseDto extends PetSummaryDto {
    @ApiPropertyOptional({ description: "The weight of pet in kg.", example: 5.85, nullable: true })
    weight?: Decimal | null;

    @ApiPropertyOptional({ type: Date, description: "The age of pet in months.", nullable: true })
    birthDate?: Date | null;

    @ApiPropertyOptional({ type: Boolean, description: "Whether the pet is neutered.", nullable: true })
    isNeutered?: boolean | null;
}

import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsPositive } from "class-validator";

export class CreateConsultationDto {
    @ApiProperty({ description: "The pet ID for consultation." })
    @IsPositive()
    @IsNotEmpty()
    petId: number;
}

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { PetType } from "generated/prisma/enums";

class ConsultationPetDto {
    @ApiProperty({ description: "The ID of pet." })
    id: number;

    @ApiProperty({ description: "The name of pet.", minLength: 1, maxLength: 100 })
    name: string;

    @ApiProperty({ description: "The type of pet.", enum: PetType })
    type: PetType;

    @ApiPropertyOptional({ type: String, description: "The image URL of pet.", maxLength: 500, nullable: true })
    imageUrl?: string | null;
}

export class MyConsultationItemDto {
    @ApiProperty({ description: "The ID of consultation." })
    id: number;

    @ApiProperty({ description: "The ID of user." })
    userId: number;

    @ApiProperty({ description: "The pet of consultation.", type: ConsultationPetDto })
    pet: ConsultationPetDto;

    @ApiProperty({ description: "The title of consultation.", nullable: true, required: false })
    title: string | null;

    @ApiProperty({ type: Date, description: "The creation date of consultation." })
    createdAt: Date;
}

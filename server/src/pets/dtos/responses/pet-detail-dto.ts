import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { PetGender } from "generated/prisma/enums";

export class PetDetailDto {
    @ApiProperty()
    id: number;

    @ApiProperty({ description: "The name of pet.", minLength: 1, maxLength: 100 })
    name: string;

    @ApiProperty({ description: "The gender of pet.", enum: PetGender })
    gender: PetGender;

    // TODO: breed 정해지면 minLength 수정필요
    @ApiProperty({ type: String, description: "The breed of pet.", minLength: 2, maxLength: 100 })
    breed: string;

    @ApiPropertyOptional({ type: String, description: "The image URL of pet.", maxLength: 500, nullable: true })
    imageUrl?: string | null;

    @ApiPropertyOptional({ description: "The weight of pet in kg.", example: 5.85, nullable: true })
    weight?: number | null;

    @ApiPropertyOptional({ type: Date, description: "The age of pet in months.", nullable: true })
    birthDate?: Date | null;

    @ApiPropertyOptional({ type: Boolean, description: "Whether the pet is neutered.", nullable: true })
    isNeutered?: boolean | null;
}

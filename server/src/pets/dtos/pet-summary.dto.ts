import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength, MinLength } from "class-validator";
import { PetGender, PetType } from "generated/prisma/enums";

export class PetSummaryDto {
    @ApiProperty()
    @IsInt()
    id: number;

    @ApiProperty({ description: "The name of pet.", minLength: 1, maxLength: 100 })
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: "The type of pet.", enum: PetType })
    @IsEnum(PetType)
    @IsNotEmpty()
    type: PetType;

    @ApiProperty({ description: "The gender of pet.", enum: PetGender })
    @IsEnum(PetGender)
    @IsNotEmpty()
    gender: PetGender;

    @ApiProperty({ type: String, description: "The breed of pet.", minLength: 2, maxLength: 100 })
    @IsString()
    @MinLength(2) // TODO: breed 정해지면 minLength 수정필요
    @MaxLength(100)
    @IsNotEmpty()
    breed: string;

    @ApiPropertyOptional({ type: String, description: "The image URL of pet.", maxLength: 500 })
    @IsOptional()
    @IsUrl()
    imageUrl?: string | null;
}

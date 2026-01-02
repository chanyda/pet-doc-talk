import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Decimal } from "@prisma/client/runtime/index-browser";
import {
    IsBoolean,
    IsDateString,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUrl,
    MaxLength,
    Min,
    MinLength,
} from "class-validator";
import { PetGender, PetType } from "generated/prisma/enums";

export class CreatePetDto {
    @ApiProperty({ description: "The name of pet.", minLength: 1, maxLength: 100 })
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(100)
    name: string;

    @ApiProperty({ description: "The type of pet.", enum: PetType })
    @IsEnum(PetType)
    @IsNotEmpty()
    type: PetType;

    @ApiProperty({ description: "The gender of pet.", enum: PetGender })
    @IsEnum(PetGender)
    @IsNotEmpty()
    gender: PetGender;

    @ApiProperty({ description: "The breed of pet.", maxLength: 100 })
    @IsString()
    @MaxLength(100)
    @IsNotEmpty()
    breed: string;

    @ApiPropertyOptional({ description: "The weight of pet in kg.", minimum: 0, example: 5.85 })
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    weight?: Decimal;

    @ApiPropertyOptional({ description: "The birth date of pet.", example: "2025-01-01T00:00:00Z" })
    @IsOptional()
    @IsDateString()
    birthDate?: string;

    @ApiPropertyOptional({ description: "Whether the pet is neutered." })
    @IsOptional()
    @IsBoolean()
    isNeutered?: boolean;

    @ApiPropertyOptional({ description: "The image URL of pet.", maxLength: 500 })
    @IsOptional()
    @IsUrl({}, { message: "imageUrl must be a valid URL" })
    @MaxLength(500)
    imageUrl?: string;
}

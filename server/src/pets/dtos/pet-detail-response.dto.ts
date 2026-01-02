import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Decimal } from "@prisma/client/runtime/index-browser";
import {
    IsBoolean,
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUrl,
    MaxLength,
    MinLength,
} from "class-validator";
import { PetGender, PetType } from "generated/prisma/enums";

export class PetDetailResponseDto {
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

    @ApiPropertyOptional({ description: "The gender of pet.", enum: PetGender })
    @IsOptional()
    @IsEnum(PetGender)
    gender?: PetGender | null;

    @ApiPropertyOptional({ type: String, description: "The breed of pet.", maxLength: 100 })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    @IsNotEmpty()
    breed: string;

    @ApiPropertyOptional({ description: "The weight of pet in kg.", example: 5.85 })
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    weight?: Decimal | null;

    @ApiPropertyOptional({ type: Date, description: "The age of pet in months." })
    @IsOptional()
    @IsInt()
    birthDate?: Date | null;

    @ApiPropertyOptional({ type: Boolean, description: "Whether the pet is neutered." })
    @IsOptional()
    @IsBoolean()
    isNeutered?: boolean | null;

    @ApiPropertyOptional({ type: String, description: "The image URL of pet.", maxLength: 500 })
    @IsOptional()
    @IsUrl()
    imageUrl?: string | null;
}

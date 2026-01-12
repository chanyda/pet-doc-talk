import { ApiPropertyOptional } from "@nestjs/swagger";
import { Decimal } from "@prisma/client/runtime/index-browser";
import { Transform } from "class-transformer";
import {
    IsBoolean,
    IsDateString,
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
    IsUrl,
    MaxLength,
    Min,
    MinLength,
} from "class-validator";
import { PetGender } from "generated/prisma/enums";

export class UpdatePetDto {
    @ApiPropertyOptional({ description: "The name of pet.", minLength: 1, maxLength: 100 })
    @IsOptional()
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    name?: string;

    @ApiPropertyOptional({ description: "The gender of pet.", enum: PetGender })
    @IsOptional()
    @IsEnum(PetGender)
    gender?: PetGender;

    @ApiPropertyOptional({ description: "The breed of pet.", minLength: 2, maxLength: 100 })
    @IsOptional()
    @IsString()
    @MinLength(2) // TODO: breed 정해지면 minLength 수정필요
    @MaxLength(100)
    breed?: string;

    @ApiPropertyOptional({ description: "The weight of pet in kg.", minimum: 0, example: 5.85 })
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    weight?: Decimal;

    @ApiPropertyOptional({ description: "The birth date of pet.", example: "2025-01-01T00:00:00Z" })
    @IsOptional()
    @Transform(({ value }: { value: string }) => (value === "" ? null : value))
    @IsDateString()
    birthDate?: string | null;

    @ApiPropertyOptional({ description: "Whether the pet is neutered." })
    @IsOptional()
    @IsBoolean()
    isNeutered?: boolean | null;

    @ApiPropertyOptional({ description: "The image URL of pet.", maxLength: 500 })
    @IsOptional()
    @Transform(({ value }: { value: string }) => (value === "" ? null : value))
    @IsUrl({}, { message: "imageUrl must be a valid URL" })
    @MaxLength(500)
    imageUrl?: string | null;
}

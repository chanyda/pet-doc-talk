import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsInt, IsOptional, IsString, IsUrl, MaxLength, MinLength } from "class-validator";

export class FindProfileResponseDto {
    @ApiProperty()
    @IsInt()
    id: number;

    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty({ description: "The name of user.", minLength: 2, maxLength: 100 })
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    name: string;

    @ApiProperty({ type: String, minLength: 1, maxLength: 20 })
    @IsString()
    @MinLength(1)
    @MaxLength(20)
    nickname: string;

    @ApiPropertyOptional({ type: String })
    @IsUrl()
    @IsOptional()
    profileImageUrl?: string | null;
}

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class KakaoLoginQueryDto {
    @ApiProperty({ description: "Authorization code required for token request" })
    @IsString()
    code: string;

    @ApiPropertyOptional({ description: "Error code returned when authentication fails" })
    @IsString()
    @IsOptional()
    error?: string;

    @ApiPropertyOptional({ description: "Error message returned when authentication fails" })
    @IsString()
    @IsOptional()
    error_description?: string;

    @ApiPropertyOptional({ description: "Same value as the state value passed in the request" })
    @IsString()
    @IsOptional()
    state?: string;
}

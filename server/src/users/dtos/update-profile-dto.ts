import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, IsUrl, MaxLength, MinLength } from "class-validator";
import { Transform } from "class-transformer";

export class UpdateProfileDto {
    @ApiPropertyOptional({ minLength: 1, maxLength: 20 })
    @IsOptional()
    @IsString()
    @MinLength(1)
    @MaxLength(20)
    nickname?: string;

    @ApiPropertyOptional({ type: String })
    @IsOptional()
    @IsUrl({}, { message: "profileImageUrl must be a valid URL" })
    // 빈 값이 들어온 경우 null로 업데이트 되도록 함
    @Transform(({ value }: { value: string }) => (value === "" ? null : value))
    profileImageUrl?: string | null;
}

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class FindProfileResponseDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    email: string;

    @ApiProperty({ description: "The name of user.", minLength: 2, maxLength: 100 })
    name: string;

    @ApiProperty({ type: String, minLength: 1, maxLength: 20 })
    nickname: string;

    @ApiPropertyOptional({ type: String, nullable: true })
    profileImageUrl?: string | null;
}

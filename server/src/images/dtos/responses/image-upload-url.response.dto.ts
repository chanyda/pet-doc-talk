import { ApiProperty } from "@nestjs/swagger";

export class ImageUploadUrlResponseDto {
    @ApiProperty({ description: "Presigned URL for direct upload to S3." })
    uploadUrl: string;

    @ApiProperty({ description: "Public S3 URL to store in the database after upload is complete." })
    imageUrl: string;
}

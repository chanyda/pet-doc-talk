import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsMimeType, IsString, Matches, MaxLength } from "class-validator";

import { ImageUploadType } from "@/images/images.enum";

export class GetImageUploadUrlDto {
    @ApiProperty({ description: "MIME type of the file to upload.", example: "image/jpeg" })
    @IsMimeType()
    fileType: string;

    @ApiProperty({ description: "Original file name.", example: "profile.jpg", maximum: 255 })
    @IsString()
    @MaxLength(255)
    @Matches(/^[^/\\]+$/, { message: "fileName must not contain path separators." })
    fileName: string;

    @ApiProperty({ description: "Image upload type.", enum: ImageUploadType })
    @IsEnum(ImageUploadType)
    uploadType: ImageUploadType;
}

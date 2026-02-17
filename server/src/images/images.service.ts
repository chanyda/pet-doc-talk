import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import path from "path";

import { AwsService } from "@/aws/aws.service";
import { ConfigType } from "@/types/config.type";

import { GetImageUploadUrlDto } from "./dtos/requests/get-image-upload-url.request.dto";
import { ImageUploadUrlResponseDto } from "./dtos/responses/image-upload-url.response.dto";

@Injectable()
export class ImagesService {
    private readonly nodeEnv: string;

    constructor(
        private readonly awsService: AwsService,
        configService: ConfigService<ConfigType, true>,
    ) {
        this.nodeEnv = configService.getOrThrow("app.nodeEnv", { infer: true });
    }

    async getImageUploadUrl(
        userId: number,
        getImageUploadUrlDto: GetImageUploadUrlDto,
    ): Promise<ImageUploadUrlResponseDto> {
        const filename = this.sanitizeFileName(getImageUploadUrlDto.fileName);
        // ex) pet/development/1/filename
        const key = `${getImageUploadUrlDto.uploadType}/${this.nodeEnv}/${userId}/${filename}`;

        const uploadUrl = await this.awsService.generatePresignedUrl(key, getImageUploadUrlDto.fileType);
        const imageUrl = this.awsService.getPublicUrl(key);

        return { uploadUrl, imageUrl };
    }

    private sanitizeFileName(fileName: string): string {
        const ext = path.extname(fileName);
        const baseName = path
            .basename(fileName, ext)
            .replace(/[^a-zA-Z0-9가-힣_-]/g, "_")
            .replace(/_+/g, "_")
            .replace(/^_+|_+$/g, "");
        return `${baseName || "image"}${ext}`;
    }
}

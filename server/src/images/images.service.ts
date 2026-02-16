import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

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
        // ex) pet/dev/1/filename
        const key = `${getImageUploadUrlDto.uploadType}/${this.nodeEnv}/${userId}/${getImageUploadUrlDto.fileName}`;

        const uploadUrl = await this.awsService.generatePresignedUrl(key, getImageUploadUrlDto.fileType);
        const imageUrl = this.awsService.getPublicUrl(key);

        return { uploadUrl, imageUrl };
    }
}

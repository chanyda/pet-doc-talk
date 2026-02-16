import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { ConfigType } from "@/types/config.type";

@Injectable()
export class AwsService {
    private readonly s3Client: S3Client;
    private readonly bucketName: string;
    private readonly staticDomain: string;

    constructor(configService: ConfigService<ConfigType, true>) {
        this.bucketName = configService.getOrThrow("aws.s3BucketName", { infer: true });
        this.staticDomain = configService.getOrThrow("aws.staticDomain", { infer: true });

        this.s3Client = new S3Client({
            region: configService.getOrThrow("aws.region", { infer: true }),
            credentials: {
                accessKeyId: configService.getOrThrow("aws.accessKeyId", { infer: true }),
                secretAccessKey: configService.getOrThrow("aws.secretAccessKey", { infer: true }),
            },
        });
    }

    async generatePresignedUrl(key: string, fileType: string, expiresIn = 300): Promise<string> {
        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            ContentType: fileType,
        });

        return getSignedUrl(this.s3Client, command, { expiresIn });
    }

    getPublicUrl(key: string): string {
        return `${this.staticDomain}/${key}`;
    }
}

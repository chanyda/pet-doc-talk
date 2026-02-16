import { registerAs } from "@nestjs/config";

import { AwsConfigType } from "@/types/config.type";

export default registerAs<AwsConfigType>("aws", () => ({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    region: process.env.AWS_REGION || "ap-northeast-2",
    s3BucketName: process.env.AWS_S3_BUCKET_NAME || "",
    staticDomain: process.env.AWS_STATIC_DOMAIN || "",
}));

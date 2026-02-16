import { Module } from "@nestjs/common";

import { AwsModule } from "@/aws/aws.module";

import { ImagesController } from "./images.controller";
import { ImagesService } from "./images.service";

@Module({
    imports: [AwsModule],
    controllers: [ImagesController],
    providers: [ImagesService],
})
export class ImagesModule {}

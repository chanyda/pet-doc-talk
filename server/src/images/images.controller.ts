import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiCreatedResponse, ApiTags } from "@nestjs/swagger";

import { Auth } from "@/common/decorators/auth.decorator";
import { User } from "@/common/decorators/user.decorator";

import { GetImageUploadUrlDto } from "./dtos/requests/get-image-upload-url.request.dto";
import { ImageUploadUrlResponseDto } from "./dtos/responses/image-upload-url.response.dto";
import { ImagesService } from "./images.service";

@ApiTags("Images")
@Auth()
@Controller("images/uploads")
export class ImagesController {
    constructor(private readonly imagesService: ImagesService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiCreatedResponse({
        description: "Get image upload url successful.",
        type: ImageUploadUrlResponseDto,
    })
    async getImageUploadUrl(
        @User("userId") userId: number,
        @Body() getImageUploadUrlDto: GetImageUploadUrlDto,
    ): Promise<ImageUploadUrlResponseDto> {
        return this.imagesService.getImageUploadUrl(userId, getImageUploadUrlDto);
    }
}

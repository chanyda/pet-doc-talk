import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { PostsService } from "./posts.service";
import { ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "src/auth/guards/auth.guard";
import { CreatePostDto } from "./dtos/create-post.dto";
import { PostResponseDto } from "./dtos/post-response.dto";
import { User } from "src/common/decorators/user.decorator";

@ApiBearerAuth()
@ApiTags("posts")
@UseGuards(AuthGuard)
@Controller("posts")
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiCreatedResponse({ description: "Create post successful.", type: PostResponseDto })
    @ApiNotFoundResponse({ description: "User or Category not exists." })
    create(@User("userId") userId: number, @Body() createPostDto: CreatePostDto): Promise<PostResponseDto> {
        return this.postsService.create(userId, createPostDto);
    }
}

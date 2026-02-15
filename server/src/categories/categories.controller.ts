import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";

import { Public } from "@/common/decorators/public.decorator";

import { CategoriesService } from "./categories.service";
import { CategoryListResponseDto } from "./dtos/responses/category-list-response.dto";

@ApiTags("categories")
@Controller("categories")
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @Get()
    @Public()
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ description: "Find categories successful.", type: [CategoryListResponseDto] })
    findMany(): Promise<CategoryListResponseDto[]> {
        return this.categoriesService.findMany();
    }
}

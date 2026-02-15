import { Injectable } from "@nestjs/common";

import { CategoriesRepository } from "./categories.repository";
import { CategoryListResponseDto } from "./dtos/responses/category-list-response.dto";

@Injectable()
export class CategoriesService {
    constructor(private readonly categoriesRepository: CategoriesRepository) {}

    async findMany(): Promise<CategoryListResponseDto[]> {
        return this.categoriesRepository.findMany({ id: true, name: true });
    }

    async existsByCategoryId(categoryId: number): Promise<boolean> {
        const category = await this.categoriesRepository.findById(categoryId, { id: true });
        return !!category;
    }
}

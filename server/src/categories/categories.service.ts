import { Injectable } from "@nestjs/common";
import { CategoriesRepository } from "./categories.repository";

@Injectable()
export class CategoriesService {
    constructor(private readonly categoriesRepository: CategoriesRepository) {}

    async existsByCategoryId(categoryId: number): Promise<boolean> {
        const category = await this.categoriesRepository.findById(categoryId, { id: true });
        return !!category;
    }
}

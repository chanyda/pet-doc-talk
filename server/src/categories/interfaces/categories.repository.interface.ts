import { CategorySelect } from "generated/prisma/models";
import { ICategory } from "./categories.interface";

export interface ICategoriesRepository {
    findById(categoryId: number, select?: CategorySelect): Promise<ICategory | null>;
}

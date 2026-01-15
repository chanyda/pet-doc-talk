import { CategorySelect } from "generated/prisma/models";
import { ICategory } from "./categories.interface";

export interface ICategoriesRepository {
    findMany(select?: CategorySelect): Promise<ICategory[]>;
    findById(categoryId: number, select?: CategorySelect): Promise<ICategory | null>;
}

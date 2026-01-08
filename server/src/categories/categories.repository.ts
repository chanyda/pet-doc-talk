import { Injectable } from "@nestjs/common";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { TransactionHost } from "@nestjs-cls/transactional";
import { CategorySelect } from "generated/prisma/models";
import { ICategoriesRepository } from "./interfaces/categories.repository.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { ICategory } from "./interfaces/categories.interface";

@Injectable()
export class CategoriesRepository implements ICategoriesRepository {
    constructor(private readonly txHost: TransactionHost<TransactionalAdapterPrisma<PrismaService>>) {}

    async findById(categoryId: number, select?: CategorySelect): Promise<ICategory | null> {
        return this.txHost.tx.category.findUnique({
            where: { id: categoryId },
            select,
        });
    }
}

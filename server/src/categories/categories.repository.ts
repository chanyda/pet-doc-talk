import { Injectable } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";

import { CategorySelect } from "generated/prisma/models";

import { PrismaService } from "@/prisma/prisma.service";

import { ICategory } from "./interfaces/categories.interface";
import { ICategoriesRepository } from "./interfaces/categories.repository.interface";

@Injectable()
export class CategoriesRepository implements ICategoriesRepository {
    constructor(private readonly txHost: TransactionHost<TransactionalAdapterPrisma<PrismaService>>) {}

    async findMany(select?: CategorySelect): Promise<ICategory[]> {
        return this.txHost.tx.category.findMany({ select });
    }

    async findById(categoryId: number, select?: CategorySelect): Promise<ICategory | null> {
        return this.txHost.tx.category.findUnique({
            where: { id: categoryId },
            select,
        });
    }
}

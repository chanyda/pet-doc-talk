import { Injectable } from "@nestjs/common";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { TransactionHost } from "@nestjs-cls/transactional";
import { PrismaService } from "src/prisma/prisma.service";
import { IPetsRepository } from "./interfaces/pets.repository.interface";
import { CreatePetDto } from "./dtos/create-pet.dto";
import { IPet } from "./interfaces/pets.interface";
import { PetSelect } from "generated/prisma/models";

@Injectable()
export class PetsRepository implements IPetsRepository {
    constructor(private readonly txHost: TransactionHost<TransactionalAdapterPrisma<PrismaService>>) {}

    async findMany(userId: number, cursor: number | undefined, pageSize: number, select?: PetSelect): Promise<IPet[]> {
        return this.txHost.tx.pet.findMany({
            take: pageSize,
            // cursor가 있는 경우는 자기자신(cursor값과 동일한 id는 이미 조회가 된 row)은 제외해야하므로 skip: 1로 설정한다.
            // cursor가 없는 경우는 건너뛰어야할 row가 없으므로 undefined로 설정한다.
            skip: cursor ? 1 : undefined,
            where: { userId },
            cursor: cursor ? { id: cursor } : undefined,
            select,
            orderBy: { id: "desc" },
        });
    }

    async findById(petId: number, userId: number, select?: PetSelect): Promise<IPet | null> {
        return this.txHost.tx.pet.findFirst({
            where: { id: petId, userId },
            select,
        });
    }

    async create(userId: number, createPetDto: CreatePetDto, select?: PetSelect): Promise<IPet> {
        return this.txHost.tx.pet.create({
            data: { userId, ...createPetDto },
            select,
        });
    }
}

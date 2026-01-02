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

    async create(userId: number, createPetDto: CreatePetDto, select?: PetSelect): Promise<IPet> {
        return this.txHost.tx.pet.create({
            data: { userId, ...createPetDto },
            select,
        });
    }

    async findById(petId: number, userId: number, select?: PetSelect): Promise<IPet | null> {
        return this.txHost.tx.pet.findFirst({
            where: { id: petId, userId },
            select,
        });
    }
}

import { Injectable } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";

import { PetSelect } from "generated/prisma/models";

import { PrismaService } from "@/prisma/prisma.service";

import { CreatePetDto } from "./dtos/requests/create-pet.dto";
import { UpdatePetDto } from "./dtos/requests/update-pet.dto";
import { IPet } from "./interfaces/pets.interface";
import { IPetsRepository } from "./interfaces/pets.repository.interface";

@Injectable()
export class PetsRepository implements IPetsRepository {
    constructor(private readonly txHost: TransactionHost<TransactionalAdapterPrisma<PrismaService>>) {}

    async findMany(userId: number, select?: PetSelect): Promise<IPet[]> {
        return this.txHost.tx.pet.findMany({
            where: { userId },
            select,
            orderBy: { createdAt: "desc" },
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

    async update(petId: number, updatePetDto: UpdatePetDto, select?: PetSelect): Promise<IPet> {
        return this.txHost.tx.pet.update({
            where: { id: petId },
            data: updatePetDto,
            select,
        });
    }

    async delete(petId: number): Promise<IPet> {
        return this.txHost.tx.pet.delete({
            where: { id: petId },
        });
    }
}

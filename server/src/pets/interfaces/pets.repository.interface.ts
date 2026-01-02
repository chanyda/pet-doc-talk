import { PetSelect } from "generated/prisma/models";
import { CreatePetDto } from "../dtos/create-pet.dto";
import { IPet } from "./pets.interface";

export interface IPetsRepository {
    create(userId: number, createPetDto: CreatePetDto, select?: PetSelect): Promise<IPet>;
    findById(petId: number, userId: number, select?: PetSelect): Promise<IPet | null>;
}

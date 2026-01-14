import { PetSelect } from "generated/prisma/models";
import { CreatePetDto } from "../dtos/requests/create-pet.dto";
import { UpdatePetDto } from "../dtos/requests/update-pet.dto";
import { IPet } from "./pets.interface";

export interface IPetsRepository {
    findMany(userId: number, cursor: number | undefined, limit: number, select?: PetSelect): Promise<IPet[]>;
    findById(petId: number, userId: number, select?: PetSelect): Promise<IPet | null>;
    create(userId: number, createPetDto: CreatePetDto, select?: PetSelect): Promise<IPet>;
    update(petId: number, updatePetDto: UpdatePetDto, select?: PetSelect): Promise<IPet>;
    delete(petId: number): Promise<IPet>;
}

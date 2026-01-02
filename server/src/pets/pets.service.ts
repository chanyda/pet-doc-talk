import { Injectable, NotFoundException } from "@nestjs/common";
import { PetsRepository } from "./pets.repository";
import { CreatePetDto } from "./dtos/create-pet.dto";
import { Transactional } from "@nestjs-cls/transactional";
import { PetDetailResponseDto } from "./dtos/pet-detail-response.dto";
import { UsersService } from "src/users/users.service";

@Injectable()
export class PetsService {
    constructor(
        private readonly petsRepository: PetsRepository,
        private readonly usersService: UsersService,
    ) {}

    @Transactional()
    async create(userId: number, createPetDto: CreatePetDto): Promise<PetDetailResponseDto> {
        const existsUser = await this.usersService.existsByUserId(userId);
        if (!existsUser) {
            throw new NotFoundException("User not exists.");
        }

        return this.petsRepository.create(userId, createPetDto, {
            id: true,
            name: true,
            type: true,
            gender: true,
            breed: true,
            weight: true,
            birthDate: true,
            isNeutered: true,
            imageUrl: true,
        });
    }
}

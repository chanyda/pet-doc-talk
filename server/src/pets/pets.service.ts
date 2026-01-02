import { Injectable, NotFoundException } from "@nestjs/common";
import { PetsRepository } from "./pets.repository";
import { CreatePetDto } from "./dtos/create-pet.dto";
import { Transactional } from "@nestjs-cls/transactional";
import { PetDetailResponseDto } from "./dtos/pet-detail-response.dto";
import { UsersService } from "src/users/users.service";

@Injectable()
export class PetsService {
    private readonly PET_DETAIL_SELECT = {
        id: true,
        name: true,
        type: true,
        gender: true,
        breed: true,
        weight: true,
        birthDate: true,
        isNeutered: true,
        imageUrl: true,
    } as const;

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

        return this.petsRepository.create(userId, createPetDto, this.PET_DETAIL_SELECT);
    }

    async findById(petId: number, userId: number): Promise<PetDetailResponseDto> {
        const pet = await this.petsRepository.findById(petId, userId, this.PET_DETAIL_SELECT);

        if (!pet) {
            throw new NotFoundException("Pet not exists.");
        }

        return pet;
    }
}

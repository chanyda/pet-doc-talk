import { Injectable, NotFoundException } from "@nestjs/common";
import { PetsRepository } from "./pets.repository";
import { CreatePetDto } from "./dtos/create-pet.dto";
import { Transactional } from "@nestjs-cls/transactional";
import { PetDetailResponseDto } from "./dtos/pet-detail-response.dto";
import { UsersService } from "src/users/users.service";
import { PetListResponseDto } from "./dtos/pet-list-response.dto";

@Injectable()
export class PetsService {
    private readonly PET_SUMMARY_SELECT = {
        id: true,
        name: true,
        type: true,
        gender: true,
        breed: true,
        imageUrl: true,
    };
    private readonly PET_DETAIL_SELECT = {
        ...this.PET_SUMMARY_SELECT,
        weight: true,
        birthDate: true,
        isNeutered: true,
    } as const;

    constructor(
        private readonly petsRepository: PetsRepository,
        private readonly usersService: UsersService,
    ) {}

    async findMany(userId: number, cursor: number | undefined, pageSize: number): Promise<PetListResponseDto> {
        const pets = await this.petsRepository.findMany(userId, cursor, pageSize, this.PET_SUMMARY_SELECT);

        // 조회된 pet의 수가 pageSize와 동일한 경우, 다음 페이지가 있다고 판단하여 nextCursor를 리턴해주고
        // 동일하지 않은 경우 다음 페이지는 없다고 판단하여 null를 리턴한다.
        const nextCursor = pets.length === pageSize ? pets[pets.length - 1].id : null;
        return {
            pets,
            nextCursor,
        };
    }

    async findById(petId: number, userId: number): Promise<PetDetailResponseDto> {
        const pet = await this.petsRepository.findById(petId, userId, this.PET_DETAIL_SELECT);

        if (!pet) {
            throw new NotFoundException("Pet not exists.");
        }

        return pet;
    }

    @Transactional()
    async create(userId: number, createPetDto: CreatePetDto): Promise<PetDetailResponseDto> {
        const existsUser = await this.usersService.existsByUserId(userId);
        if (!existsUser) {
            throw new NotFoundException("User not exists.");
        }

        return this.petsRepository.create(userId, createPetDto, this.PET_DETAIL_SELECT);
    }
}

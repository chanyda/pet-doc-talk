import { Injectable, NotFoundException } from "@nestjs/common";
import { PetsRepository } from "./pets.repository";
import { CreatePetDto } from "./dtos/requests/create-pet.dto";
import { UpdatePetDto } from "./dtos/requests/update-pet.dto";
import { PetDetailResponseDto } from "./dtos/responses/pet-detail-response.dto";
import { UsersService } from "src/users/users.service";
import { PetListResponseDto } from "./dtos/responses/pet-list-response.dto";
import { PET_DETAIL_SELECT, PET_SUMMARY_SELECT } from "./constants";
import { getNextCursor } from "src/common/utils/pagination.util";

@Injectable()
export class PetsService {
    constructor(
        private readonly petsRepository: PetsRepository,
        private readonly usersService: UsersService,
    ) {}

    async findMany(userId: number, cursor: number | undefined, limit: number): Promise<PetListResponseDto> {
        const pets = await this.petsRepository.findMany(userId, cursor, limit, PET_SUMMARY_SELECT);

        // 조회된 pet의 수가 limit와 동일한 경우, 다음 페이지가 있다고 판단하여 nextCursor를 리턴해주고
        // 동일하지 않은 경우 다음 페이지는 없다고 판단하여 null를 리턴한다.
        const nextCursor = getNextCursor(pets, limit);
        return {
            pets,
            nextCursor,
        };
    }

    async findById(petId: number, userId: number): Promise<PetDetailResponseDto> {
        const pet = await this.petsRepository.findById(petId, userId, PET_DETAIL_SELECT);

        if (!pet) {
            throw new NotFoundException("Pet not exists.");
        }

        return pet;
    }

    async existsPetForUser(petId: number, userId: number): Promise<boolean> {
        // 존재 여부만 체크하기 위해 select는 id만 조회하도록 함
        const pet = await this.petsRepository.findById(petId, userId, { id: true });
        return !!pet;
    }

    async create(userId: number, createPetDto: CreatePetDto): Promise<PetDetailResponseDto> {
        const userExists = await this.usersService.existsByUserId(userId);

        if (!userExists) {
            throw new NotFoundException("User not exists.");
        }

        return this.petsRepository.create(userId, createPetDto, PET_DETAIL_SELECT);
    }

    async update(petId: number, userId: number, updatePetDto: UpdatePetDto): Promise<PetDetailResponseDto> {
        const petExists = await this.existsPetForUser(petId, userId);

        if (!petExists) {
            throw new NotFoundException("Pet not exists.");
        }

        return this.petsRepository.update(petId, updatePetDto, PET_DETAIL_SELECT);
    }

    async remove(petId: number, userId: number): Promise<void> {
        const petExists = await this.existsPetForUser(petId, userId);

        if (!petExists) {
            throw new NotFoundException("Pet not exists.");
        }

        await this.petsRepository.delete(petId);
    }
}

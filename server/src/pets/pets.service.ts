import { Injectable, NotFoundException } from "@nestjs/common";
import { PetsRepository } from "./pets.repository";
import { CreatePetDto } from "./dtos/requests/create-pet.dto";
import { UpdatePetDto } from "./dtos/requests/update-pet.dto";
import { UsersService } from "src/users/users.service";
import { PET_DETAIL_SELECT } from "./constants";
import { PetDetailDto } from "./dtos/responses/pet-detail-dto";
import { IPet } from "./interfaces/pets.interface";

@Injectable()
export class PetsService {
    constructor(
        private readonly petsRepository: PetsRepository,
        private readonly usersService: UsersService,
    ) {}

    async findMany(userId: number): Promise<Array<PetDetailDto>> {
        const pets = await this.petsRepository.findMany(userId, PET_DETAIL_SELECT);
        return pets.map((pet) => this.toPetDetail(pet));
    }

    async findById(petId: number, userId: number): Promise<PetDetailDto> {
        const pet = await this.petsRepository.findById(petId, userId, PET_DETAIL_SELECT);

        if (!pet) {
            throw new NotFoundException("Pet not exists.");
        }

        return this.toPetDetail(pet);
    }

    async existsPetForUser(petId: number, userId: number): Promise<boolean> {
        // 존재 여부만 체크하기 위해 select는 id만 조회하도록 함
        const pet = await this.petsRepository.findById(petId, userId, { id: true });
        return !!pet;
    }

    async create(userId: number, createPetDto: CreatePetDto): Promise<PetDetailDto> {
        const userExists = await this.usersService.existsByUserId(userId);

        if (!userExists) {
            throw new NotFoundException("User not exists.");
        }

        const pet = await this.petsRepository.create(userId, createPetDto, PET_DETAIL_SELECT);
        return this.toPetDetail(pet);
    }

    async update(petId: number, userId: number, updatePetDto: UpdatePetDto): Promise<PetDetailDto> {
        const petExists = await this.existsPetForUser(petId, userId);

        if (!petExists) {
            throw new NotFoundException("Pet not exists.");
        }

        const pet = await this.petsRepository.update(petId, updatePetDto, PET_DETAIL_SELECT);
        return this.toPetDetail(pet);
    }

    async remove(petId: number, userId: number): Promise<void> {
        const petExists = await this.existsPetForUser(petId, userId);

        if (!petExists) {
            throw new NotFoundException("Pet not exists.");
        }

        await this.petsRepository.delete(petId);
    }

    // Decimal 타입의 경우 string으로 리턴되어 클라이언트에서 처리가 복잡해짐
    // 따라서 Number로 변환하고 반환해주도록 함
    private toPetDetail(pet: IPet): PetDetailDto {
        return {
            ...pet,
            weight: pet.weight ? pet.weight.toNumber() : null,
        };
    }
}

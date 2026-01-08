import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from "@nestjs/common";
import { PetsService } from "./pets.service";
import { ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { CreatePetDto } from "./dtos/create-pet.dto";
import { UpdatePetDto } from "./dtos/update-pet.dto";
import { PetDetailResponseDto } from "./dtos/pet-detail-response.dto";
import { PetListResponseDto } from "./dtos/pet-list-response.dto";
import { PaginationQueryDto } from "src/common/dtos/pagination-query.dto";
import { User } from "src/common/decorators/user.decorator";
import { Auth } from "src/common/decorators/auth.decorator";

@ApiTags("pets")
@Auth()
@Controller("pets")
export class PetsController {
    constructor(private readonly petsService: PetsService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ description: "Find pets successful.", type: PetListResponseDto })
    findMany(
        @User("userId") userId: number,
        @Query() paginationQuery: PaginationQueryDto,
    ): Promise<PetListResponseDto> {
        return this.petsService.findMany(userId, paginationQuery.cursor, paginationQuery.limit);
    }

    @Get(":id")
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ description: "Find pet successful.", type: PetDetailResponseDto })
    @ApiNotFoundResponse({ description: "Pet not exists." })
    findById(@User("userId") userId: number, @Param("id") petId: number): Promise<PetDetailResponseDto> {
        return this.petsService.findById(petId, userId);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiCreatedResponse({ description: "Create pet successful.", type: PetDetailResponseDto })
    @ApiNotFoundResponse({ description: "User not exists." })
    create(@User("userId") userId: number, @Body() createPetDto: CreatePetDto): Promise<PetDetailResponseDto> {
        return this.petsService.create(userId, createPetDto);
    }

    @Patch(":id")
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ description: "Update pet successful.", type: PetDetailResponseDto })
    @ApiNotFoundResponse({ description: "Pet not exists." })
    update(
        @User("userId") userId: number,
        @Param("id") petId: number,
        @Body() updatePetDto: UpdatePetDto,
    ): Promise<PetDetailResponseDto> {
        return this.petsService.update(petId, userId, updatePetDto);
    }

    @Delete(":id")
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOkResponse({ description: "Delete pet successful." })
    @ApiNotFoundResponse({ description: "Pet not exists." })
    remove(@User("userId") userId: number, @Param("id") petId: number): Promise<void> {
        return this.petsService.remove(petId, userId);
    }
}

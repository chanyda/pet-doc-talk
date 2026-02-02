import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from "@nestjs/common";
import { PetsService } from "./pets.service";
import { ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { CreatePetDto } from "./dtos/requests/create-pet.dto";
import { UpdatePetDto } from "./dtos/requests/update-pet.dto";
import { PetDetailResponseDto } from "./dtos/responses/pet-detail-response.dto";
import { User } from "src/common/decorators/user.decorator";
import { Auth } from "src/common/decorators/auth.decorator";
import { PetSummaryDto } from "./dtos/responses/pet-summary.dto";

@ApiTags("pets")
@Auth()
@Controller("pets")
export class PetsController {
    constructor(private readonly petsService: PetsService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ description: "Find pets successful.", type: Array<PetSummaryDto> })
    findMany(@User("userId") userId: number): Promise<Array<PetSummaryDto>> {
        return this.petsService.findMany(userId);
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
    @ApiNoContentResponse({ description: "Delete pet successful." })
    @ApiNotFoundResponse({ description: "Pet not exists." })
    remove(@User("userId") userId: number, @Param("id") petId: number): Promise<void> {
        return this.petsService.remove(petId, userId);
    }
}

import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { PetsService } from "./pets.service";
import { ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "src/auth/guards/auth.guard";
import { AuthRequest } from "src/types/request.type";
import { CreatePetDto } from "./dtos/create-pet.dto";
import { UpdatePetDto } from "./dtos/update-pet.dto";
import { PetDetailResponseDto } from "./dtos/pet-detail-response.dto";
import { PetListResponseDto } from "./dtos/pet-list-response.dto";
import { PaginationQueryDto } from "src/common/dtos/pagination-query.dto";

@ApiBearerAuth()
@ApiTags("pets")
@UseGuards(AuthGuard)
@Controller("pets")
export class PetsController {
    constructor(private readonly petsService: PetsService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ description: "Find pets successful.", type: PetListResponseDto })
    findMany(@Req() req: AuthRequest, @Query() paginationQuery: PaginationQueryDto): Promise<PetListResponseDto> {
        return this.petsService.findMany(req.user.userId, paginationQuery.cursor, paginationQuery.pageSize);
    }

    @Get(":id")
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ description: "Find pet successful.", type: PetDetailResponseDto })
    @ApiNotFoundResponse({ description: "Pet not exists." })
    findById(@Req() req: AuthRequest, @Param("id") petId: number): Promise<PetDetailResponseDto> {
        return this.petsService.findById(petId, req.user.userId);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiCreatedResponse({ description: "Create pet successful.", type: PetDetailResponseDto })
    @ApiNotFoundResponse({ description: "User not exists." })
    create(@Req() req: AuthRequest, @Body() createPetDto: CreatePetDto): Promise<PetDetailResponseDto> {
        return this.petsService.create(req.user.userId, createPetDto);
    }

    @Patch(":id")
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ description: "Update pet successful.", type: PetDetailResponseDto })
    @ApiNotFoundResponse({ description: "Pet not exists." })
    update(
        @Req() req: AuthRequest,
        @Param("id") petId: number,
        @Body() updatePetDto: UpdatePetDto,
    ): Promise<PetDetailResponseDto> {
        return this.petsService.update(petId, req.user.userId, updatePetDto);
    }
}

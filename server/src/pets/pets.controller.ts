import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from "@nestjs/common";
import { PetsService } from "./pets.service";
import { ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "src/auth/guards/auth.guard";
import { AuthRequest } from "src/types/request.type";
import { CreatePetDto } from "./dtos/create-pet.dto";
import { PetDetailResponseDto } from "./dtos/pet-detail-response.dto";

@ApiBearerAuth()
@ApiTags("pets")
@UseGuards(AuthGuard)
@Controller("pets")
export class PetsController {
    constructor(private readonly petsService: PetsService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiCreatedResponse({ description: "Create pet successful.", type: PetDetailResponseDto })
    @ApiNotFoundResponse({ description: "User not exists." })
    create(@Req() req: AuthRequest, @Body() createPetDto: CreatePetDto): Promise<PetDetailResponseDto> {
        return this.petsService.create(req.user.userId, createPetDto);
    }
}

import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ConsultationsService } from "./consultations.service";
import { ApiCreatedResponse, ApiNotFoundResponse, ApiTags } from "@nestjs/swagger";
import { CreateConsultationDto } from "./dtos/requests/create-consultation.dto";
import { ConsultationDto } from "./dtos/responses/consultation.dto";
import { User } from "src/common/decorators/user.decorator";
import { Auth } from "src/common/decorators/auth.decorator";

@ApiTags("consultations")
@Auth()
@Controller("consultations")
export class ConsultationsController {
    constructor(private readonly consultationsService: ConsultationsService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiCreatedResponse({ description: "Create consultation successful.", type: ConsultationDto })
    @ApiNotFoundResponse({ description: "Pet not exists." })
    create(
        @User("userId") userId: number,
        @Body() createConsultationDto: CreateConsultationDto,
    ): Promise<ConsultationDto> {
        return this.consultationsService.create(userId, createConsultationDto);
    }
}

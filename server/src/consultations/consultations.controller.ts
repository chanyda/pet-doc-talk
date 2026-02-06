import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query } from "@nestjs/common";
import { ConsultationsService } from "./consultations.service";
import { ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { CreateConsultationDto } from "./dtos/requests/create-consultation.dto";
import { ConsultationDto } from "./dtos/responses/consultation.dto";
import { MyConsultationListResponseDto } from "./dtos/responses/my-consultation-list-response.dto";
import { PaginationQueryDto } from "src/common/dtos/requests/pagination-query.dto";
import { User } from "src/common/decorators/user.decorator";
import { Auth } from "src/common/decorators/auth.decorator";

@ApiTags("consultations")
@Auth()
@Controller("consultations")
export class ConsultationsController {
    constructor(private readonly consultationsService: ConsultationsService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ description: "Find my consultations successful.", type: MyConsultationListResponseDto })
    findMyConsultations(
        @User("userId") userId: number,
        @Query() paginationQuery: PaginationQueryDto,
    ): Promise<MyConsultationListResponseDto> {
        return this.consultationsService.findMyConsultations(userId, paginationQuery);
    }

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

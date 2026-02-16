import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Query } from "@nestjs/common";
import {
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiTags,
} from "@nestjs/swagger";

import { Auth } from "@/common/decorators/auth.decorator";
import { User } from "@/common/decorators/user.decorator";
import { PaginationQueryDto } from "@/common/dtos/requests/pagination-query.dto";

import { ConsultationsService } from "./consultations.service";
import { CreateConsultationDto } from "./dtos/requests/create-consultation.dto";
import { ConsultationDto } from "./dtos/responses/consultation.dto";
import { MyConsultationListResponseDto } from "./dtos/responses/my-consultation-list-response.dto";

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

    @Delete(":consultationId")
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiNoContentResponse({ description: "Delete consultation successful." })
    @ApiNotFoundResponse({ description: "Consultation not exists." })
    @ApiForbiddenResponse({ description: "You do not have permission to delete this consultation." })
    delete(
        @User("userId") userId: number,
        @Param("consultationId", ParseIntPipe) consultationId: number,
    ): Promise<void> {
        return this.consultationsService.delete(userId, consultationId);
    }
}

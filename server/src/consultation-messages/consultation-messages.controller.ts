import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Post,
    Query,
    Res,
    Sse,
} from "@nestjs/common";
import { MessageEvent } from "@nestjs/common";
import { ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";
import { Response } from "express";
import { Observable } from "rxjs";

import { Auth } from "@/common/decorators/auth.decorator";
import { User } from "@/common/decorators/user.decorator";
import { PaginationQueryDto } from "@/common/dtos/requests/pagination-query.dto";

import { ConsultationMessagesService } from "./consultation-messages.service";
import { SendMessageDto } from "./dtos/requests/send-message.dto";
import { MessageListResponseDto } from "./dtos/responses/message-list-response.dto";

@ApiTags("Consultation Messages")
@Auth()
@Controller("consultations/:consultationId/messages")
export class ConsultationMessagesController {
    constructor(private readonly consultationMessagesService: ConsultationMessagesService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ description: "Find messages successful.", type: MessageListResponseDto })
    @ApiNotFoundResponse({ description: "Consultation not exists." })
    @ApiForbiddenResponse({ description: "Access denied to this consultation." })
    findMany(
        @User("userId") userId: number,
        @Param("consultationId", ParseIntPipe) consultationId: number,
        @Query() query: PaginationQueryDto,
    ): Promise<MessageListResponseDto> {
        return this.consultationMessagesService.findMany(userId, consultationId, query);
    }

    @Post()
    @Sse()
    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @ApiOperation({ summary: "Send message and stream AI response (SSE)" })
    @ApiOkResponse({ description: "Message sent and AI response streamed." })
    @ApiForbiddenResponse({ description: "Access denied to this consultation." })
    @ApiNotFoundResponse({ description: "Consultation not exists." })
    sendMessage(
        @Res() res: Response,
        @User("userId") userId: number,
        @Param("consultationId", ParseIntPipe) consultationId: number,
        @Body() sendMessageDto: SendMessageDto,
    ): Promise<Observable<MessageEvent>> {
        return this.consultationMessagesService.sendMessageStream(userId, consultationId, sendMessageDto, res);
    }
}

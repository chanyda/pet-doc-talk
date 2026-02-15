import {
    Controller,
    Post,
    Get,
    Body,
    Param,
    Query,
    ParseIntPipe,
    Sse,
    HttpCode,
    HttpStatus,
    Res,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiOkResponse, ApiNotFoundResponse, ApiForbiddenResponse } from "@nestjs/swagger";
import { Observable } from "rxjs";
import { MessageEvent } from "@nestjs/common";
import { ConsultationMessagesService } from "./consultation-messages.service";
import { SendMessageDto } from "./dtos/requests/send-message.dto";
import { MessageListResponseDto } from "./dtos/responses/message-list-response.dto";
import { PaginationQueryDto } from "src/common/dtos/requests/pagination-query.dto";
import { Auth } from "src/common/decorators/auth.decorator";
import { User } from "src/common/decorators/user.decorator";
import { Throttle } from "@nestjs/throttler";
import { Response } from "express";

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

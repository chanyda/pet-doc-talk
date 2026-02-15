import { ApiProperty } from "@nestjs/swagger";

import { MessageDto } from "./message.dto";

export class MessageListResponseDto {
    @ApiProperty({ description: "List of messages", type: [MessageDto] })
    messages: MessageDto[];

    @ApiProperty({ description: "Total message count", example: 50 })
    totalMessageCount: number;

    @ApiProperty({ description: "Next cursor for pagination", example: 31, nullable: true })
    nextCursor: number | null;
}

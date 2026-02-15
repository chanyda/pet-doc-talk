import { ApiProperty } from "@nestjs/swagger";

import { MessageRole } from "generated/prisma/enums";

export class MessageDto {
    @ApiProperty({ description: "Message ID", example: 1 })
    id: number;

    @ApiProperty({ description: "Consultation ID", example: 1 })
    consultationId: number;

    @ApiProperty({ description: "Message role", enum: MessageRole, example: MessageRole.user })
    role: MessageRole;

    @ApiProperty({ description: "Message content", example: "강아지가 기침을 해요" })
    content: string;

    @ApiProperty({ description: "Creation timestamp", example: "2024-01-01T00:00:00Z" })
    createdAt: Date;
}

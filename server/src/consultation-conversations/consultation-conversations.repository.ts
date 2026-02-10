import { Injectable } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { IConsultationConversation } from "./interfaces/consultation-conversations.interface";
import { IConsultationConversationsRepository } from "./interfaces/consultation-conversations.repository.interface";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ConsultationConversationsRepository implements IConsultationConversationsRepository {
    constructor(private readonly txHost: TransactionHost<TransactionalAdapterPrisma<PrismaService>>) {}

    async create(consultationId: number, conversationId: string): Promise<IConsultationConversation> {
        return this.txHost.tx.consultationConversation.create({
            data: {
                consultationId,
                conversationId,
                totalInputToken: 0,
                totalOutputToken: 0,
                isActive: true,
            },
        });
    }

    async findActiveByConsultationId(consultationId: number): Promise<IConsultationConversation | null> {
        return this.txHost.tx.consultationConversation.findFirst({
            where: {
                consultationId,
                isActive: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    async incrementTokens(conversationId: number, inputTokens: number, outputTokens: number): Promise<void> {
        await this.txHost.tx.consultationConversation.update({
            where: { id: conversationId },
            data: {
                totalInputToken: { increment: inputTokens },
                totalOutputToken: { increment: outputTokens },
            },
        });
    }

    async deactivate(id: number): Promise<void> {
        await this.txHost.tx.consultationConversation.update({
            where: { id },
            data: { isActive: false },
        });
    }
}

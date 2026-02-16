import { Injectable } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";

import { PrismaService } from "@/prisma/prisma.service";

import { IConsultationConversation } from "./interfaces/consultation-conversations.interface";
import { IConsultationConversationsRepository } from "./interfaces/consultation-conversations.repository.interface";

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

    async findManyByConsultationId(consultationId: number): Promise<IConsultationConversation[]> {
        return this.txHost.tx.consultationConversation.findMany({
            where: { consultationId },
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

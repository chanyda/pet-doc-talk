import { Injectable } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { IConsultationMessage } from "./interfaces/consultation-messages.interface";
import {
    FindManyAndCountResult,
    IConsultationMessagesRepository,
    ICreateMessageData,
    IMessageContext,
} from "./interfaces/consultation-messages.repository.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { ConsultationMessageFindManyArgs } from "generated/prisma/models";
import {
    ConsultationMessageGetPayload,
    ConsultationMessageWhereInput,
    SelectSubset,
} from "generated/prisma/internal/prismaNamespace";

@Injectable()
export class ConsultationMessagesRepository implements IConsultationMessagesRepository {
    constructor(private readonly txHost: TransactionHost<TransactionalAdapterPrisma<PrismaService>>) {}

    async findMany<T extends ConsultationMessageFindManyArgs>(
        params: SelectSubset<T, ConsultationMessageFindManyArgs>,
    ): Promise<ConsultationMessageGetPayload<T>[]> {
        return this.txHost.tx.consultationMessage.findMany(params);
    }

    async findManyAndCount<T extends ConsultationMessageFindManyArgs>(
        params: SelectSubset<T, ConsultationMessageFindManyArgs>,
    ): Promise<FindManyAndCountResult<T>> {
        return this.txHost.withTransaction(async () => {
            const messages = await this.findMany(params);
            const totalCount = await this.count(params.where);

            return { messages, totalCount };
        });
    }

    async count(whereInput?: ConsultationMessageWhereInput): Promise<number> {
        return this.txHost.tx.consultationMessage.count({ where: whereInput });
    }

    async create(consultationId: number, data: ICreateMessageData): Promise<IConsultationMessage> {
        return this.txHost.tx.consultationMessage.create({
            data: { consultationId, ...data },
        });
    }

    async findRecentForContext(consultationId: number, limit: number): Promise<Array<IMessageContext>> {
        return this.txHost.tx.consultationMessage.findMany({
            where: {
                consultationId,
                // welcome 메세지는 제외하도록 한다.
                OR: [{ inputToken: { gt: 0 } }, { outputToken: { gt: 0 } }],
            },
            orderBy: { createdAt: "desc" },
            take: limit,
            select: { role: true, content: true },
        });
    }
}

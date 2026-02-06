import { Injectable } from "@nestjs/common";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { TransactionHost } from "@nestjs-cls/transactional";
import { PrismaService } from "src/prisma/prisma.service";
import { FindManyAndCountResult, IConsultationsRepository } from "./interfaces/consultations.repository.interface";
import { IConsultation } from "./interfaces/consultations.interface";
import { ConsultationFindManyArgs, ConsultationGetPayload, ConsultationSelect } from "generated/prisma/models";
import { ConsultationWhereInput, SelectSubset } from "generated/prisma/internal/prismaNamespace";
import { CreateConsultationDto } from "./dtos/requests/create-consultation.dto";

@Injectable()
export class ConsultationsRepository implements IConsultationsRepository {
    constructor(private readonly txHost: TransactionHost<TransactionalAdapterPrisma<PrismaService>>) {}

    async findMany<T extends ConsultationFindManyArgs>(
        params: SelectSubset<T, ConsultationFindManyArgs>,
    ): Promise<ConsultationGetPayload<T>[]> {
        return this.txHost.tx.consultation.findMany(params);
    }

    async findManyAndCount<T extends ConsultationFindManyArgs>(
        params: SelectSubset<T, ConsultationFindManyArgs>,
    ): Promise<FindManyAndCountResult<T>> {
        return this.txHost.withTransaction(async () => {
            const consultations = await this.findMany(params);
            const totalCount = await this.count(params.where);

            return { consultations, totalCount };
        });
    }

    async count(whereInput?: ConsultationWhereInput): Promise<number> {
        return this.txHost.tx.consultation.count({ where: whereInput });
    }

    async create(
        userId: number,
        createConsultationDto: CreateConsultationDto,
        select?: ConsultationSelect,
    ): Promise<IConsultation> {
        return this.txHost.tx.consultation.create({
            data: { userId, ...createConsultationDto },
            select,
        });
    }
}

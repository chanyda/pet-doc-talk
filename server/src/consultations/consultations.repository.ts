import { Injectable } from "@nestjs/common";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { TransactionHost } from "@nestjs-cls/transactional";
import { PrismaService } from "src/prisma/prisma.service";
import { IConsultationsRepository } from "./interfaces/consultations.repository.interface";
import { IConsultation } from "./interfaces/consultations.interface";
import { ConsultationSelect } from "generated/prisma/models";
import { CreateConsultationDto } from "./dtos/requests/create-consultation.dto";

@Injectable()
export class ConsultationsRepository implements IConsultationsRepository {
    constructor(private readonly txHost: TransactionHost<TransactionalAdapterPrisma<PrismaService>>) {}

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

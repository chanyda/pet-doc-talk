import { ConsultationWhereInput, SelectSubset } from "generated/prisma/internal/prismaNamespace";
import { ConsultationFindManyArgs, ConsultationGetPayload, ConsultationSelect } from "generated/prisma/models";

import { CreateConsultationDto } from "../dtos/requests/create-consultation.dto";
import { IConsultation } from "./consultations.interface";

export type FindManyAndCountResult<T extends ConsultationFindManyArgs> = {
    consultations: ConsultationGetPayload<T>[];
    totalCount: number;
};

export interface IConsultationsRepository {
    findMany<T extends ConsultationFindManyArgs>(
        params: SelectSubset<T, ConsultationFindManyArgs>,
    ): Promise<ConsultationGetPayload<T>[]>;
    findManyAndCount<T extends ConsultationFindManyArgs>(
        params: SelectSubset<T, ConsultationFindManyArgs>,
    ): Promise<FindManyAndCountResult<T>>;
    count(whereInput?: ConsultationWhereInput): Promise<number>;
    findById(id: number, select?: ConsultationSelect): Promise<IConsultation | null>;
    create(
        userId: number,
        createConsultationDto: CreateConsultationDto,
        select?: ConsultationSelect,
    ): Promise<IConsultation>;
}

import { ConsultationSelect } from "generated/prisma/models";
import { CreateConsultationDto } from "../dtos/requests/create-consultation.dto";
import { IConsultation } from "./consultations.interface";

export interface IConsultationsRepository {
    create(
        userId: number,
        createConsultationDto: CreateConsultationDto,
        select?: ConsultationSelect,
    ): Promise<IConsultation>;
}

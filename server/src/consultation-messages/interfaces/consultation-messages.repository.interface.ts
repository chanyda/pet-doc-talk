import { MessageRole } from "generated/prisma/enums";
import {
    ConsultationMessageGetPayload,
    ConsultationMessageWhereInput,
    SelectSubset,
} from "generated/prisma/internal/prismaNamespace";
import { ConsultationMessageFindManyArgs } from "generated/prisma/models";

import { IConsultationMessage } from "./consultation-messages.interface";

export interface ICreateMessageData {
    role: MessageRole;
    content: string;
    inputToken: number;
    outputToken: number;
}

export interface IMessageContext {
    role: MessageRole;
    content: string;
}

export type FindManyAndCountResult<T extends ConsultationMessageFindManyArgs> = {
    messages: ConsultationMessageGetPayload<T>[];
    totalCount: number;
};

export interface IConsultationMessagesRepository {
    findMany<T extends ConsultationMessageFindManyArgs>(
        params: SelectSubset<T, ConsultationMessageFindManyArgs>,
    ): Promise<ConsultationMessageGetPayload<T>[]>;
    findManyAndCount<T extends ConsultationMessageFindManyArgs>(
        params: SelectSubset<T, ConsultationMessageFindManyArgs>,
    ): Promise<FindManyAndCountResult<T>>;
    count(whereInput?: ConsultationMessageWhereInput): Promise<number>;
    create(consultationId: number, data: ICreateMessageData): Promise<IConsultationMessage>;
    findRecentForContext(consultationId: number, limit: number): Promise<Array<IMessageContext>>;
}

import { Injectable } from "@nestjs/common";
import { IUsersRepository } from "./interfaces/users.repository.interface";
import { CreateUserDto } from "./dtos/requests/create-user.dto";
import { UpdateUserDto } from "./dtos/requests/update-user.dto";
import { IUser } from "./interfaces/users.interface";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { TransactionHost } from "@nestjs-cls/transactional";
import { PrismaService } from "src/prisma/prisma.service";
import { UserGetPayload, UserSelect } from "generated/prisma/models";

@Injectable()
export class UsersRepository implements IUsersRepository {
    constructor(private readonly txHost: TransactionHost<TransactionalAdapterPrisma<PrismaService>>) {}

    async create(createUserDto: CreateUserDto): Promise<IUser> {
        return this.txHost.tx.user.create({
            data: createUserDto,
        });
    }

    // select가 없는 경우 기본적으로 모든 User 필드 및 타입을 반환하도록 하고,
    // select가 있는 경우 select에 대한 User 필드 및 타입을 반환하도록 하기 위해 메소드 오버로딩
    async findById(userId: number): Promise<IUser | null>;
    async findById<T extends UserSelect>(userId: number, select: T): Promise<UserGetPayload<{ select: T }> | null>;
    async findById<T extends UserSelect>(
        userId: number,
        select?: T,
    ): Promise<IUser | UserGetPayload<{ select: T }> | null> {
        return this.txHost.tx.user.findUnique({
            where: { id: userId },
            select,
        });
    }

    async findByEmail(email: string, select?: UserSelect): Promise<IUser | null> {
        return this.txHost.tx.user.findUnique({
            where: { email },
            select,
        });
    }

    async findByNickname(nickname: string, excludeUserId?: number, select?: UserSelect): Promise<IUser | null> {
        return this.txHost.tx.user.findUnique({
            where: { nickname, NOT: { id: excludeUserId } },
            select,
        });
    }

    async updateById(userId: number, updateUserDto: UpdateUserDto): Promise<IUser>;
    async updateById<T extends UserSelect>(
        userId: number,
        updateUserDto: UpdateUserDto,
        select: T,
    ): Promise<UserGetPayload<{ select: T }>>;
    async updateById<T extends UserSelect>(
        userId: number,
        updateUserDto: UpdateUserDto,
        select?: T,
    ): Promise<IUser | UserGetPayload<{ select: T }>> {
        return this.txHost.tx.user.update({
            where: { id: userId },
            data: updateUserDto,
            select,
        });
    }
}

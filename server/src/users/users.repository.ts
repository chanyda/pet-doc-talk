import { Injectable } from "@nestjs/common";
import { IUsersRepository } from "./interfaces/users.repository.interface";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { IUser } from "./interfaces/users.interface";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { TransactionHost } from "@nestjs-cls/transactional";
import { PrismaService } from "src/prisma/prisma.service";
import { UserSelect } from "generated/prisma/models";

@Injectable()
export class UsersRepository implements IUsersRepository {
    constructor(private readonly txHost: TransactionHost<TransactionalAdapterPrisma<PrismaService>>) {}

    async create(createUserDto: CreateUserDto): Promise<IUser> {
        return this.txHost.tx.user.create({
            data: createUserDto,
        });
    }

    async findById(userId: number, select?: UserSelect): Promise<IUser | null> {
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

    async updateById(userId: number, updateUserDto: UpdateUserDto, select?: UserSelect): Promise<IUser> {
        return this.txHost.tx.user.update({
            where: { id: userId },
            data: updateUserDto,
            select,
        });
    }
}

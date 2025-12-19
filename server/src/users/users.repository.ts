import { Injectable } from "@nestjs/common";
import { IUsersRepository } from "./interfaces/users.repository.interface";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { IUser } from "./interfaces/users.interface";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { TransactionHost } from "@nestjs-cls/transactional";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UsersRepository implements IUsersRepository {
    constructor(private readonly txHost: TransactionHost<TransactionalAdapterPrisma<PrismaService>>) {}

    async create(createUserDto: CreateUserDto): Promise<IUser> {
        return this.txHost.tx.user.create({
            data: createUserDto,
        });
    }

    async findByEmail(email: string): Promise<IUser | null> {
        return this.txHost.tx.user.findUnique({
            where: { email },
        });
    }

    async updateById(userId: number, updateUserDto: UpdateUserDto): Promise<IUser> {
        return this.txHost.tx.user.update({
            where: { id: userId },
            data: updateUserDto,
        });
    }
}

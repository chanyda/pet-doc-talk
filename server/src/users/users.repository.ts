import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { IUsersRepository } from "./interfaces/users.repository.interface";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { IUser } from "./interfaces/users.interface";

@Injectable()
export class UsersRepository implements IUsersRepository {
    constructor(private readonly prismaService: PrismaService) {}

    async create(createUserDto: CreateUserDto): Promise<IUser> {
        return await this.prismaService.user.create({
            data: createUserDto,
        });
    }

    async findByEmail(email: string): Promise<IUser | null> {
        return await this.prismaService.user.findUnique({
            where: { email },
        });
    }

    async updateById(userId: number, updateUserDto: UpdateUserDto): Promise<IUser> {
        return await this.prismaService.user.update({
            where: { id: userId },
            data: updateUserDto,
        });
    }
}

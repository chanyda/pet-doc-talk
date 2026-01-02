import { UserSelect } from "generated/prisma/models";
import { CreateUserDto } from "../dtos/create-user.dto";
import { UpdateUserDto } from "../dtos/update-user.dto";
import { IUser } from "./users.interface";

export interface IUsersRepository {
    create(createUserDto: CreateUserDto): Promise<IUser>;
    findById(userId: number, select?: UserSelect): Promise<IUser | null>;
    findByEmail(email: string, select?: UserSelect): Promise<IUser | null>;
    findByNickname(nickname: string, userId?: number, select?: UserSelect): Promise<IUser | null>;
    updateById(userId: number, updateUserDto: UpdateUserDto, select?: UserSelect): Promise<IUser>;
}

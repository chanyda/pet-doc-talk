import { UserGetPayload, UserSelect } from "generated/prisma/models";
import { CreateUserDto } from "../dtos/requests/create-user.dto";
import { UpdateUserDto } from "../dtos/requests/update-user.dto";
import { IUser } from "./users.interface";

export interface IUsersRepository {
    create(createUserDto: CreateUserDto): Promise<IUser>;
    findById(userId: number): Promise<IUser | null>;
    findById<T extends UserSelect>(userId: number, select: T): Promise<UserGetPayload<{ select: T }> | null>;
    findByEmail(email: string, select?: UserSelect): Promise<IUser | null>;
    findByNickname(nickname: string, excludeUserId?: number, select?: UserSelect): Promise<IUser | null>;
    updateById(userId: number, updateUserDto: UpdateUserDto): Promise<IUser>;
    updateById<T extends UserSelect>(
        userId: number,
        updateUserDto: UpdateUserDto,
        select: T,
    ): Promise<UserGetPayload<{ select: T }>>;
}

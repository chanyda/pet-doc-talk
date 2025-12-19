import { CreateUserDto } from "../dtos/create-user.dto";
import { UpdateUserDto } from "../dtos/update-user.dto";
import { IUser } from "./users.interface";

export interface IUsersRepository {
    create(createUserDto: CreateUserDto): Promise<IUser>;
    findByEmail(email: string): Promise<IUser | null>;
    updateById(userId: number, updateUserDto: UpdateUserDto): Promise<IUser>;
}

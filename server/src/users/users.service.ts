import { Injectable } from "@nestjs/common";
import { UsersRepository } from "./users.repository";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { IUser } from "./interfaces/users.interface";

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository) {}

    create(createUserDto: CreateUserDto): Promise<IUser> {
        return this.usersRepository.create(createUserDto);
    }

    findByEmail(email: string): Promise<IUser | null> {
        return this.usersRepository.findByEmail(email);
    }

    updateById(userId: number, updateUserDto: UpdateUserDto): Promise<IUser> {
        return this.usersRepository.updateById(userId, updateUserDto);
    }
}

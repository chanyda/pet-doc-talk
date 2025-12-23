import { Injectable, NotFoundException } from "@nestjs/common";
import { UsersRepository } from "./users.repository";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { IUser } from "./interfaces/users.interface";
import { FindMyProfileResponseDto } from "./dtos/find-my-profile-response.dto";

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository) {}

    create(createUserDto: CreateUserDto): Promise<IUser> {
        return this.usersRepository.create(createUserDto);
    }

    findByEmail(email: string): Promise<IUser | null> {
        return this.usersRepository.findByEmail(email);
    }

    async findProfileByEmail(email: string): Promise<FindMyProfileResponseDto> {
        const user = await this.usersRepository.findByEmail(email, {
            id: true,
            email: true,
            name: true,
            nickname: true,
            profileImageUrl: true,
        });

        if (!user) {
            throw new NotFoundException("User not exists.");
        }

        return user;
    }

    updateById(userId: number, updateUserDto: UpdateUserDto): Promise<IUser> {
        return this.usersRepository.updateById(userId, updateUserDto);
    }
}

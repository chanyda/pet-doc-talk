import { Injectable, NotFoundException } from "@nestjs/common";
import { UsersRepository } from "./users.repository";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { IUser } from "./interfaces/users.interface";
import { FindProfileResponseDto } from "./dtos/find-profile-response.dto";

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository) {}

    create(createUserDto: CreateUserDto): Promise<IUser> {
        return this.usersRepository.create(createUserDto);
    }

    findByEmail(email: string): Promise<IUser | null> {
        return this.usersRepository.findByEmail(email);
    }

    async existsByNickname(nickname: string): Promise<boolean> {
        const user = await this.usersRepository.findByNickname(nickname, { id: true });
        return !!user;
    }

    async findProfileByEmail(email: string): Promise<FindProfileResponseDto> {
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

    async updateById(userId: number, updateUserDto: UpdateUserDto): Promise<IUser> {
        const user = await this.usersRepository.findById(userId);

        if (!user) {
            throw new NotFoundException("User not exists.");
        }

        return this.usersRepository.updateById(userId, updateUserDto);
    }
}

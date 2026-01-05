import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersRepository } from "./users.repository";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { IUser } from "./interfaces/users.interface";
import { FindProfileResponseDto } from "./dtos/find-profile-response.dto";
import { UpdateProfileDto } from "./dtos/update-profile-dto";
import { Transactional } from "@nestjs-cls/transactional";

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository) {}

    @Transactional()
    create(createUserDto: CreateUserDto): Promise<IUser> {
        return this.usersRepository.create(createUserDto);
    }

    findByEmail(email: string): Promise<IUser | null> {
        return this.usersRepository.findByEmail(email);
    }

    async existsByUserId(userId: number): Promise<boolean> {
        const user = await this.usersRepository.findById(userId, { id: true });
        return !!user;
    }

    /**
     * @param nickname
     * @param excludeUserId 나를 제외한 사용자들 중 동일한 닉네임이 있는지 체크해야할 때 사용
     * @returns
     */
    async existsByNickname(nickname: string, excludeUserId?: number): Promise<boolean> {
        const user = await this.usersRepository.findByNickname(nickname, excludeUserId, { id: true });
        return !!user;
    }

    async findProfile(userId: number): Promise<FindProfileResponseDto> {
        const user = await this.usersRepository.findById(userId, {
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

    @Transactional()
    async updateProfile(userId: number, updateProfileDto: UpdateProfileDto): Promise<FindProfileResponseDto> {
        const userExists = await this.existsByUserId(userId);
        if (!userExists) {
            throw new NotFoundException("User not exists.");
        }

        if (updateProfileDto.nickname) {
            // 닉네임 변경 시 이미 존재하는 닉네임이 있는지 체크해준다.
            const existsNickname = await this.existsByNickname(updateProfileDto.nickname, userId);

            if (existsNickname) {
                throw new BadRequestException("This nickname is already in use.");
            }
        }

        return this.usersRepository.updateById(userId, updateProfileDto, {
            id: true,
            email: true,
            name: true,
            nickname: true,
            profileImageUrl: true,
        });
    }

    @Transactional()
    async updateById(userId: number, updateUserDto: UpdateUserDto): Promise<IUser> {
        const userExists = await this.existsByUserId(userId);
        if (!userExists) {
            throw new NotFoundException("User not exists.");
        }

        return this.usersRepository.updateById(userId, updateUserDto);
    }
}

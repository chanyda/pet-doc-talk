import { BadRequestException, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Transactional } from "@nestjs-cls/transactional";
import { nanoid } from "nanoid";

import { PointSource } from "generated/prisma/enums";

import { PointsService } from "@/points/points.service";
import { JwtPayload } from "@/types/auth.type";
import { ConfigType } from "@/types/config.type";
import { UsersService } from "@/users/users.service";

import { LoginDto } from "./dtos/requests/login.dto";
import { GenerateTokenResponseDto, LoginResponseDto } from "./dtos/responses/login-response.dto";

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private usersService: UsersService,
        private pointsService: PointsService,
        private jwtService: JwtService,
        private configService: ConfigService<ConfigType, true>,
    ) {}

    @Transactional()
    async login(loginDto: LoginDto): Promise<LoginResponseDto> {
        let user = await this.usersService.findByEmail(loginDto.email);
        let isNewUser = false;

        // 로그인하려는 email을 가진 user가 없는 경우, 신규 회원이므로 user를 생성해준다.
        if (!user) {
            const temporaryNickname = await this.generateTemporaryNickname();

            user = await this.usersService.create({ ...loginDto, refreshToken: "", nickname: temporaryNickname });
            isNewUser = true;

            await this.pointsService.applyPoint(user.id, PointSource.SIGN_UP);
        } else {
            // 기존 회원인 경우, 현재 로그인하려는 provider와 기존에 로그인한 provider가 동일한지 체크한다.
            if (loginDto.loginFrom.toString() !== user.loginFrom) {
                throw new BadRequestException(`Already signed up using ${user.loginFrom}.`);
            }
        }

        const tokens = this.generateToken(user.id, user.email);
        await this.usersService.updateById(user.id, { refreshToken: tokens.refreshToken });

        return { ...tokens, isNewUser };
    }

    async clearRefreshToken(userId: number): Promise<void> {
        await this.usersService.updateById(userId, { refreshToken: "" });
    }

    async refresh(accessToken: string, refreshToken: string): Promise<GenerateTokenResponseDto> {
        const secretKey = this.configService.getOrThrow("auth.secretKey", { infer: true });

        let accessTokenPayload: JwtPayload;
        let refreshTokenPayload: JwtPayload;

        try {
            accessTokenPayload = this.jwtService.verify<JwtPayload>(accessToken, {
                secret: secretKey,
                ignoreExpiration: true,
            });
            refreshTokenPayload = this.jwtService.verify<JwtPayload>(refreshToken, {
                secret: secretKey,
            });
        } catch (err) {
            this.logger.error("Token verification failed.", err);
            throw new UnauthorizedException("Invalid token.");
        }

        this.verifyTokenPayload(accessTokenPayload, refreshTokenPayload);

        const user = await this.usersService.findByEmail(refreshTokenPayload.email);

        if (!user) {
            this.logger.error("User not exists.");
            throw new UnauthorizedException("Invalid token.");
        }

        if (user.refreshToken !== refreshToken) {
            this.logger.error("Refresh token mismatch.");
            throw new UnauthorizedException("Invalid token.");
        }

        const newTokens = this.generateToken(user.id, user.email);

        // NOTE:  RTR (Refresh Token Rotation)으로 구현했는데, 우선은 postgres에 업데이트를 해두자
        // 추후 서비스가 커지면 Redis로 옮겨야함 (access token 발급 시 refresh token도 발급되므로 서버 부하가 올라감)
        await this.usersService.updateRefreshToken(user.id, refreshToken, newTokens.refreshToken);

        return newTokens;
    }

    private generateToken(userId: number, email: string): GenerateTokenResponseDto {
        const payload = { userId, email };
        const secretKey = this.configService.getOrThrow("auth.secretKey", { infer: true });
        const accessTokenExpTime = this.configService.getOrThrow("auth.accessTokenExpTime", { infer: true });
        const refreshTokenExpTime = this.configService.getOrThrow("auth.refreshTokenExpTime", { infer: true });

        const accessToken = this.jwtService.sign(payload, {
            secret: secretKey,
            expiresIn: accessTokenExpTime,
        });
        const refreshToken = this.jwtService.sign(
            { ...payload, isRefresh: true },
            {
                secret: secretKey,
                expiresIn: refreshTokenExpTime,
            },
        );

        return { accessToken, refreshToken };
    }

    private async generateTemporaryNickname(): Promise<string> {
        let exists = true;
        let temporaryNickname = "";

        do {
            try {
                temporaryNickname = `user_${nanoid(10)}`;

                const nicknameExists = await this.usersService.existsByNickname(temporaryNickname);
                exists = nicknameExists;
            } catch (err) {
                this.logger.error("Failed to generate temporary nickname.", err);
            }
        } while (exists);

        return temporaryNickname;
    }

    private verifyTokenPayload(accessTokenPayload: JwtPayload, refreshTokenPayload: JwtPayload): void {
        try {
            const requiredFields: Array<keyof JwtPayload> = ["email", "userId"];

            // AccessToken, RefreshToken에 반드시 포함되어이야하는 값들이 있는지 체크한다.
            const isValidAccessToken = requiredFields.every((field) => !!accessTokenPayload[field]);
            if (!isValidAccessToken) {
                throw new Error("Invalid access token.");
            }

            const isValidRefreshToken = requiredFields.every((field) => !!refreshTokenPayload[field]);
            if (!isValidRefreshToken || !refreshTokenPayload.isRefresh) {
                throw new Error("Invalid refresh token.");
            }

            // AccessToken, RefreshToken payload 값들이 동일한지 체크한다.
            const isMatched = requiredFields.every((field) => accessTokenPayload[field] === refreshTokenPayload[field]);
            if (!isMatched) {
                throw new Error("Token payload mismatch.");
            }
        } catch (err) {
            this.logger.error("Token payload verification failed.", err);
            throw new UnauthorizedException("Invalid token.");
        }
    }
}

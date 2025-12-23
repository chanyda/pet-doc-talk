import { BadRequestException, Injectable } from "@nestjs/common";
import { LoginDto } from "./dto/login.dto";
import { UsersService } from "src/users/users.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { GenerateTokenResponseDto, LoginResponseDto } from "./dto/login-response.dto";
import { Transactional } from "@nestjs-cls/transactional";
import { ConfigType } from "src/types/config.type";

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService<ConfigType, true>,
    ) {}

    @Transactional()
    async login(loginDto: LoginDto): Promise<LoginResponseDto> {
        let user = await this.userService.findByEmail(loginDto.email);
        let isNewUser = false;

        // 로그인하려는 email을 가진 user가 없는 경우, 신규 회원이므로 user를 생성해준다.
        if (!user) {
            user = await this.userService.create({ ...loginDto, refreshToken: "" });
            isNewUser = true;
        } else {
            // 기존 회원인 경우, 현재 로그인하려는 provider와 기존에 로그인한 provider가 동일한지 체크한다.
            if (loginDto.loginFrom.toString() !== user.loginFrom) {
                throw new BadRequestException(`Already signed up using ${user.loginFrom}.`);
            }
        }

        const tokens = this.generateToken(user.id, user.email);
        await this.userService.updateById(user.id, { refreshToken: tokens.refreshToken });

        return { ...tokens, isNewUser };
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
}

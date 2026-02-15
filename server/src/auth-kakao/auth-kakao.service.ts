import { HttpService } from "@nestjs/axios";
import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { isAxiosError } from "axios";
import { firstValueFrom } from "rxjs";

import { ConfigType } from "@/types/config.type";

import { KakaoGetUserInformationResponse, KakaoOAuthTokenResponse } from "../types/auth.type";
import { KAKAO_API } from "./constants";
import { AuthenticateResponseDto } from "./dtos/responses/authenticate-response.dto";

@Injectable()
export class AuthKakaoService {
    private readonly kakaoClientId: string;
    private readonly kakaoRedirectUri: string;
    private readonly kakaoClientSecret: string;

    constructor(
        private readonly httpService: HttpService,
        configService: ConfigService<ConfigType, true>,
    ) {
        this.kakaoClientId = configService.getOrThrow("auth.kakaoClientId", { infer: true });
        this.kakaoRedirectUri = configService.getOrThrow("auth.kakaoRedirectUri", { infer: true });
        this.kakaoClientSecret = configService.getOrThrow("auth.kakaoClientSecret", { infer: true });
    }

    async authenticate(authorizeCode: string): Promise<AuthenticateResponseDto> {
        const kakaoAccessToken = await this.getKakaoAccessToken(authorizeCode);
        const kakaoUserInfo = await this.getKakaoUserInfo(kakaoAccessToken);

        const kakaoAccount = kakaoUserInfo.kakao_account;

        if (!kakaoAccount) {
            throw new NotFoundException("Kakao account not exists.");
        }

        // TODO: name을 받아오려면 별도의 승인을 받아야해서 우선은 nickname으로 하고,
        // name 정보도 가져올 수 있도록 요청 후 변경해야한다. (만약 승인이 안되면 name 필드는 빼야할듯)
        if (!kakaoAccount.email) {
            throw new NotFoundException("Required user information not found in Kakao account: email");
        }

        if (!kakaoAccount.profile?.nickname) {
            throw new NotFoundException("Required user information not found in Kakao account: nickname");
        }

        return { email: kakaoAccount.email, name: kakaoAccount.profile.nickname };
    }

    private async getKakaoAccessToken(code: string): Promise<string> {
        try {
            const config = {
                grant_type: "authorization_code",
                client_id: this.kakaoClientId,
                redirect_uri: this.kakaoRedirectUri,
                code,
                client_secret: this.kakaoClientSecret,
            };
            const params = new URLSearchParams(config).toString();

            const response = await firstValueFrom(
                this.httpService.post<KakaoOAuthTokenResponse>(KAKAO_API.TOKEN_URL, params, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
                    },
                }),
            );

            const accessToken = response.data.access_token;

            if (!accessToken) {
                throw new UnauthorizedException("Invalid token.");
            }

            return accessToken;
        } catch (err) {
            this.handleError(err);
        }
    }

    private async getKakaoUserInfo(accessToken: string): Promise<KakaoGetUserInformationResponse> {
        try {
            const response = await firstValueFrom(
                this.httpService.get<KakaoGetUserInformationResponse>(KAKAO_API.USER_INFO_URL, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
                    },
                }),
            );

            return response.data;
        } catch (err) {
            this.handleError(err);
        }
    }

    private handleError(err: unknown): never {
        console.error(err);

        if (isAxiosError(err)) {
            const status = err.response?.status;

            if (status === 400) {
                throw new BadRequestException("Invalid request to Kakao API.");
            }

            if (status === 401) {
                throw new UnauthorizedException("Kakao authentication failed.");
            }

            if (status && status >= 500) {
                throw new InternalServerErrorException("Kakao service is temporarily unavailable.");
            }

            throw new BadRequestException("Kakao authentication failed.");
        }

        throw new InternalServerErrorException("Unexpected error occurred.");
    }
}

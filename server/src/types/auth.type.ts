export type JwtPayload = {
    userId: number;
    email: string;
    isRefresh?: boolean;
    iat: number;
    exp: number;
};

export type KakaoOAuthTokenResponse = {
    token_type: string;
    access_token: string;
    id_token?: string;
    expires_in: number;
    refresh_token: string;
    refresh_token_expires_in: number;
    scope: string;
};

export type KakaoGetUserInformationResponse = {
    id: number;
    has_signed_up?: boolean;
    connected_at?: Date;
    synched_at?: Date;
    properties?: any;
    kakao_account?: KakaoAccount;
    for_partner?: ForPartner;
};

type KakaoProfile = {
    nickname?: string;
    thumbnail_image_url?: string;
    profile_image_url?: string;
    is_default_image?: boolean;
};

type KakaoAccount = {
    profile_needs_agreement?: boolean;
    profile_nickname_needs_agreement?: boolean;
    profile_image_needs_agreement?: boolean;
    profile?: KakaoProfile;
    name_needs_agreement?: boolean;
    name?: string;
    email_needs_agreement?: boolean;
    is_email_valid?: boolean;
    is_email_verified?: boolean;
    email?: string;
    age_range_needs_agreement?: boolean;
    age_range?: string;
    birthyear_needs_agreement?: boolean;
    birthyear?: string;
    birthday_needs_agreement?: boolean;
    birthday?: string;
    birthday_type?: "SOLAR" | "LUNAR";
    is_leap_month?: boolean;
    gender_needs_agreement?: boolean;
    gender?: "female" | "male";
    phone_number_needs_agreement?: boolean;
    phone_number?: string;
    ci_needs_agreement?: boolean;
    ci?: string;
    ci_authenticated_at?: string;
};

type ForPartner = {
    uuid: string;
};

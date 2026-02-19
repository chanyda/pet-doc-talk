export const SOCIAL_LOGIN_CONFIGS = [
    {
        type: "KAKAO",
        imageSrc: "/images/kakao-icon.png",
        href: `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}`,
    },
] as Array<SocialLoginConfig>;

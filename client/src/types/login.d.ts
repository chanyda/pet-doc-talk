type SocialLoginType = "KAKAO" | "GOOGLE" | "NAVER";

type SocialLoginConfig = {
    type: SocialLoginType;
    imageSrc: string;
    href: string;
};

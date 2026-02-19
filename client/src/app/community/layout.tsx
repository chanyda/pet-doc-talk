import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "커뮤니티 - 펫닥톡",
    description: "반려동물과 함께하는 이야기를 나누고, 유용한 정보를 공유하는 반려인 커뮤니티입니다.",
};

export default function CommunityLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <>{children}</>;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "AI 상담 - 펫케어",
    description: "24시간 AI 수의사와 반려동물 건강 상담을 받아보세요.",
};

export default function AIConsultationLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <>{children}</>;
}

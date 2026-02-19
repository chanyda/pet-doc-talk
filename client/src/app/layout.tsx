import type { Metadata, Viewport } from "next";

import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";

import { AuthProvider } from "@/providers/AuthProvider";

import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#ffffff" },
        { media: "(prefers-color-scheme: dark)", color: "#030213" },
    ],
};

export const metadata: Metadata = {
    title: {
        default: "펫닥톡 - 반려동물 건강 상담",
        template: "%s | 펫닥톡",
    },
    description: "AI 상담으로 지금 바로 반려동물 건강 상담을 받아보세요. 반려동물 커뮤니티와 함께하는 펫닥톡 서비스",
    keywords: ["반려동물", "AI 상담", "수의사", "펫닥톡", "반려견", "반려묘", "동물병원", "건강상담"],
    authors: [{ name: "PetDocTalk Team" }],
    creator: "PetDocTalk",
    publisher: "PetDocTalk",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001"),
    openGraph: {
        type: "website",
        locale: "ko_KR",
        url: "/",
        title: "펫닥톡 - 반려동물 건강 상담",
        description: "AI 상담으로 지금 바로 반려동물 건강 상담을 받아보세요",
        siteName: "펫닥톡",
    },
    twitter: {
        card: "summary_large_image",
        title: "펫닥톡 - 반려동물 건강 상담",
        description: "AI 상담으로 지금 바로 반려동물 건강 상담을 받아보세요",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <AuthProvider>
                    {children}
                    <Toaster position="top-right" richColors duration={2000} />
                </AuthProvider>
            </body>
        </html>
    );
}

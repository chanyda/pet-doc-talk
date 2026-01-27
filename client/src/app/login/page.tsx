"use client";

import Image from "next/image";
import Link from "next/link";

import { TopNavigation } from "@/components/layout/TopNavigation";
import { socialLoginConfigs } from "@/constants/config";

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <TopNavigation />
            <main className="max-w-md mx-auto px-6 py-12">
                <div className="bg-white rounded-2xl shadow-sm p-8">
                    <h1 className="text-3xl font-bold mb-2 text-center" style={{ color: "#FF6B9D" }}>
                        로그인
                    </h1>
                    <p className="text-gray-600 text-center mb-8">펫케어에 오신 것을 환영합니다</p>
                    <div className="space-y-3">
                        {socialLoginConfigs.map((config) => (
                            <Link key={config.type} href={config.href} className="block w-full">
                                <Image
                                    src={config.imageSrc}
                                    alt={`${config.type} 로그인`}
                                    width={400}
                                    height={60}
                                    className="w-full h-auto object-contain"
                                    unoptimized
                                />
                            </Link>
                        ))}
                    </div>
                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-400">소셜 로그인을 통해 간편하게 시작하세요</p>
                    </div>
                </div>
            </main>
        </div>
    );
}

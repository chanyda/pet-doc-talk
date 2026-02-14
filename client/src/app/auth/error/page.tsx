"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function AuthErrorPage() {
    const searchParams = useSearchParams();
    const errorMessage = searchParams.get("message") || "로그인 중 오류가 발생했습니다.";

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-sm p-8 text-center">
                <div className="mb-6">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">로그인 실패</h1>
                    <p className="text-gray-600">{errorMessage}</p>
                </div>

                <div className="space-y-3">
                    <Link
                        href="/login"
                        className="block w-full bg-pink-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-pink-600 transition-colors">
                        다시 로그인하기
                    </Link>
                    <Link
                        href="/"
                        className="block w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                        메인으로 돌아가기
                    </Link>
                </div>
            </div>
        </div>
    );
}

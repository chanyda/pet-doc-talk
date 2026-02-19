"use client";

import Link from "next/link";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-sm p-8 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">문제가 발생했습니다.</h1>
                <p className="text-gray-600 mb-6">{error.message || "알 수 없는 오류가 발생했습니다."}</p>
                <div className="space-y-3">
                    <button
                        onClick={reset}
                        className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-lg hover:from-pink-600 hover:to-rose-600 transition-all cursor-pointer">
                        다시 시도
                    </button>
                    <Link
                        href="/"
                        className="block w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-all">
                        홈으로 돌아가기
                    </Link>
                </div>
            </div>
        </div>
    );
}

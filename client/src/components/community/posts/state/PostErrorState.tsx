"use client";

import { useRouter } from "next/navigation";

import { TopNavigation } from "@/components/layout/TopNavigation";

interface PostErrorStateProps {
    message?: string;
}

export function PostErrorState({ message }: PostErrorStateProps) {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gray-50">
            <TopNavigation />
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="text-center py-20">
                    <p className="text-gray-500 text-lg mb-4">{message || "게시글을 찾을 수 없습니다."}</p>
                    <button
                        onClick={() => router.push("/community")}
                        className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors">
                        목록으로 돌아가기
                    </button>
                </div>
            </div>
        </div>
    );
}

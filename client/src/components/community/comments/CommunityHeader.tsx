"use client";

import { useRouter } from "next/navigation";
import WriteIcon from "public/icons/write-icon.svg";

import { StyledButton } from "@/components/ui/StyledButton";

export function CommunityHeader() {
    const router = useRouter();

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">커뮤니티</h1>
                <p className="text-sm text-gray-600">반려동물과 함께하는 일상을 공유해보세요.</p>
            </div>
            <StyledButton onClick={() => router.push("/community/new")} className="w-full sm:w-auto">
                <WriteIcon stroke="#ffffff" />
                <span className="hidden sm:inline">게시글 작성하기</span>
                <span className="sm:hidden">글쓰기</span>
            </StyledButton>
        </div>
    );
}

"use client";

import { useRouter } from "next/navigation";
import WriteIcon from "public/icons/write-icon.svg";

import { StyledButton } from "@/components/ui/StyledButton";

export function CommunityHeader() {
    const router = useRouter();

    return (
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-3xl font-bold mb-2">커뮤니티</h1>
                <p className="text-sm text-gray-600">반려동물과 함께하는 일상을 공유해보세요.</p>
            </div>
            <StyledButton onClick={() => router.push("/community/new")}>
                <WriteIcon stroke="#ffffff" />
                게시글 작성하기
            </StyledButton>
        </div>
    );
}

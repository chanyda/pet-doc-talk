"use client";

import { useRouter } from "next/navigation";
import WriteIcon from "public/icons/write-icon.svg";

interface CommunityEmptyStateProps {
    type: "post" | "comment";
}

export function CommunityEmptyState({ type }: CommunityEmptyStateProps) {
    const router = useRouter();
    const contentLabel = type === "post" ? "게시글" : "댓글";

    const handleWriteClick = () => {
        if (type === "post") {
            router.push("/community/new");
        }
    };

    return (
        <div className="text-center py-12">
            {type === "post" && (
                <div
                    className="w-20 h-20 mx-auto mb-4 rounded-full hover:shadow-lg cursor-pointer flex items-center justify-center"
                    role="button"
                    aria-label="게시글 작성하기"
                    style={{ backgroundColor: "#FF6B9D" }}
                    onClick={handleWriteClick}>
                    <WriteIcon stroke="#ffffff" width="35px" height="35px" />
                </div>
            )}
            <p className="text-gray-600 mb-2">작성된 {contentLabel}이 없습니다.</p>
            <p className="text-sm text-gray-500">첫 {contentLabel}을 작성해보세요!</p>
        </div>
    );
}

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Tiptap } from "@/components/editor/Tiptap";
import { POST_CONTENT_LIMIT, POST_TITLE_LIMIT } from "@/constants/post";
import * as api from "@/lib/api";

import { CategorySelect } from "./CategorySelect";

export function CreatePostForm() {
    const router = useRouter();
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const isTitleOver = title.length > POST_TITLE_LIMIT;
    const isContentOver = content.length > POST_CONTENT_LIMIT;
    const isFormValid = selectedCategoryId && title.trim() && content.trim() && !isTitleOver && !isContentOver;

    const handleSubmit = async () => {
        if (!selectedCategoryId) {
            alert("카테고리를 선택해 주세요.");
            return;
        }
        if (!title.trim()) {
            alert("제목을 입력해 주세요.");
            return;
        }
        if (isTitleOver) {
            alert(`제목은 최대 ${POST_TITLE_LIMIT}자까지 입력 가능합니다.`);
            return;
        }
        if (!content.trim()) {
            alert("본문을 입력해 주세요.");
            return;
        }
        if (isContentOver) {
            alert(`본문은 최대 ${POST_CONTENT_LIMIT}자까지 입력 가능합니다.`);
            return;
        }

        try {
            setIsSubmitting(true);

            const response = await api.createPost({
                categoryId: selectedCategoryId,
                title: title.trim(),
                content: content.trim(),
            });
            router.push(`/community/${response.data.id}`);
        } catch (error) {
            console.error("Failed to create post:", error);
            alert("게시글 등록에 실패했습니다. 다시 시도해주세요.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        if (title || content) {
            if (window.confirm("작성 중인 내용이 있습니다. 정말 나가시겠습니까?")) {
                router.push("/community");
            }
        } else {
            router.push("/community");
        }
    };

    return (
        <div className="space-y-6">
            <CategorySelect selectedCategoryId={selectedCategoryId} onCategoryChange={setSelectedCategoryId} />
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    제목 <span className="text-pink-600">*</span>
                </label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="제목을 입력하세요."
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                        isTitleOver
                            ? "border-red-300 focus:border-red-400 bg-red-50"
                            : "border-gray-200 focus:border-pink-300 focus:bg-pink-50"
                    }`}
                    maxLength={POST_TITLE_LIMIT}
                />
                <div className={`text-xs mt-1 text-right ${isTitleOver ? "text-red-500" : "text-gray-500"}`}>
                    {title.length}/{POST_TITLE_LIMIT}
                </div>
            </div>
            <Tiptap onChange={setContent} />
            <div className={`text-xs mt-1 text-right ${isContentOver ? "text-red-500" : "text-gray-500"}`}>
                {content.length}/{POST_CONTENT_LIMIT}
            </div>
            <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button
                    onClick={handleCancel}
                    className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors cursor-pointer">
                    취소
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={!isFormValid || isSubmitting}
                    className="flex-1 px-6 py-3 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg cursor-pointer"
                    style={{
                        background:
                            isFormValid && !isSubmitting
                                ? "linear-gradient(135deg, #FF6B9D 0%, #FFA07A 100%)"
                                : "#d1d5db",
                    }}>
                    {isSubmitting ? "등록 중..." : "게시글 등록"}
                </button>
            </div>
        </div>
    );
}

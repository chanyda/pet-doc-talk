"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Tiptap } from "@/components/editor/Tiptap";
import ConfirmModal from "@/components/modals/ConfirmModal";
import { POST_CONTENT_LIMIT, POST_TITLE_LIMIT } from "@/constants/post";
import { useConfirm } from "@/hooks/useConfirm";
import * as api from "@/lib/api";

import { CategorySelect } from "./CategorySelect";

interface PostFormProps {
    mode: PostMode;
    initialData?: PostDetail;
}

export function PostForm({ mode, initialData }: PostFormProps) {
    const router = useRouter();
    const { confirmState, confirm } = useConfirm();
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(initialData?.category.id ?? null);
    const [title, setTitle] = useState<string>(initialData?.title ?? "");
    const [content, setContent] = useState<string>(initialData?.content ?? "");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const isEdit = mode === "edit";
    const isTitleOver = title.length > POST_TITLE_LIMIT;
    const isContentOver = content.length > POST_CONTENT_LIMIT;
    const isFormValid = selectedCategoryId && title.trim() && content.trim() && !isTitleOver && !isContentOver;

    const handleSubmit = async () => {
        if (!selectedCategoryId) {
            toast.error("카테고리를 선택해 주세요.");
            return;
        }
        if (!title.trim()) {
            toast.error("제목을 입력해 주세요.");
            return;
        }
        if (isTitleOver) {
            toast.error(`제목은 최대 ${POST_TITLE_LIMIT}자까지 입력 가능합니다.`);
            return;
        }
        if (!content.trim()) {
            toast.error("본문을 입력해 주세요.");
            return;
        }
        if (isContentOver) {
            toast.error(`본문은 최대 ${POST_CONTENT_LIMIT}자까지 입력 가능합니다.`);
            return;
        }

        try {
            setIsSubmitting(true);

            const body = {
                categoryId: selectedCategoryId,
                title: title.trim(),
                content: content.trim(),
            };

            let postId: number | null = null;
            switch (mode) {
                case "edit":
                    if (!initialData) throw new Error("Post data not exists.");
                    await api.updatePost(initialData.id, body);
                    postId = initialData.id;

                    break;
                case "create":
                    const response = await api.createPost(body);
                    postId = response.data.id;

                    break;
            }

            toast.success(`게시글이 ${isEdit ? "수정" : "등록"}되었습니다.`);
            router.push(`/community/${postId}`);
        } catch (error) {
            console.error(`Failed to ${mode} post:`, error);
            toast.error(`게시글 ${isEdit ? "수정" : "등록"}에 실패했습니다. 다시 시도해주세요.`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = async () => {
        const hasUnsavedChanges = Boolean(title || content);
        const exitPath = isEdit && initialData ? `/community/${initialData.id}` : "/community";

        if (!hasUnsavedChanges) {
            router.push(exitPath);
            return;
        }

        const confirmed = await confirm({
            title: "작성 취소",
            message: "작성 중인 내용이 있습니다. 정말 나가시겠습니까?",
            variant: "warning",
        });

        if (confirmed) {
            router.push(exitPath);
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
            <Tiptap onChange={setContent} initialContent={initialData?.content} />
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
                    {isEdit ? "게시글 수정" : "게시글 등록"}
                </button>
            </div>
            {confirmState && (
                <ConfirmModal
                    isOpen={confirmState.isOpen}
                    title={confirmState.title}
                    message={confirmState.message}
                    confirmText={confirmState.confirmText}
                    cancelText={confirmState.cancelText}
                    variant={confirmState.variant}
                    onConfirm={confirmState.onConfirm}
                    onCancel={confirmState.onCancel}
                />
            )}
        </div>
    );
}

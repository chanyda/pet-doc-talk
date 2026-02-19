"use client";

import DOMPurify from "dompurify";
import { useRouter } from "next/navigation";
import ArrowLeftIcon from "public/icons/arrow-left-icon.svg";
import DeleteIcon from "public/icons/delete-icon.svg";
import EditIcon from "public/icons/edit-icon.svg";
import { toast } from "sonner";

import ConfirmModal from "@/components/modals/ConfirmModal";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";
import { useConfirm } from "@/hooks/useConfirm";
import * as api from "@/lib/api";
import { formatLocalDateTime } from "@/utils/date";

import { CategoryTag } from "./CategoryTag";

interface PostContentProps {
    post: PostDetail;
    currentUserId: number | null;
    onBack?: () => void;
}

export function PostContent({ post, currentUserId, onBack }: PostContentProps) {
    const router = useRouter();
    const { confirmState, confirm } = useConfirm();
    const isAuthor = currentUserId && post.user.id === currentUserId;

    const handleEdit = () => {
        router.push(`/community/${post.id}/edit`);
    };

    const handleDelete = async () => {
        const confirmed = await confirm({
            title: "게시글 삭제",
            message: "정말 삭제하시겠습니까?",
            variant: "danger",
        });

        if (!confirmed) return;

        try {
            await api.deletePost(post.id);
            toast.success("게시글이 삭제되었습니다.");
            router.push("/community");
        } catch (error) {
            console.error("Failed to delete post:", error);
            toast.error("게시글 삭제에 실패했습니다.");
        }
    };

    return (
        <article className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
                {onBack && (
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors cursor-pointer">
                        <ArrowLeftIcon />
                        <span>목록으로</span>
                    </button>
                )}
                <CategoryTag category={post.category} />
                <h1 className="text-2xl md:text-3xl font-bold mb-4 mt-3">{post.title}</h1>
                <div className="flex items-baseline justify-between gap-4 mb-3">
                    <div className="flex items-center gap-2 min-w-0">
                        <ProfileAvatar
                            nickname={post.user.nickname}
                            profileImageUrl={post.user.profileImageUrl}
                            size="md"
                        />
                        <div className="flex flex-col min-w-0">
                            <span className="font-medium text-gray-900 truncate">{post.user.nickname}</span>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span className="truncate">{formatLocalDateTime(post.createdAt)}</span>
                                <span>•</span>
                                <span className="whitespace-nowrap">조회 {post.viewCount}</span>
                            </div>
                        </div>
                    </div>
                    {isAuthor && (
                        <div className="flex items-center gap-1 shrink-0">
                            <button
                                onClick={handleEdit}
                                className="flex items-center gap-1.5 px-2 md:px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                                title="수정">
                                <EditIcon fill={"#505050"} stroke={"#505050"} />
                                <span className="hidden md:inline">수정</span>
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex items-center gap-1.5 px-2 md:px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                title="삭제">
                                <DeleteIcon />
                                <span className="hidden md:inline">삭제</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <div className="p-6">
                <div
                    className="prose max-w-full text-gray-800 leading-relaxed mb-6"
                    dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(post.content),
                    }}
                />
                {/* {post.images && post.images.length > 0 && (
                    <div className="grid grid-cols-1 gap-4 mb-6">
                        {post.images.map((image, index) => (
                            <div key={index} className="rounded-xl overflow-hidden relative w-full h-auto">
                                <Image
                                    src={image}
                                    alt={`이미지 ${index + 1}`}
                                    width={800}
                                    height={600}
                                    className="w-full h-auto object-cover"
                                />
                            </div>
                        ))}
                    </div>
                )} */}
                {/* Like Button */}
                {/* <div className="flex items-center justify-center pt-6 border-t border-gray-100">
                    <button
                        onClick={handleLike}
                        className={`flex items-center gap-2 px-8 py-3 rounded-xl transition-all ${
                            isLiked ? "text-white shadow-lg" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                        style={{
                            background: isLiked ? "var(--brand-gradient)" : undefined,
                        }}>
                        <HeartIcon className={isLiked ? "fill-white" : ""} />
                        <span className="font-medium">좋아요 {likeCount}</span>
                    </button>
                </div> */}
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
        </article>
    );
}

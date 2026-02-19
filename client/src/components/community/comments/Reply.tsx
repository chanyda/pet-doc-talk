"use client";

import ConfirmModal from "@/components/modals/ConfirmModal";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";
import { useConfirm } from "@/hooks/useConfirm";
import { formatLocalDateTime } from "@/utils/date";

interface ReplyProps {
    reply: CommentReply;
    currentUserId: number;
    onEdit?: (replyId: number, content: string) => void;
    onDelete?: (replyId: number) => void;
}

export function Reply({ reply, currentUserId, onEdit, onDelete }: ReplyProps) {
    const { confirmState, confirm } = useConfirm();
    const isAuthor = reply.user.id === currentUserId;
    const isDeleted = !!reply.deletedAt;

    const handleEdit = () => {
        if (onEdit) {
            const newContent = prompt("답글을 수정하세요", reply.content);
            if (newContent && newContent.trim()) {
                onEdit(reply.id, newContent);
            }
        }
    };

    const handleDelete = async () => {
        if (!onDelete) return;

        const confirmed = await confirm({
            title: "답글 삭제",
            message: "답글을 삭제하시겠습니까?",
            variant: "danger",
        });

        if (confirmed) {
            onDelete(reply.id);
        }
    };

    return (
        <div className="flex gap-3">
            <ProfileAvatar nickname={reply.user.nickname} profileImageUrl={reply.user.profileImageUrl} size="sm" />

            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-900">{reply.user.nickname}</span>
                    <span className="text-xs text-gray-500">{formatLocalDateTime(reply.createdAt)}</span>
                    {reply.updatedAt !== reply.createdAt && !isDeleted && (
                        <span className="text-xs text-gray-400">(수정됨)</span>
                    )}
                </div>

                {isDeleted ? (
                    <p className="text-sm text-gray-400 mb-2 leading-relaxed italic">삭제된 답글입니다</p>
                ) : (
                    <>
                        {reply.mentionUser && (
                            <span className="text-sm text-pink-600 mr-1">@{reply.mentionUser.nickname}</span>
                        )}
                        <p className="text-sm text-gray-800 mb-2 leading-relaxed whitespace-pre-wrap">
                            {reply.content}
                        </p>
                    </>
                )}

                {!isDeleted && (
                    <div className="flex items-center gap-3">
                        {/* <button
                            onClick={handleLike}
                            className={`flex items-center gap-1 text-xs transition-colors ${
                                isLiked ? "text-pink-600" : "text-gray-500 hover:text-pink-600"
                            }`}>
                            <HeartIcon className={isLiked ? "fill-current" : ""} />
                            <span>{likeCount > 0 ? likeCount : "공감"}</span>
                        </button> */}

                        {isAuthor && (
                            <>
                                <button
                                    onClick={handleEdit}
                                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors cursor-pointer">
                                    <span>수정</span>
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-600 transition-colors cursor-pointer">
                                    <span>삭제</span>
                                </button>
                            </>
                        )}
                    </div>
                )}
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

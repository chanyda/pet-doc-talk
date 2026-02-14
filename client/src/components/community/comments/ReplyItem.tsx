"use client";

import { useState } from "react";
import { toast } from "sonner";

import ConfirmModal from "@/components/modals/ConfirmModal";
import { MessageInput } from "@/components/ui/MessageInput";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";
import { COMMENT_CONTENT_LIMIT } from "@/constants/post";
import { useCommentAction } from "@/contexts/CommentActionContext";
import { useOutsideClick } from "@/hooks/useClickOutside";
import { useConfirm } from "@/hooks/useConfirm";
import * as api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { formatLocalDateTime } from "@/utils/date";

import { CommentActionMenu } from "./CommentActionMenu";

interface ReplyItemProps {
    reply: CommentReply;
    onReplyToReply: (mentionUser: MentionUser, replyId: number) => void;
    onEdit: (updatedReply: CommentReply) => void;
    onDelete: (replyId: number) => void;
}

export function ReplyItem({ reply, onReplyToReply, onEdit, onDelete }: ReplyItemProps) {
    const { activeAction, setActiveAction, cancelAction } = useCommentAction();
    const { user: currentUser } = useAuthStore();
    const { confirmState, confirm } = useConfirm();

    const [isActionMenuOpen, setIsActionMenuOpen] = useState<boolean>(false);
    const [editContent, setEditContent] = useState<string>(reply.content);

    const actionMenuRef = useOutsideClick(() => setIsActionMenuOpen(false));

    const isEditing = activeAction?.type === "editingReply" && activeAction.targetId === reply.id;
    const isAuthor = !!currentUser && reply.user.id === currentUser.id;
    const isDeleted = !!reply.deletedAt;

    const handleSubmitEdit = async () => {
        if (!editContent.trim()) return;

        if (editContent === reply.content) {
            cancelAction();
            return;
        }

        try {
            const { data } = await api.updateComment(reply.id, { content: editContent });
            onEdit({
                ...reply,
                content: data.content,
                updatedAt: data.updatedAt,
            });
            cancelAction();
            toast.success("답글이 수정되었습니다.");
        } catch (error) {
            console.error("Failed to update reply:", error);
            toast.error("답글 수정에 실패했습니다. 다시 시도해주세요.");
        }
    };

    const handleCancelEdit = () => {
        cancelAction();
        setEditContent(reply.content);
    };

    const handleDelete = async () => {
        const confirmed = await confirm({
            title: "답글 삭제",
            message: "답글을 삭제하시겠습니까?",
            variant: "danger",
        });

        if (!confirmed) return;

        try {
            await api.deleteComment(reply.id);
            onDelete(reply.id);
            toast.success("답글이 삭제되었습니다.");
        } catch (error) {
            console.error("Failed to delete reply:", error);
            toast.error("답글 삭제에 실패했습니다. 다시 시도해주세요.");
        }
    };

    const handleActionMenuClick = (action: CommentActionMenuClickType) => {
        switch (action) {
            case "reply":
                onReplyToReply({ id: reply.user.id, nickname: reply.user.nickname }, reply.id);
                setIsActionMenuOpen(false);
                break;
            case "edit":
                setActiveAction({ type: "editingReply", targetId: reply.id });
                setEditContent(reply.content);
                setIsActionMenuOpen(false);
                break;
            case "delete":
                handleDelete();
                break;
        }
    };

    const renderContent = () => {
        if (isDeleted) {
            return <p className="text-gray-400 mb-3 leading-relaxed italic">삭제된 답글입니다.</p>;
        }

        if (isEditing) {
            return (
                <div className="mb-3">
                    <MessageInput
                        value={editContent}
                        onChange={setEditContent}
                        onSubmit={handleSubmitEdit}
                        onCancel={handleCancelEdit}
                        placeholder="답글을 수정하세요..."
                        maxLength={COMMENT_CONTENT_LIMIT}
                    />
                </div>
            );
        }

        return (
            <>
                <p className="text-gray-800 mb-3 leading-relaxed break-words">
                    {reply.mentionUser && reply.mentionUser.id !== 0 && (
                        <span className="text-pink-600 font-medium">@{reply.mentionUser.nickname} </span>
                    )}
                    {reply.content}
                </p>
                <button
                    onClick={() => onReplyToReply({ id: reply.user.id, nickname: reply.user.nickname }, reply.id)}
                    className="text-sm text-gray-500 hover:text-pink-600 transition-colors mb-3">
                    답글 달기
                </button>
            </>
        );
    };

    return (
        <div className="flex gap-3">
            <ProfileAvatar nickname={reply.user.nickname} profileImageUrl={reply.user.profileImageUrl} size="sm" />
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{reply.user.nickname}</span>
                        <span className="text-xs text-gray-500">{formatLocalDateTime(reply.createdAt)}</span>
                        {reply.updatedAt !== reply.createdAt && !isDeleted && (
                            <span className="text-xs text-gray-400">(수정됨)</span>
                        )}
                    </div>
                    {!isDeleted && !isEditing && (
                        <CommentActionMenu
                            isOpen={isActionMenuOpen}
                            onClick={(action) => handleActionMenuClick(action)}
                            onToggle={() => setIsActionMenuOpen(!isActionMenuOpen)}
                            onClose={() => setIsActionMenuOpen(false)}
                            isAuthor={isAuthor}
                            menuRef={actionMenuRef}
                        />
                    )}
                </div>
                {renderContent()}
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

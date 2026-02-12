"use client";

import { Fragment, useEffect, useState } from "react";
import { toast } from "sonner";

import ConfirmModal from "@/components/modals/ConfirmModal";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { MessageInput } from "@/components/ui/MessageInput";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";
import { COMMENT_CONTENT_LIMIT, COMMENT_REPLY_PAGE_LIMIT } from "@/constants/post";
import { useCommentAction } from "@/contexts/CommentActionContext";
import { useOutsideClick } from "@/hooks/useClickOutside";
import { useConfirm } from "@/hooks/useConfirm";
import * as api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { formatLocalDateTime } from "@/utils/date";

import { CommentActionMenu } from "./CommentActionMenu";
import { ReplyItem } from "./ReplyItem";

interface CommentProps {
    comment: PostComment;
    postId: number;
    onEdit: (updatedComment: Comment) => void;
    onDelete: (commentId: number) => void;
    onAddReplyCount: (commentId: number) => void;
}

export function CommentItem({ comment, postId, onEdit, onDelete, onAddReplyCount }: CommentProps) {
    const { activeAction, setActiveAction, cancelAction } = useCommentAction();
    const { user: currentUser } = useAuthStore();
    const { confirmState, confirm } = useConfirm();

    const [isActionMenuOpen, setIsActionMenuOpen] = useState<boolean>(false);
    const [editContent, setEditContent] = useState<string>(comment.content);
    const [replies, setReplies] = useState<CommentReply[]>([]);
    const [totalReplyCount, setTotalReplyCount] = useState<number>(0);
    const [repliesNextCursor, setRepliesNextCursor] = useState<number | null>(null);
    const [showReplies, setShowReplies] = useState<boolean>(false);
    const [replyContent, setReplyContent] = useState<string>("");
    const [isRepliesLoading, setIsRepliesLoading] = useState<boolean>(false);
    const [replyTarget, setReplyTarget] = useState<CommentReplyTarget | null>(null);
    const actionMenuRef = useOutsideClick(() => setIsActionMenuOpen(false));

    const isEditing = activeAction?.type === "editing" && activeAction.targetId === comment.id;
    const isReplying = activeAction?.type === "replying" && activeAction.targetId === comment.id;
    const isAuthor = !!currentUser && comment.user.id === currentUser.id;
    const isDeleted = !!comment.deletedAt;

    const fetchReplies = async (cursor?: number) => {
        try {
            setIsRepliesLoading(true);

            const params: PaginationQuery = {
                limit: COMMENT_REPLY_PAGE_LIMIT,
            };

            if (cursor !== undefined) {
                params.cursor = cursor;
            }

            const { data } = await api.getReplies(comment.id, params);

            setReplies((prev) => (cursor !== undefined ? [...prev, ...data.replies] : data.replies));
            setTotalReplyCount(data.totalReplyCount);
            setRepliesNextCursor(data.nextCursor);
        } catch (error) {
            console.error("Failed to fetch replies:", error);
            setReplies([]);
            setRepliesNextCursor(null);
        } finally {
            setIsRepliesLoading(false);
        }
    };

    useEffect(() => {
        if (showReplies && replies.length === 0) {
            fetchReplies();
        }
    }, [showReplies]);

    const handleSubmitReply = async () => {
        if (!replyContent.trim() || !currentUser) return;

        try {
            const { data } = await api.createComment(postId, {
                content: replyContent,
                parentId: comment.id,
                mentionUserId: replyTarget?.mentionUser.id ?? null,
            });

            const newReply: CommentReply = {
                id: data.id,
                content: data.content,
                parentId: data.parentId,
                user: {
                    id: currentUser.id,
                    nickname: currentUser.nickname,
                    profileImageUrl: currentUser.profileImageUrl,
                },
                mentionUser: replyTarget?.mentionUser ?? null,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
                deletedAt: data.deletedAt,
            };

            setReplies((prev) => [...prev, newReply]);
            setReplyContent("");
            setReplyTarget(null);
            cancelAction();
            setShowReplies(true);
            onAddReplyCount(comment.id);
            toast.success("답글이 등록되었습니다.");
        } catch (error) {
            console.error("Failed to create reply:", error);
            toast.error("답글 작성에 실패했습니다. 다시 시도해주세요.");
        }
    };

    const handleReplyToReply = (targetUser: MentionUser, replyId: number) => {
        setReplyTarget({ replyId, mentionUser: targetUser });
        setReplyContent("");
        setActiveAction({ type: "replying", targetId: comment.id });
    };

    const handleCancelReply = () => {
        cancelAction();
        setReplyContent("");
        setReplyTarget(null);
    };

    const handleEditReply = (updatedReply: CommentReply) => {
        setReplies((prev) => prev.map((r) => (r.id === updatedReply.id ? updatedReply : r)));
    };

    const handleDeleteReply = (replyId: number) => {
        setReplies((prev) => prev.map((r) => (r.id === replyId ? { ...r, deletedAt: new Date().toISOString() } : r)));
    };

    const handleSubmitEdit = async () => {
        if (!editContent.trim()) return;

        if (editContent === comment.content) {
            cancelAction();
            return;
        }

        try {
            const { data } = await api.updateComment(comment.id, { content: editContent });
            onEdit(data);
            cancelAction();
            toast.success("댓글이 수정되었습니다.");
        } catch (error) {
            console.error("Failed to update comment:", error);
            toast.error("댓글 수정에 실패했습니다. 다시 시도해주세요.");
        }
    };

    const handleCancelEdit = () => {
        cancelAction();
        setEditContent(comment.content);
    };

    const handleDelete = async () => {
        const confirmed = await confirm({
            title: "댓글 삭제",
            message: "댓글을 삭제하시겠습니까?",
            variant: "danger",
        });

        if (!confirmed) return;

        try {
            await api.deleteComment(comment.id);
            onDelete(comment.id);
            toast.success("댓글이 삭제되었습니다.");
        } catch (error) {
            console.error("Failed to delete comment:", error);
            toast.error("댓글 삭제에 실패했습니다. 다시 시도해주세요.");
        }
    };

    const handleActionMenuClick = (action: CommentActionMenuClickType) => {
        switch (action) {
            case "reply":
                if (!isReplying) {
                    setActiveAction({ type: "replying", targetId: comment.id });
                }

                setReplyTarget(null);
                setReplyContent("");
                setIsActionMenuOpen(false);
                break;
            case "edit":
                setActiveAction({ type: "editing", targetId: comment.id });
                setEditContent(comment.content);
                setIsActionMenuOpen(false);
                break;
            case "delete":
                handleDelete();
                break;
        }
    };

    const renderComment = () => {
        if (isDeleted) {
            return <p className="text-gray-400 mb-3 leading-relaxed italic">삭제된 댓글입니다.</p>;
        }

        if (isEditing) {
            return (
                <div className="mb-3">
                    <MessageInput
                        value={editContent}
                        onChange={setEditContent}
                        onSubmit={handleSubmitEdit}
                        onCancel={handleCancelEdit}
                        placeholder="댓글을 수정하세요..."
                        maxLength={COMMENT_CONTENT_LIMIT}
                    />
                </div>
            );
        }

        return (
            <>
                <p className="text-gray-800 mb-3 leading-relaxed break-words">{comment.content}</p>
                <button
                    onClick={() => {
                        setReplyTarget(null);
                        setReplyContent("");
                        if (!isReplying) {
                            setActiveAction({ type: "replying", targetId: comment.id });
                        }
                    }}
                    className="text-sm text-gray-500 hover:text-pink-600 transition-colors mb-3">
                    답글 달기
                </button>
            </>
        );
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-3">
                <ProfileAvatar
                    nickname={comment.user.nickname}
                    profileImageUrl={comment.user.profileImageUrl}
                    size="md"
                />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">{comment.user.nickname}</span>
                            <span className="text-xs text-gray-500">{formatLocalDateTime(comment.createdAt)}</span>
                            {comment.updatedAt !== comment.createdAt && !isDeleted && (
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
                    {renderComment()}
                    {isReplying && !isDeleted && !replyTarget && (
                        <div className="mt-4">
                            <MessageInput
                                value={replyContent}
                                onChange={setReplyContent}
                                onSubmit={handleSubmitReply}
                                onCancel={handleCancelReply}
                                placeholder="답글을 입력하세요..."
                                maxLength={COMMENT_CONTENT_LIMIT}
                            />
                        </div>
                    )}
                    {comment.replyCount > 0 && (
                        <button
                            onClick={() => setShowReplies(!showReplies)}
                            className="flex items-center gap-2 mt-0.5 text-sm text-pink-600 hover:text-pink-700 transition-colors">
                            {!showReplies && (
                                <>
                                    <span>답글 {comment.replyCount}개 더보기</span>
                                </>
                            )}
                        </button>
                    )}
                    {showReplies && (
                        <div className="mt-4 space-y-4 pl-4 border-l-2 border-pink-100">
                            {replies.map((reply) => (
                                <Fragment key={reply.id}>
                                    <ReplyItem
                                        reply={reply}
                                        onReplyToReply={handleReplyToReply}
                                        onEdit={handleEditReply}
                                        onDelete={handleDeleteReply}
                                    />
                                    {isReplying && replyTarget?.replyId === reply.id && (
                                        <div className="mt-2">
                                            <MessageInput
                                                value={replyContent}
                                                onChange={setReplyContent}
                                                onSubmit={handleSubmitReply}
                                                onCancel={handleCancelReply}
                                                placeholder={
                                                    replyTarget
                                                        ? `@${replyTarget.mentionUser.nickname} 에게 답글 입력...`
                                                        : "답글을 입력하세요..."
                                                }
                                                maxLength={COMMENT_CONTENT_LIMIT}
                                            />
                                        </div>
                                    )}
                                </Fragment>
                            ))}
                            {isRepliesLoading && <LoadingSpinner />}
                            {!isRepliesLoading &&
                                (repliesNextCursor && replies.length < totalReplyCount ? (
                                    <button
                                        onClick={() => fetchReplies(repliesNextCursor)}
                                        className="text-sm text-pink-600 hover:text-pink-700 transition-colors">
                                        답글 더보기
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setShowReplies(false)}
                                        className="flex items-center gap-2 text-sm text-pink-600 hover:text-pink-700 transition-colors">
                                        <span>답글 숨기기</span>
                                    </button>
                                ))}
                        </div>
                    )}
                </div>
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

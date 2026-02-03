"use client";

import ArrowDownIcon from "public/icons/arrow-down-icon.svg";
import ArrowUpIcon from "public/icons/arrow-up-icon.svg";
import { useState } from "react";

import { MessageInput } from "@/components/ui/MessageInput";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";
import { COMMENT_CONTENT_LIMIT } from "@/constants/post";
import { useOutsideClick } from "@/hooks/useClickOutside";
import { formatLocalDateTime } from "@/utils/date";

import { CommentActionMenu } from "./CommentActionMenu";

interface CommentProps {
    comment: PostComment;
    currentUserId: number | null;
}

// TODO: 댓글 수정/삭제, 답글 관련 처리 필요
export function CommentItem({ comment, currentUserId }: CommentProps) {
    const [showReplyInput, setShowReplyInput] = useState<boolean>(false);
    const [showReplies, setShowReplies] = useState<boolean>(false);
    const [replyContent, setReplyContent] = useState<string>("");
    const [isActionMenuOpen, setIsActionMenuOpen] = useState<boolean>(false);
    const actionMenuRef = useOutsideClick(() => setIsActionMenuOpen(false));

    const isAuthor = comment.user.id === currentUserId;
    const isDeleted = !!comment.deletedAt;

    const handleSubmitReply = () => {
        if (!replyContent.trim()) return;

        // TODO: 답글 관련 처리
    };

    const handleActionMenuClick = (action: CommentActionMenuClickType) => {
        switch (action) {
            case "reply":
                setShowReplyInput(!showReplyInput);
                break;
            // TODO: 댓글 수정/삭제 처리
            case "edit":
                console.log("Edit comment", comment.id);
                break;
            case "delete":
                console.log("Delete comment", comment.id);
                break;
        }
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
                        {!isDeleted && (
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
                    {isDeleted ? (
                        <p className="text-gray-400 mb-3 leading-relaxed italic">삭제된 댓글입니다.</p>
                    ) : (
                        <>
                            <p className="text-gray-800 mb-3 leading-relaxed break-words">{comment.content}</p>
                            <button
                                onClick={() => setShowReplyInput(!showReplyInput)}
                                className="text-sm text-gray-500 hover:text-pink-600 transition-colors mb-3">
                                답글 달기
                            </button>
                        </>
                    )}
                    {showReplyInput && !isDeleted && (
                        <div className="mt-4">
                            <MessageInput
                                value={replyContent}
                                onChange={setReplyContent}
                                onSubmit={handleSubmitReply}
                                placeholder="답글을 입력하세요..."
                                maxLength={COMMENT_CONTENT_LIMIT}
                            />
                        </div>
                    )}
                    {comment.replyCount > 0 && (
                        <button
                            onClick={() => setShowReplies(!showReplies)}
                            className="flex items-center gap-2 mt-4 text-sm text-pink-600 hover:text-pink-700 transition-colors">
                            {showReplies ? (
                                <>
                                    <ArrowUpIcon fill={"#e60076"} />
                                    <span>답글 숨기기</span>
                                </>
                            ) : (
                                <>
                                    <ArrowDownIcon fill={"#e60076"} />
                                    <span>답글 {comment.replyCount}개 보기</span>
                                </>
                            )}
                        </button>
                    )}
                    {/* Replies */}
                    {/* {showReplies && hasReplies && (
                        <div className="mt-4 space-y-4 pl-4 border-l-2 border-pink-100">
                            {replies.map((reply) => (
                                <Reply key={reply.id} reply={reply} currentUserId={currentUserId} />
                            ))}
                        </div>
                    )} */}
                </div>
            </div>
        </div>
    );
}

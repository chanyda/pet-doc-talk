"use client";

import { useState } from "react";

import { formatRelativeTime } from "@/utils/date";

import { ProfileAvatar } from "../ui/ProfileAvatar";

interface CommentProps {
    comment: PostComment;
    currentUserId: number;
    onReply?: (commentId: number, reply: CommentReply) => void;
    onEdit?: (commentId: number, content: string) => void;
    onDelete?: (commentId: number) => void;
}

export function CommentItem({ comment, currentUserId, onReply, onEdit, onDelete }: CommentProps) {
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [showReplies, setShowReplies] = useState(false);
    const [replyContent, setReplyContent] = useState("");

    const isAuthor = comment.user.id === currentUserId;
    const hasReplies = comment.replyCount > 0;
    const isDeleted = !!comment.deletedAt;

    const handleSubmitReply = () => {
        if (!replyContent.trim()) return;

        const newReply: CommentReply = {
            id: Date.now(),
            user: {
                id: currentUserId,
                nickname: "현재사용자",
                profileImageUrl: "",
            },
            content: replyContent,
            parentId: comment.id,
            mentionUser: {
                id: comment.user.id,
                nickname: comment.user.nickname,
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            deletedAt: null,
        };

        // setReplies([...replies, newReply]);
        if (onReply) {
            onReply(comment.id, newReply);
        }
        setReplyContent("");
        setShowReplyInput(false);
        setShowReplies(true);
    };

    const handleEdit = () => {
        if (onEdit) {
            const newContent = prompt("댓글을 수정하세요", comment.content);
            if (newContent && newContent.trim()) {
                onEdit(comment.id, newContent);
            }
        }
    };

    const handleDelete = () => {
        if (onDelete && window.confirm("댓글을 삭제하시겠습니까?")) {
            onDelete(comment.id);
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

                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-gray-900">{comment.user.nickname}</span>
                        <span className="text-xs text-gray-500">{formatRelativeTime(comment.createdAt)}</span>
                        {comment.updatedAt !== comment.createdAt && !isDeleted && (
                            <span className="text-xs text-gray-400">(수정됨)</span>
                        )}
                    </div>
                    {isDeleted ? (
                        <p className="text-gray-400 mb-3 leading-relaxed italic">삭제된 댓글입니다</p>
                    ) : (
                        <p className="text-gray-800 mb-3 leading-relaxed">{comment.content}</p>
                    )}
                    {!isDeleted && (
                        <div className="flex items-center gap-3">
                            {/* <button
                                onClick={handleLike}
                                className={`flex items-center gap-1.5 text-sm transition-colors ${
                                    isLiked ? "text-pink-600" : "text-gray-500 hover:text-pink-600"
                                }`}>
                                <HeartIcon className={isLiked ? "fill-current" : ""} />
                                <span>{likeCount > 0 ? likeCount : "공감"}</span>
                            </button> */}

                            <button
                                onClick={() => setShowReplyInput(!showReplyInput)}
                                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-pink-600 transition-colors">
                                {/* <ReplyIcon /> */}
                                <span>답글 달기</span>
                            </button>

                            {isAuthor && (
                                <>
                                    <button
                                        onClick={handleEdit}
                                        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors">
                                        {/* <EditIcon /> */}
                                        <span>수정</span>
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 transition-colors">
                                        {/* <DeleteIcon /> */}
                                        <span>삭제</span>
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                    {showReplyInput && !isDeleted && (
                        <div className="mt-4">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    placeholder="답글을 입력하세요..."
                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
                                    onKeyPress={(e) => {
                                        if (e.key === "Enter") {
                                            handleSubmitReply();
                                        }
                                    }}
                                />
                                <button
                                    onClick={handleSubmitReply}
                                    disabled={!replyContent.trim()}
                                    className="px-4 py-2 text-sm text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{ backgroundColor: "#FF6B9D" }}>
                                    등록
                                </button>
                            </div>
                        </div>
                    )}
                    {hasReplies && (
                        <button
                            onClick={() => setShowReplies(!showReplies)}
                            className="flex items-center gap-2 mt-4 text-sm text-pink-600 hover:text-pink-700 transition-colors">
                            {showReplies ? (
                                <>
                                    {/* <ChevronUpIcon /> */}
                                    <span>답글 숨기기</span>
                                </>
                            ) : (
                                <>
                                    {/* <ChevronDownIcon /> */}
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

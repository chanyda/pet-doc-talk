"use client";

import { useRef, useState } from "react";

import { ProfileAvatar } from "@/components/ui/ProfileAvatar";

import { CommentItem } from "./Comment";

interface CommentSectionProps {
    postId: number;
    currentUserId: number;
    initialComments?: PostComment[];
}

const mockComments: PostComment[] = [
    {
        id: 1,
        content: "너무 귀엽네요! 우리 강아지도 공원 가면 엄청 좋아해요 ㅎㅎ",
        parentId: null,
        user: {
            id: 2,
            nickname: "산책왕",
            profileImageUrl: "",
        },
        replyCount: 2,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        updatedAt: new Date(Date.now() - 3600000).toISOString(),
        deletedAt: null,
    },
    {
        id: 2,
        content: "어느 공원이신가요? 저도 거기 가보고 싶어요!",
        parentId: null,
        user: {
            id: 3,
            nickname: "강아지사랑",
            profileImageUrl: "",
        },
        replyCount: 0,
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        updatedAt: new Date(Date.now() - 7200000).toISOString(),
        deletedAt: null,
    },
    {
        id: 3,
        content: "산책할 때 주의할 점이 있을까요? 저도 곧 데려갈 예정이에요",
        parentId: null,
        user: {
            id: 4,
            nickname: "초보집사",
            profileImageUrl: "",
        },
        replyCount: 1,
        createdAt: new Date(Date.now() - 10800000).toISOString(),
        updatedAt: new Date(Date.now() - 10800000).toISOString(),
        deletedAt: null,
    },
    {
        id: 4,
        content: "사진 너무 예쁘게 잘 나왔어요!",
        parentId: null,
        user: {
            id: 5,
            nickname: "공원러버",
            profileImageUrl: "",
        },
        replyCount: 0,
        createdAt: new Date(Date.now() - 14400000).toISOString(),
        updatedAt: new Date(Date.now() - 14400000).toISOString(),
        deletedAt: null,
    },
    {
        id: 5,
        content: "강아지 품종이 뭐에요? 너무 귀여워요",
        parentId: null,
        user: {
            id: 6,
            nickname: "댕댕이집사",
            profileImageUrl: "",
        },
        replyCount: 0,
        createdAt: new Date(Date.now() - 18000000).toISOString(),
        updatedAt: new Date(Date.now() - 18000000).toISOString(),
        deletedAt: null,
    },
];

export function CommentSection({ postId, currentUserId, initialComments = mockComments }: CommentSectionProps) {
    const [comments, setComments] = useState<PostComment[]>(initialComments);
    const [newComment, setNewComment] = useState("");
    const [displayCount, setDisplayCount] = useState(10);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // const totalComments = comments.reduce((sum, comment) => sum + 1 + comment.replies.length, 0);

    // textarea 높이 자동 조절
    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewComment(e.target.value);

        // 높이 자동 조절
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            const newHeight = textareaRef.current.scrollHeight;
            textareaRef.current.style.height = `${newHeight}px`;

            // 페이지 제일 하단으로 스크롤
            setTimeout(() => {
                window.scrollTo({
                    top: document.documentElement.scrollHeight,
                    behavior: "smooth",
                });
            }, 0);
        }
    };

    const handleSubmitComment = () => {
        if (!newComment.trim()) return;

        const comment: PostComment = {
            id: Date.now(),
            user: {
                id: currentUserId,
                nickname: "현재사용자",
                profileImageUrl: "",
            },
            content: newComment,
            parentId: null,
            replyCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            deletedAt: null,
        };

        setComments([comment, ...comments]);
        setNewComment("");

        // 높이 초기화
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
        }
    };

    const handleLoadMore = () => {
        setDisplayCount((prev) => prev + 10);
    };

    const handleReply = (commentId: number) => {
        setComments(
            comments.map((c) =>
                c.id === commentId
                    ? {
                          ...c,
                          replyCount: c.replyCount + 1,
                      }
                    : c,
            ),
        );
    };

    const displayedComments = comments.slice(0, displayCount);
    const hasMore = displayCount < comments.length;

    return (
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            {/* Header */}
            <div className="flex items-center gap-2 mb-6">
                {/* <MessageSquareIcon style={{ color: "#FF6B9D" }} /> */}
                <h2 className="text-xl">
                    댓글 <span style={{ color: "#FF6B9D" }}>{10}</span>
                </h2>
            </div>

            {/* Comments List */}
            <div className="space-y-6 mb-8">
                {displayedComments.map((comment) => (
                    <CommentItem
                        key={comment.id}
                        comment={comment}
                        currentUserId={currentUserId}
                        onReply={handleReply}
                    />
                ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
                <div className="flex justify-center mb-8">
                    <button
                        onClick={handleLoadMore}
                        className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                        댓글 더보기 ({comments.length - displayCount}개 남음)
                    </button>
                </div>
            )}

            {/* No Comments */}
            {comments.length === 0 && (
                <div className="text-center py-12 mb-8">
                    <p className="text-gray-400">아직 댓글이 없습니다</p>
                    <p className="text-sm text-gray-400 mt-1">첫 댓글을 남겨보세요!</p>
                </div>
            )}

            <div className="border-t border-gray-100 pt-6">
                <div className="flex gap-3 items-end">
                    <ProfileAvatar nickname="나" profileImageUrl={null} size="md" />
                    <div className="flex-1 flex gap-2 items-end">
                        <textarea
                            ref={textareaRef}
                            value={newComment}
                            onChange={handleTextareaChange}
                            placeholder="댓글을 입력하세요..."
                            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-pink-200 transition-all overflow-hidden"
                            rows={1}
                            style={{ minHeight: "42px", maxHeight: "120px" }}
                            onKeyPress={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmitComment();
                                }
                            }}
                        />
                        <button
                            onClick={handleSubmitComment}
                            disabled={!newComment.trim()}
                            className="px-5 py-2.5 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                            style={{ backgroundColor: "#FF6B9D", minHeight: "42px" }}>
                            등록
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

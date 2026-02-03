"use client";

import { useEffect, useRef, useState } from "react";

import { CommunityEmptyState } from "@/components/ui/CommunityEmptyState";
import { HasMoreButton } from "@/components/ui/HasMoreButton";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { MessageInput } from "@/components/ui/MessageInput";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";
import { DEFAULT_PAGE_LIMIT } from "@/constants/common";
import { COMMENT_CONTENT_LIMIT } from "@/constants/post";
import * as api from "@/lib/api";

import { CommentItem } from "./CommentItem";

interface CommentSectionProps {
    postId: number;
    currentUser: User | null;
}

export function CommentSection({ postId, currentUser }: CommentSectionProps) {
    const [comments, setComments] = useState<PostComment[]>([]);
    const [totalParentCommentCount, setTotalParentCommentCount] = useState<number>(0);
    const [totalCommentCount, setTotalCommentCount] = useState<number>(0);
    const [nextCursor, setNextCursor] = useState<number | null>(null);
    const [newContent, setNewContent] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isInitialLoadComplete, setIsInitialLoadComplete] = useState<boolean>(false);
    const [newCommentId, setNewCommentId] = useState<number | null>(null);

    const newCommentRef = useRef<HTMLDivElement>(null);
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const highlightTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const fetchComments = async (cursor?: number) => {
        try {
            setIsLoading(true);

            const params: PaginationQuery = {
                limit: DEFAULT_PAGE_LIMIT,
            };

            if (cursor !== undefined) {
                params.cursor = cursor;
            }

            const { data } = await api.getComments(postId, params);

            setComments((prev) => (cursor !== undefined ? [...prev, ...data.comments] : data.comments));
            setTotalCommentCount(data.totalCommentCount);
            setTotalParentCommentCount(data.totalParentCommentCount);
            setNextCursor(data.nextCursor);
        } catch (error) {
            setComments([]);
            setNextCursor(null);
            console.error("Failed to fetch comments:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const loadComments = async () => {
            await fetchComments();
            setIsInitialLoadComplete(true);
        };

        loadComments();
    }, [postId]);

    // URL hash에서 commentId를 읽어 해당 댓글로 스크롤 및 하이라이트
    // 마이페이지-내댓글에서 내가 작성한 댓글을 클릭하면 해당 댓글로 스크롤 및 하이라이트 해주기 위함
    useEffect(() => {
        if (!isInitialLoadComplete) return;

        const hash = window.location.hash;
        if (hash.startsWith("#comment-")) {
            const commentId = parseInt(hash.replace("#comment-", ""), 10);

            // hash 제거
            window.history.replaceState(null, "", window.location.pathname + window.location.search);

            if (!isNaN(commentId) && comments.some((c) => c.id === commentId)) {
                setNewCommentId(commentId);
                handleNewCommentEffect();
            }
        }
    }, [isInitialLoadComplete]);

    // 컴포넌트 언마운트 시 timeout 정리
    useEffect(() => {
        return () => {
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
            if (highlightTimeoutRef.current) {
                clearTimeout(highlightTimeoutRef.current);
            }
        };
    }, []);

    const handleNewCommentEffect = () => {
        // 이전 스크롤 timeout이 있다면 제거
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }

        // 내가 작성한 새로운 댓글은 제일 상단에 위치하도록 하고 자동 스크롤 해준다.
        scrollTimeoutRef.current = setTimeout(() => {
            if (newCommentRef.current) {
                newCommentRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
            }
            scrollTimeoutRef.current = null;
        }, 100);

        // 이전 하이라이트 timeout이 있다면 제거
        if (highlightTimeoutRef.current) {
            clearTimeout(highlightTimeoutRef.current);
        }

        // 3초 후 하이라이트 제거
        highlightTimeoutRef.current = setTimeout(() => {
            setNewCommentId(null);
            highlightTimeoutRef.current = null;
        }, 3000);
    };

    const handleSubmitComment = async () => {
        if (!newContent.trim() || !currentUser) return;

        try {
            const { data } = await api.createComment(postId, {
                content: newContent,
                parentId: null,
                mentionUserId: null,
            });

            const newComment: PostComment = {
                id: data.id,
                content: data.content,
                parentId: data.parentId,
                user: {
                    id: currentUser.id,
                    nickname: currentUser.nickname,
                    profileImageUrl: currentUser.profileImageUrl,
                },
                replyCount: 0, // 새로 작성된 댓글이므로 replyCount는 0이다.
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
                deletedAt: data.deletedAt,
            };

            setComments([newComment, ...comments]);
            setTotalCommentCount((prev) => prev + 1);
            setTotalParentCommentCount((prev) => prev + 1);
            setNewContent("");
            setNewCommentId(newComment.id);

            handleNewCommentEffect();
        } catch (error) {
            console.error("Failed to create comment:", error);
            alert("댓글 작성에 실패했습니다. 다시 시도해주세요.");
        }
    };

    const handleLoadMore = async () => {
        if (!nextCursor || isLoading) return;

        await fetchComments(nextCursor);
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

    const renderCommentList = () => {
        // 초기 로딩: 댓글이 없고 로딩 중일 때만 스피너 표시
        if (comments.length === 0 && isLoading) {
            return <LoadingSpinner />;
        }

        if (comments.length === 0) {
            return <CommunityEmptyState type="comment" />;
        }

        return (
            <div className="space-y-6 mb-8">
                {comments.map((comment) => (
                    <div
                        key={comment.id}
                        ref={comment.id === newCommentId ? newCommentRef : null}
                        className={`transition-all duration-500 ${
                            comment.id === newCommentId ? "bg-pink-50 -mx-4 px-4 py-3 rounded-lg" : ""
                        }`}>
                        <CommentItem comment={comment} currentUserId={currentUser?.id ?? null} />
                    </div>
                ))}
            </div>
        );
    };

    return (
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-6">
                <h2 className="text-xl">
                    댓글 <span style={{ color: "#FF6B9D" }}>{totalCommentCount}</span>
                </h2>
            </div>
            {renderCommentList()}
            {nextCursor && comments.length < totalParentCommentCount && (
                <HasMoreButton isLoading={isLoading} onClick={handleLoadMore} />
            )}
            {
                <div className="border-t border-gray-100 pt-6 mt-8">
                    <div className="flex gap-3 items-start">
                        <ProfileAvatar
                            nickname={currentUser?.nickname ?? "U"}
                            profileImageUrl={currentUser?.profileImageUrl}
                            size="md"
                        />
                        <MessageInput
                            value={newContent}
                            onChange={setNewContent}
                            onSubmit={handleSubmitComment}
                            placeholder={currentUser ? "댓글을 입력하세요..." : "로그인 후 이용해주세요."}
                            disabled={!currentUser}
                            maxLength={COMMENT_CONTENT_LIMIT}
                        />
                    </div>
                </div>
            }
        </section>
    );
}

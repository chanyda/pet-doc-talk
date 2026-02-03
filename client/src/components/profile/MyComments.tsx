"use client";

import { useRouter } from "next/navigation";
import CommentIcon from "public/icons/comment-icon.svg";
import { useEffect, useState } from "react";

import { DEFAULT_PAGE_LIMIT } from "@/constants/common";
import * as api from "@/lib/api";
import { formatLocalDateTime } from "@/utils/date";

import { CommunityEmptyState } from "../ui/CommunityEmptyState";
import { HasMoreButton } from "../ui/HasMoreButton";
import { LoadingSpinner } from "../ui/LoadingSpinner";

export function MyComments() {
    const router = useRouter();
    const [comments, setComments] = useState<MyComment[]>([]);
    const [nextCursor, setNextCursor] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [totalCommentCount, setTotalCommentCount] = useState<number>(0);

    const fetchMyComments = async (cursor?: number) => {
        try {
            setIsLoading(true);

            const params: PaginationQuery = {
                limit: DEFAULT_PAGE_LIMIT,
            };

            if (cursor !== undefined) {
                params.cursor = cursor;
            }

            const response = await api.getMyComments(params);
            const { comments: newComments, nextCursor: newNextCursor, totalCommentCount } = response.data;

            setComments((prev) => (cursor !== undefined ? [...prev, ...newComments] : newComments));
            setNextCursor(newNextCursor);
            setTotalCommentCount(totalCommentCount);
        } catch (error) {
            setComments([]);
            setNextCursor(null);
            console.error("Failed to fetch comments:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMyComments();
    }, []);

    const handleLoadMore = async () => {
        if (!nextCursor || isLoading) return;

        await fetchMyComments(nextCursor);
    };

    const handleCommentClick = (postId: number, commentId: number) => {
        router.push(`/community/${postId}#comment-${commentId}`);
    };

    const renderMyCommentList = () => {
        // 초기 로딩: 내가 작성한 댓글이 없고 로딩 중일 때만 스피너 표시
        if (comments.length === 0 && isLoading) {
            return <LoadingSpinner />;
        }

        if (comments.length === 0) {
            return <CommunityEmptyState type="comment" />;
        }

        return (
            <div className="space-y-3">
                {comments.map((comment) => (
                    <div
                        key={comment.id}
                        onClick={() => handleCommentClick(comment.post.id, comment.id)}
                        className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100 hover:border-pink-200 p-5">
                        <div className="flex flex-col flex-1 gap-2">
                            <p className="line-clamp-2">{comment.content}</p>
                            <div className="text-xs text-gray-500">{formatLocalDateTime(comment.createdAt)}</div>
                            <div className="flex items-center gap-2">
                                <h4 className="text-sm text-gray-700 line-clamp-1">{comment.post.title}</h4>
                                <div className="flex items-center gap-1">
                                    <CommentIcon width="15px" height="15px" />
                                    <span className="text-xs text-gray-700">{comment.post.commentCount}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div>
            <div className="mb-6">
                <h3 className="text-xl mb-1">내 댓글</h3>
            </div>
            {renderMyCommentList()}
            {nextCursor && comments.length < totalCommentCount && (
                <HasMoreButton isLoading={isLoading} onClick={handleLoadMore} />
            )}
        </div>
    );
}

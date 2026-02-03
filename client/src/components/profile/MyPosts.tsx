"use client";

import { useCursorPostList } from "@/hooks/useCursorPostList";
import * as api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

import { PostItem } from "../community/posts/PostItem";
import { CommunityEmptyState } from "../ui/CommunityEmptyState";
import { HasMoreButton } from "../ui/HasMoreButton";
import { LoadingSpinner } from "../ui/LoadingSpinner";

export function MyPosts() {
    const { user } = useAuthStore();
    const { posts, nextCursor, isLoading, isInitialLoading, totalPostCount, handleLoadMore } = useCursorPostList({
        fetchFn: api.getMyPosts,
    });

    if (!user) return null;

    return (
        <div>
            <div className="mb-6">
                <h3 className="text-xl mb-1">내 게시글</h3>
            </div>
            {isInitialLoading ? (
                <LoadingSpinner />
            ) : (
                <div>
                    <div className="space-y-3">
                        {posts.map((post) => (
                            <PostItem key={post.id} post={post} />
                        ))}
                    </div>
                    {posts.length === 0 && <CommunityEmptyState type="post" />}
                    {nextCursor && posts.length < totalPostCount && (
                        <HasMoreButton isLoading={isLoading} onClick={handleLoadMore} />
                    )}
                </div>
            )}
        </div>
    );
}

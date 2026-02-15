"use client";

import { usePostList } from "@/hooks/usePostList";
import * as api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

import { PostItem } from "../community/posts/PostItem";
import { CommunityEmptyState } from "../ui/CommunityEmptyState";
import { HasMoreButton } from "../ui/HasMoreButton";
import { LoadingSpinner } from "../ui/LoadingSpinner";

export function MyPosts() {
    const { user } = useAuthStore();
    const { posts, nextCursor, isLoading, totalPostCount, handleLoadMore } = usePostList({
        fetchFn: api.getMyPosts,
    });

    if (!user) return null;

    const renderMyPostList = () => {
        if (posts.length === 0 && isLoading) {
            return <LoadingSpinner />;
        }

        if (posts.length === 0) {
            return <CommunityEmptyState type="post" />;
        }

        return (
            <div className="space-y-3">
                {posts.map((post) => (
                    <PostItem key={post.id} post={post} />
                ))}
            </div>
        );
    };

    return (
        <div>
            <div className="mb-6">
                <h3 className="text-xl font-semibold mb-1">내 게시글</h3>
            </div>
            {renderMyPostList()}
            {nextCursor && posts.length < totalPostCount && (
                <HasMoreButton isLoading={isLoading} onClick={handleLoadMore} />
            )}
        </div>
    );
}

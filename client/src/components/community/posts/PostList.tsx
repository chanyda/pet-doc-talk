"use client";

import { useMemo } from "react";

import { CommunityEmptyState } from "@/components/ui/CommunityEmptyState";
import { HasMoreButton } from "@/components/ui/HasMoreButton";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useCursorPostList } from "@/hooks/useCursorPostList";
import * as api from "@/lib/api";

import { PostItem } from "./PostItem";

interface PostListProps {
    categoryId: number | null;
    orderBy: OrderByType;
    searchQuery: string;
}

export function PostList({ categoryId, orderBy, searchQuery }: PostListProps) {
    const queryParams = useMemo(() => {
        const params: Partial<FindPostListQuery> = { orderBy };

        if (categoryId) {
            params.categoryId = categoryId;
        }

        if (searchQuery) {
            params.keyword = searchQuery;
        }

        return params;
    }, [categoryId, orderBy, searchQuery]);

    const { posts, nextCursor, isLoading, totalPostCount, handleLoadMore } = useCursorPostList({
        fetchFn: api.getPosts,
        queryParams,
    });

    const renderPostList = () => {
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
        <>
            {renderPostList()}
            {nextCursor && posts.length < totalPostCount && (
                <HasMoreButton isLoading={isLoading} onClick={handleLoadMore} />
            )}
        </>
    );
}

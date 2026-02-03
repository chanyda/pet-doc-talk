import { useCallback, useEffect, useState } from "react";

import { DEFAULT_PAGE_LIMIT } from "@/constants/common";

interface UseCursorPostListProps {
    fetchFn: (params: FindPostListQuery) => Promise<{ data: PostListResponse }>;
    queryParams?: Partial<FindPostListQuery>;
}

export function useCursorPostList({ fetchFn, queryParams }: UseCursorPostListProps) {
    const [posts, setPosts] = useState<PostSummary[]>([]);
    const [nextCursor, setNextCursor] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [totalPostCount, setTotalPostCount] = useState<number>(0);

    const fetchPosts = useCallback(
        async (cursor?: number) => {
            try {
                setIsLoading(true);

                const params: FindPostListQuery = {
                    limit: DEFAULT_PAGE_LIMIT,
                    ...queryParams,
                };

                if (cursor !== undefined) {
                    params.cursor = cursor;
                }

                const response = await fetchFn(params);
                const { posts: newPosts, nextCursor: newNextCursor, totalPostCount } = response.data;

                setPosts((prev) => (cursor !== undefined ? [...prev, ...newPosts] : newPosts));
                setNextCursor(newNextCursor);
                setTotalPostCount(totalPostCount);
            } catch (error) {
                setPosts([]);
                setNextCursor(null);
                console.error("Failed to fetch posts:", error);
            } finally {
                setIsLoading(false);
            }
        },
        [fetchFn, queryParams],
    );

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const handleLoadMore = async () => {
        if (!nextCursor || isLoading) return;

        await fetchPosts(nextCursor);
    };

    return {
        posts,
        nextCursor,
        isLoading,
        totalPostCount,
        handleLoadMore,
    };
}

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
    const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
    const [totalPostCount, setTotalPostCount] = useState<number>(0);

    const fetchPosts = useCallback(
        async (cursor?: number) => {
            try {
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
            }
        },
        [fetchFn, queryParams],
    );

    useEffect(() => {
        const loadPosts = async () => {
            setIsInitialLoading(true);
            await fetchPosts();
            setIsInitialLoading(false);
        };

        loadPosts();
    }, [fetchPosts]);

    const handleLoadMore = async () => {
        if (!nextCursor || isLoading) return;

        setIsLoading(true);
        await fetchPosts(nextCursor);
        setIsLoading(false);
    };

    return {
        posts,
        nextCursor,
        isLoading,
        isInitialLoading,
        totalPostCount,
        handleLoadMore,
    };
}

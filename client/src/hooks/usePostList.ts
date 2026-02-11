import { DEFAULT_PAGE_LIMIT } from "@/constants/common";

import { useCursorPagination } from "./useCursorPagination";

interface UsePostListProps {
    fetchFn: (params: FindPostListQuery) => Promise<{ data: PostListResponse }>;
    queryParams?: Partial<FindPostListQuery>;
}

export function usePostList({ fetchFn, queryParams }: UsePostListProps) {
    const { items, nextCursor, isLoading, totalCount, handleLoadMore } = useCursorPagination<
        PostSummary,
        PostListResponse
    >({
        fetchFn,
        extractItems: (response) => response.posts,
        extractNextCursor: (response) => response.nextCursor,
        extractTotalCount: (response) => response.totalPostCount,
        queryParams: {
            limit: DEFAULT_PAGE_LIMIT,
            ...queryParams,
        },
    });

    return {
        posts: items,
        nextCursor,
        isLoading,
        totalPostCount: totalCount,
        handleLoadMore,
    };
}

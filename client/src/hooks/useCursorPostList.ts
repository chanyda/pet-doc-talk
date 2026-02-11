import { useCursorPagination } from "./useCursorPagination";
import { DEFAULT_PAGE_LIMIT } from "@/constants/common";

interface UseCursorPostListProps {
    fetchFn: (params: FindPostListQuery) => Promise<{ data: PostListResponse }>;
    queryParams?: Partial<FindPostListQuery>;
}

export function useCursorPostList({ fetchFn, queryParams }: UseCursorPostListProps) {
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

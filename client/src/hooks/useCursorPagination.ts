import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface UseCursorPaginationProps<T, TResponse> {
    fetchFn: (params: PaginationQuery) => Promise<{ data: TResponse }>;
    extractItems: (response: TResponse) => T[];
    extractNextCursor: (response: TResponse) => number | null;
    extractTotalCount: (response: TResponse) => number;
    queryParams?: Partial<PaginationQuery>;
}

export function useCursorPagination<T, TResponse>({
    fetchFn,
    extractItems,
    extractNextCursor,
    extractTotalCount,
    queryParams = {},
}: UseCursorPaginationProps<T, TResponse>) {
    const [items, setItems] = useState<T[]>([]);
    const [nextCursor, setNextCursor] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [totalCount, setTotalCount] = useState<number>(0);

    const extractItemsRef = useRef(extractItems);
    const extractNextCursorRef = useRef(extractNextCursor);
    const extractTotalCountRef = useRef(extractTotalCount);

    useEffect(() => {
        extractItemsRef.current = extractItems;
        extractNextCursorRef.current = extractNextCursor;
        extractTotalCountRef.current = extractTotalCount;
    });

    const queryParamsKey = useMemo(() => JSON.stringify(queryParams), [queryParams]);

    const fetchItems = useCallback(
        async (cursor?: number) => {
            try {
                setIsLoading(true);

                const params = JSON.parse(queryParamsKey);
                const response = await fetchFn({
                    ...params,
                    cursor,
                } as PaginationQuery);

                const newItems = extractItemsRef.current(response.data);
                const newNextCursor = extractNextCursorRef.current(response.data);
                const newTotalCount = extractTotalCountRef.current(response.data);

                setItems((prev) => (cursor ? [...prev, ...newItems] : newItems));
                setNextCursor(newNextCursor);
                setTotalCount(newTotalCount);
            } catch (error) {
                console.error("Failed to fetch items:", error);
            } finally {
                setIsLoading(false);
            }
        },
        [fetchFn, queryParamsKey],
    );

    const handleLoadMore = useCallback(() => {
        if (nextCursor && !isLoading) {
            fetchItems(nextCursor);
        }
    }, [nextCursor, isLoading, fetchItems]);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    return { items, nextCursor, isLoading, totalCount, handleLoadMore };
}

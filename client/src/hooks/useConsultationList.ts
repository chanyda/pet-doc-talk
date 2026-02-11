import { DEFAULT_PAGE_LIMIT } from "@/constants/common";
import { getConsultations } from "@/lib/api";

import { useCursorPagination } from "./useCursorPagination";

export function useConsultationList() {
    const { items, nextCursor, isLoading, totalCount, handleLoadMore } = useCursorPagination<
        ConsultationItem,
        ConsultationListResponse
    >({
        fetchFn: getConsultations,
        extractItems: (response) => response.consultations,
        extractNextCursor: (response) => response.nextCursor,
        extractTotalCount: (response) => response.totalConsultationCount,
        queryParams: {
            limit: DEFAULT_PAGE_LIMIT,
        },
    });

    return {
        consultations: items,
        nextCursor,
        isLoading,
        totalConsultationCount: totalCount,
        handleLoadMore,
    };
}

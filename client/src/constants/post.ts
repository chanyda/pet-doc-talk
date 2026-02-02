export const POST_ORDER_BY_OPTIONS = [
    { id: "createdAt", label: "최신순" },
    { id: "likeCount", label: "인기순" },
    { id: "viewCount", label: "조회순" },
] as Array<{ id: OrderByType; label: string }>;

export const POST_SEARCH_KEYWORD_LIMIT = 100 as const;

export const POST_TITLE_LIMIT = 255 as const;

export const POST_CONTENT_LIMIT = 10000 as const;

export const COMMENT_CONTENT_LIMIT = 500 as const;

export const POSTS_LIMIT = 10 as const;

export const POST_ORDER_BY_OPTIONS = [
    { id: "createdAt", label: "최신순" },
    { id: "likeCount", label: "인기순" },
    { id: "viewCount", label: "조회순" },
] as Array<{ id: OrderByType; label: string }>;

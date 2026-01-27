export const POSTS_LIMIT = 10 as const;

export const POST_CATEGORY_COLOR: { [key: number]: string } = {
    1: "bg-blue-100 text-blue-700",
    2: "bg-purple-100 text-purple-700",
    3: "bg-green-100 text-green-700",
    4: "bg-orange-100 text-orange-700",
};

export const POST_ORDER_BY_OPTIONS = [
    { id: "createdAt", label: "최신순" },
    { id: "likeCount", label: "인기순" },
    { id: "viewCount", label: "조회순" },
] as Array<{ id: OrderByType; label: string }>;

interface PostUser {
    id: number;
    nickname: string;
    profileImageUrl: string;
}

interface PostCategory {
    id: number;
    name: string;
}

interface PostSummary {
    id: number;
    title: string;
    viewCount: number;
    commentCount: number;
    createdAt: string;
    updatedAt: string;
    user: PostUser;
    category: PostCategory;
}

interface PostListResponse {
    posts: PostSummary[];
    nextCursor: number | null;
}

type OrderByType = "createdAt" | "likeCount" | "viewCount";

interface FindPostListQuery {
    categoryId?: number;
    keyword?: string;
    orderBy?: OrderByType;
    cursor?: number;
    limit: number;
}

interface Category {
    id: number;
    name: string;
}

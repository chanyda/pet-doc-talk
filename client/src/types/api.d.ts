interface PaginationQuery {
    limit: number;
    cursor?: number;
}
interface FindPostListQuery extends PaginationQuery {
    categoryId?: number;
    keyword?: string;
    orderBy?: OrderByType;
}

interface PostListResponse {
    posts: PostSummary[];
    nextCursor: number | null;
}

interface CreateCommentBody {
    content: string;
    parentId: number | null;
    mentionUserId: number | null;
}

interface CommentListResponse {
    comments: PostComment[];
    nextCursor: number | null;
    totalParentCommentCount: number;
    totalCommentCount: number;
}
interface ReplyListResponse {
    replies: CommentReply[];
    nextCursor: number | null;
}

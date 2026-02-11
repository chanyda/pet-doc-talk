interface PaginationQuery {
    limit: number;
    cursor?: number;
}
interface FindPostListQuery extends PaginationQuery {
    categoryId?: number;
    keyword?: string;
    orderBy?: OrderByType;
}

interface UpdateProfileBody {
    nickname?: string;
    profileImageUrl?: string;
}

interface PostListResponse {
    posts: PostSummary[];
    nextCursor: number | null;
    totalPostCount: number;
}

interface CreateCommentBody {
    content: string;
    parentId: number | null;
    mentionUserId: number | null;
}

interface UpdateCommentBody {
    content: string;
}

interface CommentListResponse {
    comments: PostComment[];
    nextCursor: number | null;
    totalParentCommentCount: number;
    totalCommentCount: number;
}

interface MyCommentListResponse {
    comments: MyComment[];
    nextCursor: number | null;
    totalCommentCount: number;
}

interface ReplyListResponse {
    replies: CommentReply[];
    totalReplyCount: number;
    nextCursor: number | null;
}

interface CreatePostBody {
    categoryId: number;
    title: string;
    content: string;
}

interface UpdatePostBody {
    categoryId?: number;
    title?: string;
    content?: string;
}

interface ConsultationListResponse {
    consultations: Array<ConsultationItem>;
    totalConsultationCount: number;
    nextCursor: number | null;
}


interface CreateConsultationBody {
    petId: number;
}


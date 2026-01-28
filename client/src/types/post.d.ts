interface PostUser {
    id: number;
    nickname: string;
    profileImageUrl: string | null;
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

interface Category {
    id: number;
    name: string;
}

interface PostDetail {
    id: number;
    title: string;
    content: string;
    viewCount: number;
    createdAt: string;
    updatedAt: string;
    user: PostUser;
    category: PostCategory;
}

interface PostComment {
    id: number;
    content: string;
    parentId: number | null;
    user: PostUser;
    replyCount: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

interface CommentListResponse {
    comments: PostComment[];
    nextCursor: number | null;
}

interface MentionUser {
    id: number;
    nickname: string;
}

interface CommentReply {
    id: number;
    content: string;
    parentId: number | null;
    user: PostUser;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    mentionUser: MentionUser;
}

interface ReplyListResponse {
    replies: CommentReply[];
    nextCursor: number | null;
}

interface Comment {
    id: number;
    postId: number;
    userId: number;
    parentId: number | null;
    mentionUserId: number | null;
    content: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

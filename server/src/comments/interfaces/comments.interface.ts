export interface IComment {
    id: number;
    postId: number;
    userId: number;
    parentId: number | null;
    mentionUserId: number | null;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

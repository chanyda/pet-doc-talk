export const COMMENT_SELECT = {
    id: true,
    content: true,
    parentId: true,
    user: {
        select: { id: true, nickname: true, profileImageUrl: true },
    },
    _count: { select: { replies: true } },
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
};

export type CommentSelect = typeof COMMENT_SELECT;

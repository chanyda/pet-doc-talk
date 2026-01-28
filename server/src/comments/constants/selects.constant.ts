export const COMMENT_BASE_SELECT = {
    id: true,
    content: true,
    parentId: true,
    user: { select: { id: true, nickname: true, profileImageUrl: true } },
    mentionUser: { select: { id: true, nickname: true } },
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
};

export const COMMENT_SELECT = {
    ...COMMENT_BASE_SELECT,
    _count: { select: { replies: true } },
};

export const MY_COMMENT_SELECT = {
    id: true,
    content: true,
    post: {
        select: {
            id: true,
            title: true,
            _count: {
                select: {
                    comments: { where: { deletedAt: null } },
                },
            },
        },
    },
    createdAt: true,
    updatedAt: true,
};

export type CommentSelect = typeof COMMENT_SELECT;
export type MyCommentSelect = typeof MY_COMMENT_SELECT;

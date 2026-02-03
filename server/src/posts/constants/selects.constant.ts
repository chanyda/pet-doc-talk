import { PostSelect } from "generated/prisma/models";

// TODO: 좋아요 기능 추가 시 실제 likeCount, isLiked 계산
export const POST_SUMMARY_SELECT = {
    id: true,
    title: true,
    viewCount: true,
    createdAt: true,
    updatedAt: true,
    user: {
        select: { id: true, nickname: true, profileImageUrl: true },
    },
    category: {
        select: { id: true, name: true },
    },
    _count: {
        select: {
            comments: {
                where: { deletedAt: null },
            },
        },
    },
} as PostSelect;

export const POST_DETAIL_SELECT = {
    id: true,
    title: true,
    content: true,
    viewCount: true,
    createdAt: true,
    updatedAt: true,
    user: {
        select: { id: true, nickname: true, profileImageUrl: true },
    },
    category: {
        select: { id: true, name: true },
    },
} as PostSelect;

export type PostSummarySelect = typeof POST_SUMMARY_SELECT;

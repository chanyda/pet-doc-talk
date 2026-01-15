export const POST_SUMMARY_SELECT = {
    id: true,
    title: true,
    viewCount: true,
    createdAt: true,
    updatedAt: true,
    user: {
        select: { id: true, nickname: true },
    },
    category: {
        select: { id: true, name: true },
    },
};

// TODO: 좋아요와 댓글 기능 추가 시 실제 likeCount, commentCount, isLiked 계산
export const POST_DETAIL_SELECT = {
    ...POST_SUMMARY_SELECT,
    content: true,
    user: {
        select: { id: true, nickname: true, profileImageUrl: true },
    },
};

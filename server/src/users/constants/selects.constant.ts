export const USER_PROFILE_SELECT = {
    id: true,
    email: true,
    name: true,
    nickname: true,
    profileImageUrl: true,
    _count: {
        select: {
            posts: true,
            comments: true,
            // TODO: 상담 기능 추가되면 내가 요청한 상담개수도 보여주도록 하자
        },
    },
};

export type UserProfileSelect = typeof USER_PROFILE_SELECT;

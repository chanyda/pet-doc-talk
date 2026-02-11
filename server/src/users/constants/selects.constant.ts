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
            consultations: true,
        },
    },
};

export type UserProfileSelect = typeof USER_PROFILE_SELECT;

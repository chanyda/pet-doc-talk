export const CONSULTATION_SELECT = {
    id: true,
    userId: true,
    pet: {
        select: { id: true, name: true, type: true, imageUrl: true },
    },
    title: true,
    createdAt: true,
} as const;

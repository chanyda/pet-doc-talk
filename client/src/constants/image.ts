export const IMAGE_FOLDER = {
    PET: "pet",
    PROFILE: "profile",
} as const;

export type ImageFolderType = (typeof IMAGE_FOLDER)[keyof typeof IMAGE_FOLDER];

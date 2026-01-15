export const PET_SUMMARY_SELECT = {
    id: true,
    name: true,
    type: true,
    gender: true,
    breed: true,
    imageUrl: true,
};

export const PET_DETAIL_SELECT = {
    ...PET_SUMMARY_SELECT,
    weight: true,
    birthDate: true,
    isNeutered: true,
};

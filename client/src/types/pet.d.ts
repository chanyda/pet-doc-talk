type PetType = "DOG" | "CAT";

type PetGender = "FEMALE" | "MALE";

interface Pet {
    id: number;
    name: string;
    type: PetType;
    gender: PetGender;
    breed: string;
    imageUrl: string | null;
}

interface PetRegistrationFormData {
    name: string;
    type: PetType;
    gender: PetGender;
    breed: string;
    imageUrl?: string;
    weight?: number;
    birthday?: Date;
    isNeutered?: boolean;
}

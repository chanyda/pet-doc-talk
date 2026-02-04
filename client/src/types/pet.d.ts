type PetType = "DOG" | "CAT";

type PetGender = "FEMALE" | "MALE";

interface Pet {
    id: number;
    name: string;
    type: PetType;
    gender: PetGender;
    breed: string;
    imageUrl?: string | null;
    weight?: number | null;
    birthDate?: string | null;
    isNeutered?: boolean | null;
}

interface PetRegistrationFormData {
    name: string;
    type: PetType;
    gender: PetGender;
    breed: string;
    imageUrl?: string | null;
    weight?: number | null;
    birthDate?: string | null;
    isNeutered?: boolean | null;
}

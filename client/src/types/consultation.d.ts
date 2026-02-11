interface Consultation {
    id: number;
    userId: number;
    petId: number;
    title: string;
    createdAt: string;
    updatedAt: string;
}

interface ConsultationItem {
    id: number;
    userId: number;
    pet: {
        id: number;
        name: string;
        type: PetType;
        imageUrl: string | null;
    };
    title: string | null;
    createdAt: string;
}

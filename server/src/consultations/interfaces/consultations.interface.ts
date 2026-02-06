export interface IConsultation {
    id: number;
    userId: number;
    petId: number;
    title: string | null;
    createdAt: Date;
    updatedAt: Date;
}

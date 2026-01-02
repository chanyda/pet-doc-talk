import { Decimal } from "@prisma/client/runtime/index-browser";
import { PetGender, PetType } from "generated/prisma/enums";

export interface IPet {
    id: number;
    userId: number;
    name: string;
    type: PetType;
    gender: PetGender;
    breed: string;
    weight?: Decimal | null;
    birthDate?: Date | null;
    isNeutered?: boolean | null;
    imageUrl?: string | null;
    createdAt: Date;
    updatedAt: Date;
}

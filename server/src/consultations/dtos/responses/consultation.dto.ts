import { ApiProperty } from "@nestjs/swagger";

export class ConsultationDto {
    @ApiProperty({ description: "The ID of consultation." })
    id: number;

    @ApiProperty({ description: "The ID of user." })
    userId: number;

    @ApiProperty({ description: "The ID of pet." })
    petId: number;

    @ApiProperty({ description: "The title of consultation.", nullable: true, required: false })
    title: string | null;

    @ApiProperty({ type: Date, description: "The creation date of consultation." })
    createdAt: Date;

    @ApiProperty({ type: Date, description: "The update date of consultation." })
    updatedAt: Date;
}

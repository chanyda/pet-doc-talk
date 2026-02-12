import { ApiProperty } from "@nestjs/swagger";

export class MyPointItemDto {
    @ApiProperty({ description: "Point amount." })
    amount: number;
}

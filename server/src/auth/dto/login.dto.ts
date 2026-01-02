import { IsEmail, IsEnum, IsString, MaxLength, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { LoginFrom } from "generated/prisma/enums";

export class LoginDto {
    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty({ description: "The name of user.", minLength: 2, maxLength: 100 })
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    name: string;

    @ApiProperty({ description: "Social login route.", enum: LoginFrom })
    @IsEnum(LoginFrom)
    loginFrom: LoginFrom;
}

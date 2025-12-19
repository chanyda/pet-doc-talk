import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsJWT, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { LoginFrom } from "src/auth/auth.enums";

export class CreateUserDto {
    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty({ description: "The name of user.", minLength: 2, maxLength: 100 })
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: "Social login route.", enum: LoginFrom })
    @IsEnum(LoginFrom)
    loginFrom: LoginFrom;

    @ApiProperty()
    @IsJWT()
    refreshToken: string;
}

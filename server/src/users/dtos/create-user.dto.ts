import { IsEmail, IsEnum, IsJWT, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { LoginFrom } from "src/auth/auth.enums";

export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(2)
    @MaxLength(100)
    @IsNotEmpty()
    name: string;

    @IsEnum(LoginFrom)
    loginFrom: LoginFrom;

    @IsJWT()
    refreshToken: string;
}

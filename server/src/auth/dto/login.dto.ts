import { IsEmail, IsEnum, IsString, MaxLength } from "class-validator";
import { LoginFrom } from "../auth.enums";

export class LoginDto {
    @IsEmail()
    email: string;

    @IsString()
    @MaxLength(100)
    name: string;

    @IsEnum(LoginFrom)
    loginFrom: LoginFrom;
}

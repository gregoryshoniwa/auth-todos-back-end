import { IsEmail, IsString } from "class-validator";

export class LoginResponseAuthDto {
    @IsString()
    userId: string;
    @IsString()
    token: string;
    @IsString()
    refreshToken: string;
}

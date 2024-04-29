
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class UpdateUserPasswordDto {
    @IsNotEmpty()
    @IsStrongPassword()
    password: string;
}

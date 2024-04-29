import { IsEmail, IsEnum, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";
import { UserRole } from "../entities/user.entity";

export class CreateUserDto {
    @IsString()
    firstName: string;
    @IsString()
    lastName: string;
    @IsEmail()
    email: string;
    @IsNotEmpty()
    @IsStrongPassword()
    password: string;
    @IsEnum(UserRole, {
        message: 'role must be one of the defined user roles'
    })
    role: UserRole;
}

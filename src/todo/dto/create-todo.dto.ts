import { IsBoolean, IsNotEmpty, IsNumberString, IsString } from "class-validator";
import { User } from "src/user/entities/user.entity";

export class CreateTodoDto {
    @IsString()
    title: string;
    @IsString()
    description: string;
    @IsNotEmpty()
    user: number;
}

import { PartialType } from '@nestjs/mapped-types';
import { CreateTodoDto } from './create-todo.dto';
import { DeepPartial } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class UpdateTodoDto {
    @IsString()
    title?: string;
    @IsString()
    description?: string;
    @IsBoolean()
    completed : boolean;
   
}

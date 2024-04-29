import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Todo } from './entities/todo.entity';
import { User } from 'src/user/entities/user.entity';
import { ResponseTodoDto } from './dto/response-todo.dto';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(createTodoDto: CreateTodoDto): Promise<ResponseTodoDto> {
    const id = createTodoDto.user; 
    if (!id) {
        throw new BadRequestException('User ID is required');
    }

    const foundUser = await this.userRepository.findOne({ where: { id } });
    if (!foundUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
    }

    const newTodo = this.todoRepository.create({
     ...createTodoDto,
      user: foundUser,
    });

    const todoResponse = await this.todoRepository.save(newTodo);
    return {
     id: todoResponse.id,
     title: todoResponse.title,
     description: todoResponse.description,
     completed: todoResponse.completed,
     createdAt: todoResponse.createdAt,
     updatedAt: todoResponse.updatedAt,
     userId: todoResponse.user.id.toString(),
     userEmail: todoResponse.user.email
 
   };
  }

  async findAll() : Promise<ResponseTodoDto[]> {
    const todos = await this.todoRepository.find({
      relations: ['user'] // Specify the relationship to eagerly load
    });
    return todos.map(todo => ({
      id: todo.id,
      title: todo.title,
      completed: todo.completed,
      description: todo.description,
      createdAt: todo.createdAt,
      updatedAt: todo.updatedAt,
      userId: todo.user.id.toString(),
      userEmail: todo.user.email
    }));

  }

  async findOne(id: number) : Promise<ResponseTodoDto> {
    const todo = await this.todoRepository.findOne({
      where: { id },
      relations: ['user'] // Specify the relationship to eagerly load
    });
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    return {
      id: todo.id,
      title: todo.title,
      completed: todo.completed,
      description: todo.description,
      createdAt: todo.createdAt,
      updatedAt: todo.updatedAt,
      userId: todo.user.id.toString(),
      userEmail: todo.user.email
    }
  }
  async findAllByUserId(userId: number) : Promise<ResponseTodoDto[]> {
    const todos = await this.todoRepository.find({
      where: { user: { id: userId } },
      relations: ['user'] // Specify the relationship to eagerly load
    });
    if (!todos || todos.length === 0) {
      throw new NotFoundException(`Todos for userId ${userId} not found`);
    }
    return todos.map(todo => ({
      id: todo.id,
      title: todo.title,
      completed: todo.completed,
      description: todo.description,
      createdAt: todo.createdAt,
      updatedAt: todo.updatedAt,
      userId: todo.user.id.toString(),
      userEmail: todo.user.email
    }));
  }

  async update(id: number, updateTodoDto: UpdateTodoDto) : Promise<ResponseTodoDto> {
    const checkTodo = await this.todoRepository.findOne({ where: { id } }); // Check if todo exists
    if (!checkTodo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
  
    const todo: Todo = new Todo();
    todo.id = id;
    todo.title = updateTodoDto.title;
    todo.description = updateTodoDto.description;
    todo.completed = updateTodoDto.completed;
   
    const newTodo = this.todoRepository.create(todo);
 
    const todoResponse = await this.todoRepository.save(newTodo);
    return {
     id: todoResponse.id,
     title: todoResponse.title,
     description: todoResponse.description,
     completed: todoResponse.completed,
     createdAt: todoResponse.createdAt,
     updatedAt: todoResponse.updatedAt,
    //  userId: await todoResponse.user.id.toString(),
    //  userEmail: await todoResponse.user.email
 
   };
  }

  async remove(id: number) : Promise<String>{
    const todo = await this.todoRepository.findOne({ where: { id } }); // Check if todo exists
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    await this.todoRepository.remove(todo); // Remove the todo
    return `Todo with ID ${id} was successfully removed`;
  }
}
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ResponseUserDto } from './dto/response-user.dto';
import * as bcrypt from 'bcryptjs';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  
  async create(createUserDto: CreateUserDto): Promise<ResponseUserDto> {
    
    const user: User = new User();
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;
    user.email = createUserDto.email;
    user.password = hashedPassword
    user.role = createUserDto.role;

    const newUser = this.userRepository.create(user);
    const userResponse = await this.userRepository.save(newUser);
     return {
      id: userResponse.id,
      fistName: userResponse.firstName,
      lastName: userResponse.lastName,
      email: userResponse.email,
      role: userResponse.role 
    };
  }

  async findAll(): Promise<ResponseUserDto[]> {
    const users = await this.userRepository.find();
    return users.map(user => ({
      id: user.id,
      fistName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role 
    }));
  }

  async findOne(id: number): Promise<ResponseUserDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return {
      id: user.id,
      fistName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role 
    };
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<ResponseUserDto> {
    const checkUser = await this.userRepository.findOne({ where: { id } });
    if (!checkUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const user: User = new User();
    user.id = id;
    user.firstName = updateUserDto.firstName;
    user.lastName = updateUserDto.lastName;
    user.email = updateUserDto.email;
    user.role = updateUserDto.role;

    const newUser = this.userRepository.create(user);
    const userResponse = await this.userRepository.save(newUser);
     return {
      id: userResponse.id,
      fistName: userResponse.firstName,
      lastName: userResponse.lastName,
      email: userResponse.email,
      role: userResponse.role 
    };
  }

  async updatePassword(id: number, updateUserDto: UpdateUserPasswordDto): Promise<String> {
    const checkUser = await this.userRepository.findOne({ where: { id } });
    if (!checkUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);

    const user: User = new User();
    user.id = id;
    user.password = hashedPassword;
   
    const userResponse = await this.userRepository.save(user);
     return "Password updated successfully for user " + userResponse.id;
  }

  async remove(id: number): Promise<String> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    await this.userRepository.remove(user); // Remove the user
    return `User with ID ${id} was successfully removed`;
  }
}

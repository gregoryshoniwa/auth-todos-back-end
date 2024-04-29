import { Injectable, UnauthorizedException } from '@nestjs/common';

import { LoginAuthDto } from './dto/login-auth.dto';
import { LoginResponseAuthDto } from './dto/login-response-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService
  ) {}
  async loginUser(loginAuthDto: LoginAuthDto) : Promise<LoginResponseAuthDto> {
    const { email, password } = loginAuthDto;
    const user: User = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }
    const payload = { email: user.email, sub: user.id,role : user.role };
    const accessToken = await this.jwtService.signAsync(payload,{ expiresIn: '240s' });
    const refreshToken = await this.jwtService.signAsync(payload,{ expiresIn: '1h' });
    return {
      userId: user.id.toString(),
      token: accessToken,
      refreshToken: refreshToken
    };
    
    
  }

}

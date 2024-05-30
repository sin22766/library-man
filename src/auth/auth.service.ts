import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

import { JWTPayloadDto } from './dto/payload.dto';
import { TokenDto } from './dto/token.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(
    email: string,
    firstName: string,
    lastName: string,
    password: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersService.createMember(
      email,
      firstName,
      lastName,
      password,
    );

    if (!user) {
      return null;
    }

    delete (user as { password?: string }).password;

    return user;
  }

  async login(user: User): Promise<TokenDto> {
    const payload: JWTPayloadDto = {
      id: user.id,
      email: user.email,
      roles: user.roles,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      return null;
    }

    const isPasswordMatching = await bcrypt.compare(password, user.password);

    if (!isPasswordMatching) {
      return null;
    }

    delete (user as { password?: string }).password;

    return user;
  }
}

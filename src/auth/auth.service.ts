import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

import { JWTPayload } from './types/payload.type';

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

  async login(user: User): Promise<{ access_token: string }> {
    const payload: JWTPayload = {
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

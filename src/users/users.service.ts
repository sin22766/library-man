import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User, UserRole } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findById(id: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email });
  }

  async createMember(
    email: string,
    firstName: string,
    lastName: string,
    password: string,
  ): Promise<User> {
    const existUser = await this.findByEmail(email);

    if (existUser) {
      throw new UnauthorizedException('User already exists');
    }

    // TODO: Validate email, firstName, lastName, and password
    // TODO: Find a better way to promote a user to staff
    const user: User = this.usersRepository.create({
      email,
      firstName,
      lastName,
      password,
      role: UserRole.MEMBER,
    });

    await this.usersRepository.save(user);

    return user;
  }
}

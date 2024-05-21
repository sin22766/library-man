import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthUser } from 'src/users/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';

import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { JWTAuthGuard } from './guards/jwt.guard';
import { LocalAuthGuard } from './guards/local.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.authService.register(
      registerDto.email,
      registerDto.firstName,
      registerDto.lastName,
      registerDto.password,
    );

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  login(@AuthUser() user: User): Promise<{ access_token: string }> {
    return this.authService.login(user);
  }

  @Get('profile')
  @UseGuards(JWTAuthGuard)
  profile(@AuthUser() user: User): User {
    return user;
  }
}

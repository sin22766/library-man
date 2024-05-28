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
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthUser } from 'src/users/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { TokenDto } from './dto/token.dto';
import { JWTAuthGuard } from './guards/jwt.guard';
import { LocalAuthGuard } from './guards/local.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'User registered successfully' })
  @ApiUnauthorizedResponse({ description: 'User already exists' })
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
      throw new UnauthorizedException('User already exists');
    }

    return user;
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ description: 'Login successful', type: TokenDto })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  login(@AuthUser() user: User): Promise<TokenDto> {
    return this.authService.login(user);
  }

  @Get('profile')
  @UseGuards(JWTAuthGuard)
  @ApiOkResponse({ description: 'User profile', type: User })
  @ApiUnauthorizedResponse()
  @ApiBearerAuth()
  profile(@AuthUser() user: User): User {
    return user;
  }
}

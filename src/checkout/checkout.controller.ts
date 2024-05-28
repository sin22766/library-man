import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JWTAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/users/entities/user.entity';

@Controller('checkout')
@ApiTags('checkout')
export class CheckoutController {
  @Post()
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles(UserRole.MEMBER)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Checkout complete' })
  async checkout() {
    return 'Checkout';
  }

  @Post('return')
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles(UserRole.MEMBER)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Return complete' })
  async return() {
    return 'return';
  }
}

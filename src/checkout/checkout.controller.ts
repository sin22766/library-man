import {
  Body,
  Controller,
  NotFoundException,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JWTAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/users/entities/user.entity';

import { CheckoutService } from './checkout.service';
import { CheckoutBookDto } from './dto/checkout-book.dto';
import { ReturnBookDto } from './dto/return-book.dto';
import { Checkout } from './entities/checkout.entity';

@Controller('checkout')
@ApiTags('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post()
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles(UserRole.MEMBER)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Checkout complete' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async checkout(@Body() checkoutBookDto: CheckoutBookDto) {
    return this.checkoutService.checkout(
      checkoutBookDto.bookCopyId,
      checkoutBookDto.userId,
      checkoutBookDto.startDate,
      checkoutBookDto.endDate,
    );
  }

  @Post('return')
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles(UserRole.MEMBER)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Return complete', type: Checkout })
  @ApiNotFoundResponse({ description: 'Checkout not found' })
  async returnBook(@Body() returnBookDto: ReturnBookDto) {
    const { bookId, userId } = returnBookDto;
    const result = await this.checkoutService.returnBook(bookId, userId);

    if (!result) {
      throw new NotFoundException('Checkout not found');
    }

    return result;
  }
}

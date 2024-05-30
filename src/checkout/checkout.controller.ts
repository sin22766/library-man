import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Query,
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
import { FindAllCheckoutDto } from './dto/find-all-checkout.dto';

@Controller('checkout')
@ApiTags('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Get()
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles(UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Found checkout' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async findALl(@Query() query: FindAllCheckoutDto) {
    return this.checkoutService.findAll(query);
  }

  @Post()
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles(UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Checkout complete' })
  @ApiNotFoundResponse({
    description: 'Book copy not available',
  })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async checkout(@Body() checkoutBookDto: CheckoutBookDto) {
    const checkout = await this.checkoutService.checkout(checkoutBookDto);

    if (!checkout) {
      throw new NotFoundException('Book copy not available');
    }
  }

  @Post('return')
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles(UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Return complete', type: Checkout })
  @ApiNotFoundResponse({ description: 'Checkout not found' })
  async returnBook(@Body() returnBookDto: ReturnBookDto) {
    const result = await this.checkoutService.returnBook(returnBookDto);

    if (!result) {
      throw new NotFoundException('Checkout not found');
    }

    return result;
  }
}

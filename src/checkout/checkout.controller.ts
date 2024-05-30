import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiForbiddenResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JWTAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/users/entities/user.entity';
import { CheckoutBookDto } from './dto/checkout-book.dto';
import { CheckoutService } from './checkout.service';
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
  @ApiOkResponse({ description: 'Return complete' })
  async returnBook(@Body() returnBookDto: ReturnBookDto) {
    const { bookId, userId } = returnBookDto;
    try {
      const result = await this.checkoutService.returnBook(bookId, userId);
      return { message: result };
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}

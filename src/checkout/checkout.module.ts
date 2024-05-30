import { BooksModule } from 'src/books/books.module';
import { Checkout } from './entities/checkout.entity';
import { CheckoutController } from './checkout.controller';
import { CheckoutService } from './checkout.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Checkout, User]), BooksModule],
  controllers: [CheckoutController],
  providers: [CheckoutService],
})
export class CheckoutModule {}

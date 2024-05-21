import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksModule } from 'src/books/books.module';

import { CheckoutController } from './checkout.controller';
import { CheckoutService } from './checkout.service';
import { Checkout } from './entities/checkout.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Checkout]), BooksModule],
  controllers: [CheckoutController],
  providers: [CheckoutService],
})
export class CheckoutModule {}

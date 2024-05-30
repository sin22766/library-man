import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Checkout } from './entities/checkout.entity';

@Injectable()
export class CheckoutService {
  constructor(
    @InjectRepository(Checkout)
    private checkoutRepository: Repository<Checkout>,
  ) {}

  async checkout(
    bookCopyId: string,
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Checkout | null> {
    const checkout = await this.checkoutRepository.findOne({
      where: {
        bookCopy: { id: bookCopyId },
      },
      relations: {
        bookCopy: true,
      },
      order: {
        startDate: 'DESC',
      },
    });

    if (checkout && !checkout.returned) {
      return null;
    }

    const newCheckout = this.checkoutRepository.create({
      startDate,
      endDate,
      returned: false,
      bookCopy: { id: bookCopyId },
      user: { id: userId },
    });

    return this.checkoutRepository.save(newCheckout);
  }

  async returnBook(bookId: string, userId: string): Promise<Checkout | null> {
    const checkout = await this.checkoutRepository.findOne({
      where: {
        bookCopy: { id: bookId },
        user: { id: userId },
        returned: false,
      },
      relations: {
        bookCopy: true,
      },
    });

    if (!checkout) {
      return null;
    }

    checkout.returned = true;
    checkout.returnDate = new Date();

    await this.checkoutRepository.save(checkout);

    return checkout;
  }
}

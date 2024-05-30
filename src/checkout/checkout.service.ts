import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Checkout } from './entities/checkout.entity';
import { CheckoutBookDto } from './dto/checkout-book.dto';
import { ReturnBookDto } from './dto/return-book.dto';
import { FindAllCheckoutDto } from './dto/find-all-checkout.dto';
import { PaginatedDto } from 'src/books/dto/paginated.dto';

@Injectable()
export class CheckoutService {
  constructor(
    @InjectRepository(Checkout)
    private checkoutRepository: Repository<Checkout>,
  ) {}

  async findAll(query: FindAllCheckoutDto): Promise<PaginatedDto<Checkout>> {
    const { page, pageSize, userId, bookId, returned } = query;

    const where = {
      user: userId ? { id: userId } : undefined,
      bookCopy: bookId ? { book: { id: bookId } } : undefined,
      returned: returned !== undefined ? returned : undefined,
    };

    const [items, total] = await this.checkoutRepository.findAndCount({
      where,
      relations: {
        user: true,
        bookCopy: true,
      },
      take: pageSize,
      skip: (page - 1) * pageSize,
      order: {
        startDate: 'DESC',
      },
    });

    return {
      items,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      totalItems: total,
    };
  }

  async checkout(checkoutBookDto: CheckoutBookDto): Promise<Checkout | null> {
    const checkout = await this.checkoutRepository.findOne({
      where: {
        bookCopy: { id: checkoutBookDto.bookCopyId },
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
      startDate: checkoutBookDto.startDate,
      endDate: checkoutBookDto.endDate,
      returned: false,
      bookCopy: { id: checkoutBookDto.bookCopyId },
      user: { id: checkoutBookDto.userId },
    });

    return this.checkoutRepository.save(newCheckout);
  }

  async returnBook(returnBookDto: ReturnBookDto): Promise<Checkout | null> {
    const checkout = await this.checkoutRepository.findOne({
      where: {
        bookCopy: { id: returnBookDto.bookId },
        user: { id: returnBookDto.userId },
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

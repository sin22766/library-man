import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Checkout } from './entities/checkout.entity';
import { User } from 'src/users/entities/user.entity';
import { BookCopy } from 'src/books/entities/book-copy.entity';

@Injectable()
export class CheckoutService {
  constructor(
    @InjectRepository(Checkout)
    private checkoutRepository: Repository<Checkout>,
    @InjectRepository(BookCopy)
    private bookCopyRepository: Repository<BookCopy>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async checkout(
    bookCopyId: string,
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Checkout> {
    const bookCopy = await this.bookCopyRepository.findOneBy({
      id: bookCopyId,
    });
    if (!bookCopy) {
      throw new Error('Book not available');
    }

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error('User not found');
    }

    const checkout = this.checkoutRepository.create({
      bookCopy,
      user,
      startDate,
      endDate,
    });
    return this.checkoutRepository.save(checkout);
  }
}

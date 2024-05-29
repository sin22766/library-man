import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Checkout } from './entities/checkout.entity';
import { Book } from '../books/entities/book.entity';
import { User } from '../users/entities/user.entity';
import { BookCopy } from 'src/books/entities/book-copy.entity';

@Injectable()
export class CheckoutService {
  constructor(
    @InjectRepository(Checkout)
    private checkoutRepository: Repository<Checkout>,
    @InjectRepository(BookCopy)
    private bookCopyRepository: Repository<BookCopy>,
  ) {}

  async returnBook(bookId: string, userId: string): Promise<string> {
    const checkout = await this.checkoutRepository.findOne({
      where: {
        bookCopy: { id: bookId },
        user: { id: userId },
        returned: false,
      },
      relations: ['book', 'user'],
    });

    if (!checkout) {
      throw new Error('No active checkout record found for this book and user.');
    }

    checkout.returned = true;
    checkout.returnDate = new Date();

    await this.checkoutRepository.save(checkout);

    const book = await this.bookCopyRepository.findOne({
      where: { id: bookId }
    });
    if (book) {
      book.Available = true;
      await this.bookCopyRepository.save(book);
    }

    return 'Book returned successfully.';
  }
}
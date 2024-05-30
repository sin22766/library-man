import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Checkout } from './entities/checkout.entity';
import { User } from 'src/users/entities/user.entity';
import { BookCopy } from 'src/books/entities/book-copy.entity';
import { Book } from '../books/entities/book.entity';

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

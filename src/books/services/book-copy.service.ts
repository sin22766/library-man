import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AddBookCopyDto } from '../dto/add-book-copy.dto';
import { BookCopy } from '../entities/book-copy.entity';
import { Publisher } from '../entities/publisher.entity';

@Injectable()
export class BookCopyService {
  constructor(
    @InjectRepository(BookCopy)
    private bookCopyRepository: Repository<BookCopy>,
  ) {}
  async addCopy(
    bookId: string,
    addBookCopyDto: AddBookCopyDto,
    publisher: Publisher,
  ): Promise<BookCopy> {
    const bookCopy = this.bookCopyRepository.create({
      ...addBookCopyDto,
      publisher,
      book: { id: bookId },
    });
    return this.bookCopyRepository.save(bookCopy);
  }

  async removeCopy(id: string): Promise<void> {
    await this.bookCopyRepository.delete(id);
  }
}

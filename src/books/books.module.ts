import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BooksController } from './books.controller';
import { Author } from './entities/author.entity';
import { Book } from './entities/book.entity';
import { BookCopy } from './entities/book-copy.entity';
import { Category } from './entities/category.entity';
import { Publisher } from './entities/publisher.entity';
import { AuthorService } from './services/author.service';
import { BookService } from './services/book.service';
import { BookCopyService } from './services/book-copy.service';
import { PublisherService } from './services/publisher.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Book, Publisher, Author, Category, BookCopy]),
  ],
  controllers: [BooksController],
  providers: [BookService, AuthorService, PublisherService, BookCopyService],
  exports: [TypeOrmModule],
})
export class BooksModule {}

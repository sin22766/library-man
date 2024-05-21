import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { Author } from './entities/author.entity';
import { Book } from './entities/book.entity';
import { BookCopy } from './entities/book-copy.entity';
import { Category } from './entities/category.entity';
import { Publisher } from './entities/publisher.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Book, Publisher, Author, Category, BookCopy]),
  ],
  controllers: [BooksController],
  providers: [BooksService],
  exports: [TypeOrmModule],
})
export class BooksModule {}

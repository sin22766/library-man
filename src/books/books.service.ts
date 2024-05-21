import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AddBookDto } from './dto/add-book.dto';
import { FindAllBookDto } from './dto/find-all-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
  ) {}

  create(createBookDto: AddBookDto) {
    console.log('createBookDto', createBookDto);
    return 'This action adds a new book';
  }

  findAll(query: FindAllBookDto) {
    console.log('createBookDto', query);
    return `This action returns all books`;
  }

  async findOne(id: string) {
    return this.booksRepository.findOneBy({ id });
  }

  update(id: number, updateBookDto: UpdateBookDto) {
    console.log('UpdateBookDto', updateBookDto);
    return `This action updates a #${id} book`;
  }

  remove(id: number) {
    return `This action removes a #${id} book`;
  }
}

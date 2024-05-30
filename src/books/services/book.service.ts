import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { AddBookDto } from '../dto/add-book.dto';
import { FindAllBookDto } from '../dto/find-all-book.dto';
import { PaginatedDto } from '../dto/paginated.dto';
import { UpdateBookDto } from '../dto/update-book.dto';
import { Author } from '../entities/author.entity';
import { Book } from '../entities/book.entity';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) {}
  async add(authors: Author[], addBookDto: AddBookDto): Promise<Book> {
    console.log(authors);
    const book = this.bookRepository.create({
      ...addBookDto,
      authors,
      category: { id: addBookDto.categoryId },
    });
    return this.bookRepository.save(book);
  }

  async update(
    book: Book,
    updateBookDto: UpdateBookDto,
    authors: Author[],
  ): Promise<Book> {
    if (updateBookDto.authors) {
      book.authors = authors;
    }

    if (updateBookDto.isbn) {
      book.isbn = updateBookDto.isbn;
    }

    if (updateBookDto.title) {
      book.title = updateBookDto.title;
    }

    if (updateBookDto.categoryId) {
      book.category.id = updateBookDto.categoryId;
    }
    return this.bookRepository.save(book);
  }

  async remove(id: string): Promise<void> {
    await this.bookRepository.delete(id);
  }

  async findAll(query: FindAllBookDto): Promise<PaginatedDto<Book>> {
    const { pageSize, page, title, author, category, publisher } = query;
    const where = {
      title: title ? ILike(`%${title}%`) : undefined,
      category: category ? { name: ILike(`%${category}%`) } : undefined,
      bookCopies: publisher
        ? { publisher: { name: ILike(`%${publisher}%`) } }
        : undefined,
      authors: author ? { name: ILike(`%${author}%`) } : undefined,
    };

    const [items, total] = await this.bookRepository.findAndCount({
      relations: ['category', 'bookCopies', 'bookCopies.publisher', 'authors'],
      where,
      take: Number(pageSize),
      skip: (Number(page) - 1) * Number(pageSize),
      order: { title: 'ASC' },
    });

    return {
      items,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      totalItems: total,
    };
  }

  async findById(id: string): Promise<Book | null> {
    return this.bookRepository.findOne({
      where: { id },
      relations: {
        authors: true,
        category: true,
        bookCopies: {
          publisher: true,
        },
      },
    });
  }

  async findByISBN(isbn: string): Promise<Book | null> {
    return this.bookRepository.findOne({
      where: { isbn },
      relations: {
        authors: true,
        category: true,
        bookCopies: {
          publisher: true,
        },
      },
    });
  }
}

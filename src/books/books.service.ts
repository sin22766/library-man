import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { AddBookDto } from './dto/add-book.dto';
import { AddBookCopyDto } from './dto/add-book-copy.dto';
import { FindAllBookDto } from './dto/find-all-book.dto';
import { PaginatedDto } from './dto/paginated.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Author } from './entities/author.entity';
import { Book } from './entities/book.entity';
import { BookCopy } from './entities/book-copy.entity';
import { Publisher } from './entities/publisher.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
    @InjectRepository(BookCopy)
    private bookCopyRepository: Repository<BookCopy>,
    @InjectRepository(Author)
    private authorRepository: Repository<Author>,
    @InjectRepository(Publisher)
    private publisherRepository: Repository<Publisher>,
  ) {}

  private async upsertAuthors(names: string[]): Promise<Author[]> {
    const result = await this.authorRepository.upsert(
      names.map((name) => ({ name })),
      ['name'],
    );
    return result.generatedMaps as Author[];
  }

  private async upsertPublisher(name: string): Promise<Publisher> {
    const result = await this.publisherRepository.upsert({ name }, ['name']);
    return result.generatedMaps[0] as Publisher;
  }

  async add(addBookDto: AddBookDto): Promise<Book> {
    const authors = await this.upsertAuthors(addBookDto.authors);
    const book = this.booksRepository.create({
      ...addBookDto,
      authors,
      category: { id: addBookDto.categoryId },
    });
    return this.booksRepository.save(book);
  }

  async addCopy(
    bookId: string,
    addBookCopyDto: AddBookCopyDto,
  ): Promise<BookCopy> {
    const publisher = await this.upsertPublisher(addBookCopyDto.publisher);
    const bookCopy = this.bookCopyRepository.create({
      ...addBookCopyDto,
      publisher,
      book: { id: bookId },
    });
    return this.bookCopyRepository.save(bookCopy);
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

    const [items, total] = await this.booksRepository.findAndCount({
      relations: ['category', 'bookCopies', 'bookCopies.publisher', 'authors'],
      where,
      take: pageSize,
      skip: (page - 1) * pageSize,
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
    return this.booksRepository.findOne({
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
    return this.booksRepository.findOne({
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

  async update(book: Book, updateBookDto: UpdateBookDto): Promise<Book> {
    if (updateBookDto.authors) {
      const authors = await this.upsertAuthors(updateBookDto.authors);
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
    return this.booksRepository.save(book);
  }

  async remove(id: string): Promise<void> {
    await this.booksRepository.delete(id);
  }

  async removeCopy(id: string): Promise<void> {
    await this.bookCopyRepository.delete(id);
  }
}

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

  async add(addBookDto: AddBookDto): Promise<Book> {
    const authors = await this.authorRepository.upsert(
      addBookDto.authors.map((author) => ({ name: author })),
      ['name'],
    );

    const book = this.booksRepository.create({
      title: addBookDto.title,
      isbn: addBookDto.isbn,
      authors: authors.generatedMaps,
      category: { id: addBookDto.categoryId },
    });

    return this.booksRepository.save(book);
  }

  async addCopy(id: string, addBookCopyDto: AddBookCopyDto): Promise<BookCopy> {
    const publisher = await this.publisherRepository.upsert(
      { name: addBookCopyDto.publisher },
      ['name'],
    );

    const bookCopy = this.bookCopyRepository.create({
      publishedAt: addBookCopyDto.publishedAt,
      publisher: publisher.generatedMaps[0],
      book: { id },
    });

    return this.bookCopyRepository.save(bookCopy);
  }

  async findAll(query: FindAllBookDto): Promise<PaginatedDto<Book>> {
    const { pageSize, page, title, author, category, publisher } = query;

    console.log(query);

    const result = await this.booksRepository.find({
      relations: {
        category: true,
        bookCopies: {
          publisher: true,
        },
        authors: true,
      },
      where: {
        title: title ? ILike(`%${title}%`) : undefined,
        category: category ? { name: ILike(`%${category}%`) } : undefined,
        bookCopies: {
          publisher: publisher ? { name: ILike(`%${publisher}%`) } : undefined,
        },
        authors: author ? { name: ILike(`%${author}%`) } : undefined,
      },
      take: pageSize,
      skip: (page - 1) * pageSize,
      order: {
        title: 'ASC',
      },
    });

    const total = await this.booksRepository.count({
      where: {
        title: title ? ILike(`%${title}%`) : undefined,
        category: category ? { name: ILike(`%${category}%`) } : undefined,
        bookCopies: {
          publisher: publisher ? { name: ILike(`%${publisher}%`) } : undefined,
        },
        authors: author ? { name: ILike(`%${author}%`) } : undefined,
      },
      relations: {
        category: true,
        bookCopies: {
          publisher: true,
        },
        authors: true,
      },
    });

    return {
      items: result,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      totalItems: total,
    };
  }

  async findById(id: string): Promise<Book | null> {
    return this.booksRepository.findOneBy({ id });
  }

  async findByISBN(isbn: string): Promise<Book | null> {
    return this.booksRepository.findOneBy({ isbn });
  }

  async update(book: Book, updateBookDto: UpdateBookDto) {
    const authors = updateBookDto.authors
      ? await this.authorRepository.upsert(
          updateBookDto.authors.map((author) => ({ name: author })),
          ['name'],
        )
      : undefined;

    book = {
      ...book,
      ...updateBookDto,
      authors: authors?.generatedMaps as Author[],
    };

    return this.booksRepository.save(book);
  }

  async remove(id: string) {
    return this.booksRepository.delete(id);
  }

  async removeCopy(id: string) {
    return this.bookCopyRepository.delete(id);
  }
}

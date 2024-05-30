import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JWTAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/users/entities/user.entity';

import { AddBookDto } from './dto/add-book.dto';
import { AddBookCopyDto } from './dto/add-book-copy.dto';
import { FindAllBookDto } from './dto/find-all-book.dto';
import { PaginatedDto } from './dto/paginated.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';
import { BookCopy } from './entities/book-copy.entity';
import { AuthorService } from './services/author.service';
import { BookService } from './services/book.service';
import { BookCopyService } from './services/book-copy.service';
import { PublisherService } from './services/publisher.service';

// TODO: Implement the BooksController, this is just a placeholder
@Controller('books')
@ApiTags('books')
@ApiExtraModels(PaginatedDto)
export class BooksController {
  constructor(
    private readonly authorService: AuthorService,
    private readonly publisherService: PublisherService,
    private readonly bookService: BookService,
    private readonly bookCopyService: BookCopyService,
  ) {}

  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles(UserRole.STAFF)
  @Post()
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Book added', type: Book })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async add(@Body() addBookDto: AddBookDto) {
    const authors = await this.authorService.upsertAuthors(addBookDto.authors);
    return this.bookService.add(authors, addBookDto);
  }

  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles(UserRole.STAFF)
  @Post(':id')
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Book Copy added', type: BookCopy })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async addCopy(
    @Body() addBookCopyDto: AddBookCopyDto,
    @Param('id') id: string,
  ) {
    const publisher = await this.publisherService.upsertPublisher(
      addBookCopyDto.publisher,
    );
    return this.bookCopyService.addCopy(id, addBookCopyDto, publisher);
  }

  @ApiOkResponse({
    description: 'Book found',
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedDto) },
        {
          properties: {
            items: {
              type: 'array',
              items: { $ref: getSchemaPath(Book) },
            },
          },
        },
      ],
    },
  })
  @Get()
  async findAll(@Query() query: FindAllBookDto): Promise<PaginatedDto<Book>> {
    return this.bookService.findAll(query);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Book found', type: Book })
  @ApiNotFoundResponse({ description: 'Book not found' })
  async findById(@Param('id') id: string) {
    const book = await this.bookService.findById(id);

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    return book;
  }

  @Get('isbn/:isbn')
  @ApiOkResponse({ description: 'Book found', type: Book })
  @ApiNotFoundResponse({ description: 'Book not found' })
  async findByISBN(@Param('isbn') isbn: string) {
    const book = await this.bookService.findByISBN(isbn);

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    return book;
  }

  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles(UserRole.STAFF)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Book updated', type: Book })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Book not found' })
  async update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    const book = await this.bookService.findById(id);

    if (!book) {
      throw new NotFoundException('Book not found');
    }
    const authors = updateBookDto.authors
      ? await this.authorService.upsertAuthors(updateBookDto.authors)
      : [];

    return this.bookService.update(book, updateBookDto, authors);
  }

  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles(UserRole.STAFF)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Book deleted' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Book not found' })
  async remove(@Param('id') id: string) {
    const book = await this.bookService.findById(id);

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    return this.bookService.remove(id);
  }

  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles(UserRole.STAFF)
  @Delete(':id/:copyId')
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Book Copy deleted' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Book not found' })
  async removeCopy(@Param('id') id: string, @Param('copyId') copyId: string) {
    const book = await this.bookService.findById(id);

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    return this.bookCopyService.removeCopy(copyId);
  }
}

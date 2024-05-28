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

import { BooksService } from './books.service';
import { AddBookDto } from './dto/add-book.dto';
import { AddBookCopyDto } from './dto/add-book-copy.dto';
import { FindAllBookDto } from './dto/find-all-book.dto';
import { PaginatedDto } from './dto/paginated.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';
import { BookCopy } from './entities/book-copy.entity';

// TODO: Implement the BooksController, this is just a placeholder
@Controller('books')
@ApiTags('books')
@ApiExtraModels(PaginatedDto)
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles(UserRole.STAFF)
  @Post()
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Book added', type: Book })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async add(@Body() addBookDto: AddBookDto) {
    return this.booksService.add(addBookDto);
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
    return this.booksService.addCopy(id, addBookCopyDto);
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
    return this.booksService.findAll(query);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Book found', type: Book })
  @ApiNotFoundResponse({ description: 'Book not found' })
  async findById(@Param('id') id: string) {
    const book = await this.booksService.findById(id);

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    return book;
  }

  @Get('isbn/:isbn')
  @ApiOkResponse({ description: 'Book found', type: Book })
  @ApiNotFoundResponse({ description: 'Book not found' })
  async findByISBN(@Param('isbn') isbn: string) {
    const book = await this.booksService.findByISBN(isbn);

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
    const book = await this.booksService.findById(id);

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    return this.booksService.update(book, updateBookDto);
  }

  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles(UserRole.STAFF)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Book deleted' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Book not found' })
  async remove(@Param('id') id: string) {
    const book = await this.booksService.findById(id);

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    return this.booksService.remove(id);
  }

  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles(UserRole.STAFF)
  @Delete(':id/:copyId')
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Book Copy deleted' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Book not found' })
  async removeCopy(@Param('id') id: string, @Param('copyId') copyId: string) {
    const book = await this.booksService.findById(id);

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    return this.booksService.removeCopy(copyId);
  }
}

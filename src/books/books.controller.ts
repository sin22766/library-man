import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JWTAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/users/entities/user.entity';

import { BooksService } from './books.service';
import { AddBookDto } from './dto/add-book.dto';
import { FindAllBookDto } from './dto/find-all-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

// TODO: Implement the BooksController, this is just a placeholder
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles(UserRole.STAFF)
  @Post()
  add(@Body() addBookDto: AddBookDto) {
    return this.booksService.create(addBookDto);
  }

  @Get()
  findAll(@Query() query: FindAllBookDto) {
    return this.booksService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(id);
  }

  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles(UserRole.STAFF)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(+id, updateBookDto);
  }

  @UseGuards(JWTAuthGuard)
  @Roles(UserRole.STAFF)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.booksService.remove(+id);
  }
}

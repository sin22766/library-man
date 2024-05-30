import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';

import { Checkout } from '../../checkout/entities/checkout.entity';
import { Author } from './author.entity';
import { BookCopy } from './book-copy.entity';
import { Category } from './category.entity';

@Entity()
export class Book {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column({
    nullable: true,
    unique: true,
  })
  isbn: string;

  @ApiProperty()
  @Column({ default: false })
  available: boolean;

  @ApiProperty()
  @ManyToMany(() => Author, (author) => author.books)
  authors: Relation<Author[]>;

  @ApiProperty()
  @ManyToOne(() => Category, (category) => category.books)
  category: Relation<Category>;

  @ApiProperty()
  @OneToMany(() => BookCopy, (bookCopy) => bookCopy.book)
  bookCopies: Relation<BookCopy[]>;

  @OneToMany(() => Checkout, (checkout) => checkout.book)
  checkouts: Checkout[];
}

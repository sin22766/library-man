import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';

import { Book } from './book.entity';

@Entity()
export class Author {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({
    unique: true,
  })
  @ApiProperty()
  name: string;

  @ManyToMany(() => Book, (book) => book.authors)
  @JoinTable({ name: 'book_author' })
  @ApiProperty()
  books: Relation<Book[]>;
}

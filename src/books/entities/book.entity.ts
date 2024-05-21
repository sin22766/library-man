import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';

import { Author } from './author.entity';
import { BookCopy } from './book-copy.entity';
import { Category } from './category.entity';

@Entity()
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({
    nullable: true,
  })
  isbn: string;

  @ManyToMany(() => Author, (author) => author.books)
  authors: Author[];

  @ManyToOne(() => Category, (category) => category.books)
  category: Relation<Category>;

  @OneToMany(() => BookCopy, (bookCopy) => bookCopy.book)
  bookCopies: Relation<BookCopy[]>;
}

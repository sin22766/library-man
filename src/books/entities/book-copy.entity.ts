import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';

import { Book } from './book.entity';
import { Publisher } from './publisher.entity';

@Entity()
export class BookCopy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  publishedAt: Date;

  @ManyToOne(() => Publisher, (publisher) => publisher.bookCopies)
  publisher: Relation<Publisher>;

  @ManyToOne(() => Book, (book) => book.bookCopies)
  book: Relation<Book>;
}

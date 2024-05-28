import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
  id: string;

  @Column()
  @ApiProperty()
  publishedAt: Date;

  @ManyToOne(() => Publisher, (publisher) => publisher.bookCopies)
  @ApiProperty()
  publisher: Relation<Publisher>;

  @ManyToOne(() => Book, (book) => book.bookCopies)
  @ApiProperty()
  book: Relation<Book>;
}

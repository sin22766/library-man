import {
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
  type Relation,
} from 'typeorm';

import { BookCopy } from './book-copy.entity';

@Entity()
export class Publisher {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => BookCopy, (bookCopy) => bookCopy.publisher)
  bookCopies: Relation<BookCopy[]>;
}

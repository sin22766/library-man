import {
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
  type Relation,
} from 'typeorm';

import { Book } from './book.entity';

@Entity()
export class Category {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Book, (book) => book.authors)
  books: Relation<Book[]>;
}

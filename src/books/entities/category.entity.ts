import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
  id: number;

  @Column()
  @ApiProperty()
  name: string;

  @OneToMany(() => Book, (book) => book.authors)
  @ApiProperty()
  books: Relation<Book[]>;
}

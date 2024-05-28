import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';

import { BookCopy } from './book-copy.entity';

@Entity()
export class Publisher {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({
    unique: true,
  })
  @ApiProperty()
  name: string;

  @OneToMany(() => BookCopy, (bookCopy) => bookCopy.publisher)
  @ApiProperty()
  bookCopies: Relation<BookCopy[]>;
}

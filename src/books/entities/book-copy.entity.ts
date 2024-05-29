import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';

import { Book } from './book.entity';
import { Publisher } from './publisher.entity';
import { Checkout } from 'src/checkout/entities/checkout.entity';

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

  @OneToMany(() => Checkout, (checkout) => checkout.bookCopy)
  checkouts: Relation<Checkout[]>;

  @Column({default:false})
  Available: boolean;
}

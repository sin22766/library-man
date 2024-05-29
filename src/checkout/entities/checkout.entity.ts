import { BookCopy } from 'src/books/entities/book-copy.entity';
import { User } from 'src/users/entities/user.entity';
import { Book } from '../../books/entities/book.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';

@Entity()
export class Checkout {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column({default:false})
  returned: boolean;

  @Column({
    nullable: true,
  })
  returnDate: Date;

  @ManyToOne(() => BookCopy, (bookCopy) => bookCopy.checkouts)
  bookCopy: Relation<BookCopy>;

  @ManyToOne(() => User, (user) => user.checkouts)
  user: Relation<User>;

  @ManyToOne(() => Book, book => book.checkouts)
  book: Book;
}

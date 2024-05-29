import { BookCopy } from 'src/books/entities/book-copy.entity';
import { User } from 'src/users/entities/user.entity';
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

  @Column({
    nullable: true,
  })
  returnDate: Date;

  @ManyToOne(() => BookCopy, (bookCopy) => bookCopy.checkouts)
  bookCopy: Relation<BookCopy>;

  @ManyToOne(() => User, (user) => user.checkouts)
  user: Relation<User>;
}

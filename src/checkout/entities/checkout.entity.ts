import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
  id: number;

  @Column()
  @ApiProperty()
  startDate: Date;

  @Column()
  @ApiProperty()
  endDate: Date;

  @Column({ default: false })
  @ApiProperty()
  returned: boolean;

  @Column({
    nullable: true,
  })
  @ApiProperty()
  returnDate: Date;

  @ManyToOne(() => BookCopy, (bookCopy) => bookCopy.checkouts)
  @ApiProperty()
  bookCopy: Relation<BookCopy>;

  @ManyToOne(() => User, (user) => user.checkouts)
  @ApiProperty()
  user: Relation<User>;
}

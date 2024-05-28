import { ApiProperty } from '@nestjs/swagger';
import bcrypt from 'bcrypt';
import { Checkout } from 'src/checkout/entities/checkout.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';

export enum UserRole {
  STAFF = 'staff',
  MEMBER = 'member',
}

// TODO: Design a proper User entity
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  @ApiProperty()
  id: string;

  @Column({ unique: true })
  @ApiProperty()
  email: string;

  @Column()
  @ApiProperty()
  firstName: string;

  @Column()
  @ApiProperty()
  lastName: string;

  @Column()
  @ApiProperty()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    array: true,
    default: [UserRole.MEMBER],
  })
  @ApiProperty()
  roles: UserRole[];

  @OneToMany(() => Checkout, (checkout) => checkout.user)
  @ApiProperty()
  checkouts: Relation<Checkout[]>;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(
      this.password,
      Number(process.env.SALT_ROUNDS) || 10,
    );
  }
}

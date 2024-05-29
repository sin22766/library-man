import { IsString } from 'class-validator';

export class ReturnBookDto {
  @IsString()
  bookId: string;

  @IsString()
  userId: string;
}
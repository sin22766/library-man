import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ReturnBookDto {
  @IsString()
  @ApiProperty()
  bookId: string;

  @IsString()
  @ApiProperty()
  userId: string;
}

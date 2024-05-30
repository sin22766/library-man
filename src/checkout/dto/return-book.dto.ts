import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ReturnBookDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty()
  bookId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  userId: string;
}

import { ApiProperty } from '@nestjs/swagger';

export class AddBookDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  isbn: string;

  @ApiProperty()
  authors: string[];

  @ApiProperty()
  categoryId: number;
}

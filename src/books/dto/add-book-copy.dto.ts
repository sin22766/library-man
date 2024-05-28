import { ApiProperty } from '@nestjs/swagger';

export class AddBookCopyDto {
  @ApiProperty()
  publishedAt: Date;

  @ApiProperty()
  publisher: string;
}

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

// Todo: Change DTO to fit your query
export class FindAllBookDto {
  @ApiPropertyOptional({
    description: 'Number of items per page',
    minimum: 1,
    default: 10,
  })
  @IsOptional()
  pageSize: number = 10;

  @ApiPropertyOptional({
    description: 'Current page number',
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  page: number = 1;

  @ApiPropertyOptional({
    description: 'Query title to search for books',
    default: '',
  })
  @IsOptional()
  title: string = '';

  @ApiPropertyOptional({
    description: 'Query title to search for books',
    default: '',
  })
  @IsOptional()
  author: string = '';

  @ApiPropertyOptional({
    description: 'Query category to search for books',
    default: '',
  })
  @IsOptional()
  category: string = '';

  @ApiPropertyOptional({
    description: 'Query publisher to search for books',
    default: '',
  })
  @IsOptional()
  publisher: string = '';
}

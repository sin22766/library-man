import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

// Todo: Change DTO to fit your query
export class FindOneBookDto {
  @ApiPropertyOptional({
    description: 'Query id to search for book',
    default: '',
  })
  @IsOptional()
  id: string = '';

  @ApiPropertyOptional({
    description: 'Query ISBN to search for book',
    default: '',
  })
  @IsOptional()
  isbn: string = '';
}

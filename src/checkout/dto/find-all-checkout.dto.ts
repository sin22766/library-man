import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

// Todo: Change DTO to fit your query
export class FindAllCheckoutDto {
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
    description: 'Query by user ID',
    default: '',
  })
  @IsOptional()
  userId: string = '';

  @ApiPropertyOptional({
    description: 'Query by book ID',
    default: '',
  })
  @IsOptional()
  bookId: string = '';

  @ApiPropertyOptional({
    description: 'Is the book returned?',
    default: '',
  })
  @IsOptional()
  returned: boolean | undefined;
}

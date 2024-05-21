import { IsOptional } from 'class-validator';

// Todo: Change DTO to fit your query
export class FindAllBookDto {
  @IsOptional()
  pageSize: number = 10;

  @IsOptional()
  page: number = 1;

  @IsOptional()
  search: string = '';
}

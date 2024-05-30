import { IsDate, IsNotEmpty, IsUUID } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CheckoutBookDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  bookCopyId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  @ApiProperty()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  endDate: Date;
}

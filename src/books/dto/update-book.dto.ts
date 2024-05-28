import { PartialType } from '@nestjs/swagger';

import { AddBookDto } from './add-book.dto';

export class UpdateBookDto extends PartialType(AddBookDto) {}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Author } from '../entities/author.entity';

@Injectable()
export class AuthorService {
  constructor(
    @InjectRepository(Author)
    private authorRepository: Repository<Author>,
  ) {}
  async upsertAuthors(names: string[]): Promise<Author[]> {
    const result = await this.authorRepository.upsert(
      names.map((name) => ({ name })),
      ['name'],
    );
    return result.generatedMaps as Author[];
  }
}

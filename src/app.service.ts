import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getDescription(): string {
    return 'API for the Simple Library Management System.';
  }
}

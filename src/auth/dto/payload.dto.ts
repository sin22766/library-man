import { UserRole } from 'src/users/entities/user.entity';

export class JWTPayloadDto {
  id: string;
  email: string;
  roles: UserRole[];
}

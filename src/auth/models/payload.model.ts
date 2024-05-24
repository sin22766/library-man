import { UserRole } from 'src/users/entities/user.entity';

export class JWTPayload {
  id: string;
  email: string;
  roles: UserRole[];
}

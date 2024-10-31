import { Request } from 'express';
import { Role } from '../../auth/enums/role.enum';

export interface RequestWithUser extends Request {
  user: {
    sub: string; // Cognito User ID
    email: string;
    role: Role;
    // Other JWT claims from Cognito
    token_use?: string;
    auth_time: number;
    exp: number;
    iat: number;
  };
}

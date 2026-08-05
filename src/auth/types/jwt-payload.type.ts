import type { Request } from 'express';

export interface JwtPayload {
  sub: string;
  type: string;
  role: string;
  storeId: string;
}

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}

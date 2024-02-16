import { Request } from 'express';

export interface CustomRequestInterface extends Request {
  userId: number;
}

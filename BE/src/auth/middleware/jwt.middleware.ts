import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response } from 'express';

import { AuthService } from '../services/auth.service';
import { CustomRequestInterface } from '../interfaces/custom-request.interface';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  use(req: CustomRequestInterface, _res: Response, next: () => void) {
    const token = this.authService.validateTokenFromRequest(req);
    const { userId } = this.authService.decodeJwt(token);
    req.userId = userId;

    next();
  }
}

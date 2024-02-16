import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class LoggedInGuard {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  canActivate() {
    return this.authService.validateToken().pipe(
      map(() => true),
      catchError(() => of(this.router.parseUrl('/login')))
    );
  }
}

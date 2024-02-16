import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class LoginGuard {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  canActivate() {
    return this.authService.validateToken().pipe(
      map(() => this.router.parseUrl('')),
      catchError(() => {
        return of(true);
      })
    );
  }
}

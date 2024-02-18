import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/common/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loggingIn = false;
  formGroup = new FormGroup({
    username: new FormControl('test1@mail.de', {
      validators: [Validators.required],
    }),
    password: new FormControl('', { validators: [Validators.required] }),
  });

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  login() {
    this.loggingIn = true;
    this.authService
      .login(this.formGroup.value as { username: string; password: string })
      .subscribe({
        next: () => {
          this.router.navigate(['home', 'main-screen']);
        },
        error: () => {
          this.loggingIn = false;
        },
      });
  }
}

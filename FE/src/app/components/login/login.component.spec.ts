import { TestBed } from '@angular/core/testing';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent, MockDirective } from 'ng-mocks';
import { AuthService } from 'src/app/common/services/auth.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [{ provide: AuthService, useValue: {} }],
      declarations: [
        LoginComponent,
        MockComponent(MatCard),
        MockComponent(MatFormField),
        MockDirective(MatLabel),
        MockDirective(MatCardContent),
      ],
    });

    const fixture = TestBed.createComponent<LoginComponent>(LoginComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

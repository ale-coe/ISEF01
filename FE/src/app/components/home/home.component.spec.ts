import { TestBed } from '@angular/core/testing';
import { MatIcon } from '@angular/material/icon';
import { MatMenu } from '@angular/material/menu';
import {
  MatDrawer,
  MatDrawerContainer,
  MatDrawerContent,
} from '@angular/material/sidenav';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from 'ng-mocks';
import { AuthService } from 'src/app/common/services/auth.service';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [{ provide: AuthService, useValue: {} }],
      declarations: [
        HomeComponent,
        MockComponent(MatIcon),
        MockComponent(MatDrawer),
        MockComponent(MatDrawerContainer),
        MockComponent(MatDrawerContent),
        MockComponent(MatToolbar),
        MockComponent(MatMenu),
      ],
    });

    const fixture = TestBed.createComponent<HomeComponent>(HomeComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';
import { MainScreenComponent } from './main-screen.component';
import { MatDialog } from '@angular/material/dialog';
import { GameService } from './services/game.service';
import { CookieService } from 'ngx-cookie-service';
import { MockComponent } from 'ng-mocks';
import { MatIcon } from '@angular/material/icon';

describe('MainScreenComponent', () => {
  let component: MainScreenComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainScreenComponent, MockComponent(MatIcon)],
      providers: [
        { provide: MatDialog, useValue: {} },
        { provide: GameService, useValue: {} },
        { provide: CookieService, useValue: {} },
      ],
    });

    const fixture =
      TestBed.createComponent<MainScreenComponent>(MainScreenComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

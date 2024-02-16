import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
import { AuthService } from 'src/app/common/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @ViewChild(MatDrawer) matDrawer!: MatDrawer;
  title = '';

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService
  ) {}

  ngOnInit() {
    const url = this.router.url;

    if (url.endsWith('main-screen')) {
      this.title = 'Startseite';
    } else if (url.endsWith('question-overview')) {
      this.title = 'Fragenübersicht';
    } else if (url.endsWith('question-edit')) {
      this.title = 'Frageneditor';
    }
  }

  naviagate(title: string) {
    this.title = title;

    timer(20).subscribe(() => this.matDrawer.toggle());
  }

  logout() {
    this.authService
      .logout()
      .subscribe({ next: () => this.router.navigate(['login']) });
  }
}

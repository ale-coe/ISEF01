import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import {
  MatPaginatorIntl,
  MatPaginatorModule,
} from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { germanPaginatorIntl } from 'src/app/common/util/german-paginator-intl';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { GameDialogComponent } from './main-screen/game-dialog/game-dialog.component';
import { MainScreenComponent } from './main-screen/main-screen.component';
import { ResultPipe } from './main-screen/result.pipe';
import { QuestionEditComponent } from './question-edit/question-edit.component';
import { QuestionOverviewComponent } from './question-overview/question-overview.component';
import { QuestionComponent } from './question/question.component';

@NgModule({
  declarations: [
    HomeComponent,
    MainScreenComponent,
    QuestionEditComponent,
    QuestionOverviewComponent,
    QuestionComponent,
    GameDialogComponent,
    ResultPipe,
  ],
  imports: [
    CommonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    HomeRoutingModule,
    MatCardModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatRadioModule,
    MatPaginatorModule,
    MatDialogModule,
    MatSnackBarModule,
  ],

  providers: [{ provide: MatPaginatorIntl, useFactory: germanPaginatorIntl }],
  bootstrap: [HomeComponent],
})
export class HomeModule {}

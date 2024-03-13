
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DashboardRoutingModule } from './dashboard-routing.module';

import { ReactiveFormsModule } from '@angular/forms';
import { ThemesInfosComponent } from '../themes/themes-infos/themes-infos.component';
import { NgxPaginationModule } from 'ngx-pagination';

import { DashboardComponent }         from './dashboard.component';
import { NavBarComponent }            from 'src/app/shared/dashboard/nav-bar/nav-bar.component';
import { FooterComponent }            from 'src/app/shared/dashboard/footer/footer.component';
import { ContentDashboardComponent }  from '../content-dashboard/content-dashboard.component';
import { ThemesComponent }            from '../themes/themes.component';
import { TrainersComponent }          from '../trainers/trainers.component';
import { DatePipe }                   from '@angular/common';



@NgModule({
  declarations: [
    DashboardComponent,
    NavBarComponent,
    FooterComponent,
    ContentDashboardComponent,
    ThemesComponent,
    ThemesInfosComponent,
    TrainersComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ReactiveFormsModule,
    NgxPaginationModule
  ],
  providers: [DatePipe],
})
export class DashboardModule { }

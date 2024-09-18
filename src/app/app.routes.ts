import { Routes } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import { UsersComponent } from './Components/users/users.component';
import { ReportsComponent } from './Components/reports/reports.component';
import { TripsComponent } from './Components/trips/trips.component';
import { SettingsComponent } from './Components/settings/settings.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { LoginComponent } from './Components/login/login.component';
import { UsersDetailComponent } from './Components/users-detail/users-detail.component';
import { IframeDisplayComponent } from './Components/iframe-display/iframe-display.component';
import { TripsDetailComponent } from './Components/trips-detail/trips-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent }, // Changed to HomeComponent to reflect a likely correct routing scenario
      { path: 'users', component: UsersComponent },
      { path: 'reports', component: ReportsComponent },
      { path: 'trips', component: TripsComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'doc/:id', component: IframeDisplayComponent },
      { path: 'users/:id', component: UsersDetailComponent },
      { path: 'trips/:id', component: TripsDetailComponent },
      ///home/users/2
      //home/dashboard/2
    ],
  },
];

import { Routes } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import { UsersComponent } from './Components/users/users.component';
import { ReportsComponent } from './Components/reports/reports.component';
import { TripsComponent } from './Components/trips/trips.component';
import { SettingsComponent } from './Components/settings/settings.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { LoginComponent } from './Components/login/login.component';

export const routes: Routes = [
  // { path: '', component: LoginComponent },

  // path: 'home',
  // component: DashboardComponent,
  // children: [
  {
    path: 'home',
    component: DashboardComponent,
  },
  {
    path: 'users',
    component: UsersComponent,
  },
  {
    path: 'reports',
    component: ReportsComponent,
  },
  {
    path: 'trips',
    component: TripsComponent,
  },
  {
    path: 'settings',
    component: SettingsComponent,
  },
];

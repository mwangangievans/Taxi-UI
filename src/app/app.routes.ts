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
import { DriverComponent } from './Components/users/driver/driver.component';
import { PassagerComponent } from './Components/users/passager/passager.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },

  {
    path: 'home',
    component: HomeComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'users', redirectTo: 'users/drivers', pathMatch: 'full' },
      { path: 'users/drivers', component: DriverComponent },
      { path: 'users/passagers', component: PassagerComponent },

      { path: 'reports', component: ReportsComponent },
      { path: 'trips', component: TripsComponent },
      { path: 'settings', component: SettingsComponent },

      // Dynamic routes with parameters
      { path: 'doc/:id', component: IframeDisplayComponent },
      { path: 'users/:id', component: UsersDetailComponent },
      { path: 'trips/:id', component: TripsDetailComponent },
    ],
  },
];

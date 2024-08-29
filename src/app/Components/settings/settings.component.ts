import { Component } from '@angular/core';
import { UsersComponent } from '../users/users.component';
import { HttpService } from '../../service/http.service';
import { NotificationService } from '../../service/notification.service';
import { CommonModule } from '@angular/common';
import { configurationInterface, kycConfiguration } from '../../model';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [UsersComponent, CommonModule], // Ensure UsersComponent is standalone or declared in a shared module
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'], // Corrected from 'styleUrl' to 'styleUrls' and it should be an array
})
export class SettingsComponent {
  kyscData!: kycConfiguration[];
  kycConfiguration!: configurationInterface[];
  activeTab: 1 | 2 = 1;

  addingKyc: boolean = false;
  ngOnInit() {
    this.getKycs('DRIVER');
  }

  updateActiveTab(tab: any) {
    console.log({ tab });

    this.activeTab = tab;
  }

  constructor(private api: HttpService, private notify: NotificationService) {}
  getKycs(filter: string) {
    this.api.get(`kycConfiguration?userRole=${filter}`).subscribe({
      next: (response) => {
        this.kyscData = response;
      },
      error: (error) => {
        console.error('Error fetching users:', error);
        this.kyscData = [];
        // Handle any errors here, such as showing an error message to the user
      },
      complete: () => {
        console.log('Completed the request to get users.');
        // Optional: Execute any additional code after the request completes
      },
    });
  }

  filters = [
    { id: 1, title: 'Driver KYC Documents', active: true, name: 'DRIVER' },
    { id: 2, title: 'Customer KYC Documents', active: false, name: 'CUSTOMER' },
    { id: 3, title: 'Configurations', active: false, name: 'CONFIGURATION' },
  ];
  chart: any = [];

  updateFilter(index: number, filter: string) {
    this.filters = this.filters.map((filter, i) => ({
      ...filter,
      active: i === index,
    }));
    if (filter != 'CONFIGURATION') {
      this.activeTab = 1;
      this.getKycs(filter);
    } else {
      this.kyscData = [];
      this.activeTab = 2;
      this.getKycsConfigurations();
    }
  }
  getKycsConfigurations() {
    this.api.get(`configuration`).subscribe({
      next: (response) => {
        this.kycConfiguration = response;
      },
      error: (error) => {
        console.error('Error fetching users:', error);
        this.kycConfiguration = [];
        // Handle any errors here, such as showing an error message to the user
      },
      complete: () => {
        console.log('Completed the request to get users.');
        // Optional: Execute any additional code after the request completes
      },
    });
  }
  addKyc() {}
}
//COMPULSORY, OPTIONAL, NO_LONGER_REQUIRED

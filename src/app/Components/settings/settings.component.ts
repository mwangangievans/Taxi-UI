import { Component } from '@angular/core';
import { UsersComponent } from '../users/users.component';
import { HttpService } from '../../service/http.service';
import { NotificationService } from '../../service/notification.service';
import { CommonModule } from '@angular/common';
import {
  configurationInterface,
  kycConfiguration,
  KycDocumentFilter,
} from '../../model';
import { LoaderComponent } from '../loader/loader.component';
import { LoaderService } from '../../service/loader.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [UsersComponent, CommonModule, LoaderComponent], // Ensure UsersComponent is standalone or declared in a shared module
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'], // Corrected from 'styleUrl' to 'styleUrls' and it should be an array
})
export class SettingsComponent {
  kyscData!: kycConfiguration[];
  kycConfiguration!: configurationInterface[];
  activeTab: 1 | 2 | 3 = 1;
  currentSelectedKycFilter!: KycDocumentFilter;
  filters: KycDocumentFilter[] = [];
  isLoading: boolean = false;

  addingKyc: boolean = false;

  ngOnInit() {
    this.loaderService.loading$.subscribe((loading) => {
      this.isLoading = loading;
    });
    this.getKycs('DRIVER');

    this.filters = [
      { id: 1, title: 'Driver KYC Documents', active: true, name: 'DRIVER' },
      {
        id: 2,
        title: 'Customer KYC Documents',
        active: false,
        name: 'CUSTOMER',
      },
      { id: 3, title: 'Configurations', active: false, name: 'CONFIGURATION' },
    ];
  }

  updateActiveTab(tab: any) {
    console.log({ tab });

    this.activeTab = tab;
  }

  constructor(
    private api: HttpService,
    private notify: NotificationService,
    private loaderService: LoaderService
  ) {
    this.isLoading = true;
  }
  getKycs(filter: string) {
    this.api
      .get<kycConfiguration[]>(`kycConfiguration?userRole=${filter}`)
      .subscribe({
        next: (response) => {
          this.kyscData = response;
        },
        error: (error) => {
          console.error('Error fetching users:', error);
          this.kyscData = [];
        },
        complete: () => {
          console.log('Completed the request to get users.');
        },
      });
  }

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
    this.api.get<configurationInterface[]>(`configuration`).subscribe({
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
  // filterByName(name: string): KycDocumentFilter {
  //   return this.filters.find((filter) => filter.name === name);
  // }
  addKyc() {}
  getStatusLabel(status: string): string {
    switch (status) {
      case 'COMPULSORY':
        return 'Mandatory';
      case 'OPTIONAL':
        return 'Optional';
      case 'NO_LONGER_REQUIRED':
        return 'No Longer Required';
      default:
        return '';
    }
  }
}
//COMPULSORY, OPTIONAL, NO_LONGER_REQUIRED

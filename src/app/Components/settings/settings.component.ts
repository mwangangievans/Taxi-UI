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
import { MatDialog } from '@angular/material/dialog';
import { IframeDisplayComponent } from '../iframe-display/iframe-display.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    UsersComponent,
    CommonModule,
    LoaderComponent,
    FormsModule,
    ReactiveFormsModule,
  ], // Ensure UsersComponent is standalone or declared in a shared module
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
  selectedFilter: string = 'DRIVER';
  kycForm: FormGroup;
  updateKyc: FormGroup;

  addingKyc: boolean = false;

  kycStatus: { name: string; title: string }[] = [
    {
      name: 'COMPULSORY',
      title: 'COMPULSORY',
    },
    {
      name: 'OPTIONAL',
      title: 'OPTIONAL',
    },
    {
      name: 'NO_LONGER_REQUIRED',
      title: 'No LONGER REQUIRED',
    },
  ];
  pecentage: { name: string; title: string }[] = [
    {
      name: '0.1',
      title: '10',
    },
    {
      name: '0.2',
      title: '20',
    },
    {
      name: '0.3',
      title: '30',
    },
    {
      name: '0.4',
      title: '40',
    },
    {
      name: '0.5',
      title: '50',
    },
    {
      name: '0.6',
      title: '60',
    },
    {
      name: '0.7',
      title: '70',
    },
    {
      name: '0.8',
      title: '80',
    },
    {
      name: '0.9',
      title: '90',
    },
    {
      name: '1',
      title: '100',
    },
  ];

  constructor(
    private api: HttpService,
    private notify: NotificationService,
    private loaderService: LoaderService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.isLoading = true;

    this.kycForm = this.fb.group({
      userRole: ['', [Validators.required]],
      title: ['', [Validators.required]],
      status: ['', Validators.required],
    });

    this.updateKyc = this.fb.group({
      configurationType: ['', [Validators.required]],
      percentageValue: [0, [Validators.required]],
    });
  }

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
    this.activeTab = tab;
  }
  updateEditForm(position: 1 | 2 | 3, data: configurationInterface) {
    this.updateKyc.patchValue({
      configurationType: data.configurationType,
      percentageValue: data.percentageValue,
    });

    this.activeTab = position;
  }
  onSubmit() {
    if (this.kycForm.valid) {
      this.api.post(`kycConfiguration`, this.kycForm.value).subscribe({
        next: (response) => {
          this.activeTab = 1;
          this.getKycs('DRIVER');

          this.kyscData = response;
        },
        error: (error) => {
          console.error('Error fetching users:', error);
          this.kyscData = [];
        },
        complete: () => {},
      });
    } else {
    }
  }
  updateConfiguration() {
    if (this.updateKyc.valid) {
      let data = {
        configurationType: this.updateKyc.value.configurationType,
        percentageValue: +this.updateKyc.value.percentageValue,
      };

      this.api.patch(`configuration`, data).subscribe({
        next: (response) => {
          this.activeTab = 1;
          this.getKycs('DRIVER');

          this.kyscData = response;
        },
        error: (error) => {
          console.error('Error fetching users:', error);
          this.kyscData = [];
        },
        complete: () => {},
      });
    } else {
    }
  }

  get title() {
    return this.kycForm.get('title');
  }

  get status() {
    return this.kycForm.get('status');
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
        complete: () => {},
      });
  }

  chart: any = [];

  updateFilter(index: number, filter: string) {
    this.kycForm.reset();

    this.selectedFilter = filter;

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
      },
      complete: () => {},
    });
  }

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

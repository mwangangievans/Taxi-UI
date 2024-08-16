import { Component } from '@angular/core';
import { HttpService } from '../../service/http.service';
import { NotificationService } from '../../service/notification.service';
import { error } from 'console';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { userInterface } from '../../model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent {
  allUsers!: userInterface[];
  ngOnInit() {
    this.getUsers('');
  }

  constructor(private api: HttpService, private notify: NotificationService) {}
  getUsers(filter: string) {
    this.api.get(`user/admin?kycVerificationStatus=${filter}`).subscribe({
      next: (response) => {
        this.allUsers = response;
        console.log('User data retrieved:', response);
        // You can process the response here, e.g., update the state or UI
      },
      error: (error) => {
        console.error('Error fetching users:', error);
        // Handle any errors here, such as showing an error message to the user
      },
      complete: () => {
        console.log('Completed the request to get users.');
        // Optional: Execute any additional code after the request completes
      },
    });
  }

  filters = [
    { id: 1, title: 'All', name: '', active: true },
    { id: 2, title: 'Pending Approval', name: 'PENDING', active: false },
    { id: 3, title: 'Accepted', name: 'ACCEPTED', active: false },
    { id: 3, title: 'Rejected', name: 'REJECTED', active: false },
  ];
  chart: any = [];

  updateFilter(index: number, filter: string) {
    this.filters = this.filters.map((filter, i) => ({
      ...filter,
      active: i === index,
    }));

    this.getUsers(filter);
  }

  // tableData = [
  //   {
  //     date: '1/07/2024',
  //     name: 'John Doe',
  //     id: '35907530',
  //     numberPlate: 'KCE 026Y',
  //     documents: 'KYC Documents',
  //     status: 'Pending',
  //   },
  //   {
  //     date: '1/07/2024',
  //     name: 'John Doe',
  //     id: '35907530',
  //     numberPlate: 'KCE 026Y',
  //     documents: 'KYC Documents',
  //     status: 'Approved',
  //   },
  //   {
  //     date: '1/07/2024',
  //     name: 'John Doe',
  //     id: '35907530',
  //     numberPlate: 'KCE 026Y',
  //     documents: 'KYC Documents',
  //     status: 'Pending',
  //   },
  //   {
  //     date: '1/07/2024',
  //     name: 'John Doe',
  //     id: '35907530',
  //     numberPlate: 'KCE 026Y',
  //     documents: 'KYC Documents',
  //     status: 'Pending',
  //   },
  //   {
  //     date: '1/07/2024',
  //     name: 'John Doe',
  //     id: '35907530',
  //     numberPlate: 'KCE 026Y',
  //     documents: 'KYC Documents',
  //     status: 'Pending',
  //   },
  // ];

  tableData = [
    {
      userId: 1,
      name: 'Seed Admin',
      email: 'admin@ride.share',
      roles: ['ADMIN'],
      userProfile: null,
    },
    {
      userId: 2,
      name: 'Brian Mbadi',
      email: 'bmbadi@gmail.com',
      roles: ['DRIVER'],
      userProfile: {
        profileId: 1,
        phoneNumber: '254790673733',
        hasVerifiedDriverProfile: true,
        hasVerifiedCustomerProfile: false,
        hasUploadedDriverKycDocuments: true,
        hasUploadedCustomerKycDocuments: false,
      },
    },
    {
      userId: 3,
      name: 'Noble Brian',
      email: 'seller.bmb@gmail.com',
      roles: ['CUSTOMER'],
      userProfile: {
        profileId: 2,
        phoneNumber: '254790673733',
        hasVerifiedDriverProfile: false,
        hasVerifiedCustomerProfile: false,
        hasUploadedDriverKycDocuments: false,
        hasUploadedCustomerKycDocuments: false,
      },
    },
    {
      userId: 4,
      name: 'evans',
      email: 'muindemwangangi2@gmail.com',
      roles: ['DRIVER'],
      userProfile: {
        profileId: 3,
        phoneNumber: '254798288410',
        hasVerifiedDriverProfile: false,
        hasVerifiedCustomerProfile: false,
        hasUploadedDriverKycDocuments: false,
        hasUploadedCustomerKycDocuments: false,
      },
    },
  ];
}

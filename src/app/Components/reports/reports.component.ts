import { Component } from '@angular/core';
import { UsersComponent } from '../users/users.component';
import { NotificationService } from '../../service/notification.service';
import { HttpService } from '../../service/http.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [UsersComponent, CommonModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css',
})
export class ReportsComponent {
  ngOnInit() {
    this.getUsers();
  }

  statistics = [
    { value: 'KES 300,000.00', title: 'Total earnings' },
    { value: '30,000', title: 'Total Commission' },
  ];

  constructor(private api: HttpService, private notify: NotificationService) {}
  getUsers() {
    this.api.get('user/admin').subscribe({
      next: (response) => {
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

  filters = [{ id: 1, title: 'Transactions', active: true }];
  chart: any = [];

  updateFilter(index: number) {
    this.filters = this.filters.map((filter, i) => ({
      ...filter,
      active: i === index,
    }));
  }

  tableData = [
    {
      date: '1/07/2024',
      name: 'John Doe',
      id: '35907530',
      numberPlate: 'KCE 026Y',
      documents: 'KYC Documents',
      status: 'Pending',
    },
    {
      date: '1/07/2024',
      name: 'John Doe',
      id: '35907530',
      numberPlate: 'KCE 026Y',
      documents: 'KYC Documents',
      status: 'Approved',
    },
    {
      date: '1/07/2024',
      name: 'John Doe',
      id: '35907530',
      numberPlate: 'KCE 026Y',
      documents: 'KYC Documents',
      status: 'Pending',
    },
    {
      date: '1/07/2024',
      name: 'John Doe',
      id: '35907530',
      numberPlate: 'KCE 026Y',
      documents: 'KYC Documents',
      status: 'Pending',
    },
    {
      date: '1/07/2024',
      name: 'John Doe',
      id: '35907530',
      numberPlate: 'KCE 026Y',
      documents: 'KYC Documents',
      status: 'Pending',
    },
  ];
}

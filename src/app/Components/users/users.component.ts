import { Component } from '@angular/core';
import { HttpService } from '../../service/http.service';
import { NotificationService } from '../../service/notification.service';
import { error } from 'console';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent {
  ngOnInit() {
    this.getUsers();
  }

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

  filters = [
    { id: 1, title: 'All', active: true },
    { id: 2, title: 'Pending Approval', active: false },
    { id: 3, title: 'Approval', active: false },
  ];
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

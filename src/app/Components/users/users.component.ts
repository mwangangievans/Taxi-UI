import { Component } from '@angular/core';
import { HttpService } from '../../service/http.service';
import { NotificationService } from '../../service/notification.service';
import { error } from 'console';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { userInterface } from '../../model';
import { addIcons } from 'ionicons';
import { HttpClient } from '@angular/common/http';
import { DynamicTableComponent } from '../dynamic-table/dynamic-table.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, RouterModule, DynamicTableComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent {
  allUsers!: userInterface[];

  displayedColumns: string[] = [
    '#',
    'Name',
    'ROLE',
    'EMAIL',
    'PHONE NUMBER',
    'More',
  ];
  data: any[] = [];
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  constructor(
    private _httpClient: HttpClient,
    private api: HttpService,
    private notify: NotificationService
  ) {}

  ngOnInit() {
    // this._httpClient
    //   .get('https://api.github.com/search/issues?q=repo:angular/components')
    //   .subscribe(
    //     (response: any) => {
    //       this.resultsLength = response.total_count;
    //       this.data = response.items;
    //       this.isLoadingResults = false;
    //     },
    //     (error) => {
    //       this.isRateLimitReached = true;
    //       this.isLoadingResults = false;
    //     }
    //   );
    this.getUsers('');
  }

  getUsers(filter: string) {
    this.api
      .get<userInterface[]>(`user/admin?kycVerificationStatus=${filter}`)
      .subscribe({
        next: (response) => {
          this.allUsers = response;
          console.log('User data retrieved:', response);
        },
        error: (error) => {
          console.error('Error fetching users:', error);
        },
        complete: () => {
          console.log('Completed the request to get users.');
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

  getRole(role: any) {
    return role[0] === 'ADMIN';
  }
}

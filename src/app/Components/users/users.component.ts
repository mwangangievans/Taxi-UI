import { Component } from '@angular/core';
import { HttpService } from '../../service/http.service';
import { NotificationService } from '../../service/notification.service';
import { error } from 'console';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { userInterface } from '../../model';
import { addIcons } from 'ionicons';
import { HttpClient } from '@angular/common/http';
import { LoaderService } from '../../service/loader.service';
import { LoaderComponent } from '../loader/loader.component';
import { HelperService } from '../../service/helper.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, RouterModule, LoaderComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent {
  allUsers: userInterface[] = [];
  totalItems: number = 0; // Total number of users from the server
  pageSize: number = 5; // Number of users per page
  currentPage: number = 0; // The current page number
  isLoading: boolean = false;

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
    private notify: NotificationService,
    private loaderService: LoaderService,
    private route: ActivatedRoute,
    public helper: HelperService
  ) {
    this.isLoading = true;
  }

  ngOnInit() {
    this.loaderService.loading$.subscribe((loading) => {
      this.isLoading = loading;
    });
    this.getUsers('', this.currentPage, this.pageSize);
  }

  getUsers(filter: string, pageIndex: number, pageSize: number) {
    const params = {
      kycVerificationStatus: filter,
      page: pageIndex.toString(),
      size: pageSize.toString(),
    };

    this.api
      .get<userInterface[]>(
        `user/admin?kycVerificationStatus=${filter}&pageNumber=${params.page}&pageSize=${params.size}`
      )
      .subscribe({
        next: (response: any) => {
          this.allUsers = [];
          this.allUsers = response;
          this.totalItems = response.length; // Assuming totalItems is sent from the backend
        },
        error: (error) => {
          console.error('Error fetching users:', error);
        },
        complete: () => {},
      });
  }

  onPageChange(pageIndex: number) {
    this.currentPage = pageIndex;
    console.log('totalItems', this.totalItems, 'currentPage', this.currentPage);

    this.getUsers('', this.currentPage, this.pageSize);
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
    this.currentPage = 0;

    this.getUsers(filter, this.currentPage, this.pageSize);
  }

  getRole(role: any) {
    return role[0] === 'ADMIN';
  }
}

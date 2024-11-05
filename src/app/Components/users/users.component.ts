import { Component } from '@angular/core';
import { HttpService } from '../../service/http.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { userInterface } from '../../model';
import { LoaderService } from '../../service/loader.service';
import { LoaderComponent } from '../loader/loader.component';
import { HelperService } from '../../service/helper.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, RouterModule, LoaderComponent],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent {
  allUsers: userInterface[] = [];
  totalItems: number = 0; // Total number of users from the server
  pageSize: number = 5; // Number of users per page
  currentPage: number = 0; // The current page number
  totalPages: number = 0; // Total number of pages
  isLoading: boolean = false;

  displayedColumns: string[] = [
    '#',
    'Name',
    'ROLE',
    'EMAIL',
    'PHONE NUMBER',
    'More',
  ];

  constructor(
    private api: HttpService,
    private loaderService: LoaderService,
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
      .get<any>(
        `user/v2/admin?kycVerificationStatus=${filter}&pageNumber=${params.page}&pageSize=${params.size}`
      )
      .subscribe({
        next: (response) => {
          // Update data based on the new response structure
          this.allUsers = response.users;
          this.totalItems = response.totalRecords;
          this.totalPages = response.totalPages;
          this.currentPage = response.currentPage;
        },
        error: (error) => {
          console.error('Error fetching users:', error);
        },
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
    { id: 4, title: 'Rejected', name: 'REJECTED', active: false },
  ];

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

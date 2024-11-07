import { Component } from '@angular/core';
import { UsersComponent } from '../users/users.component';
import { NotificationService } from '../../service/notification.service';
import { HttpService } from '../../service/http.service';
import { CommonModule } from '@angular/common';
import { GeoResponse, Transaction } from '../../model';
import { addIcons } from 'ionicons';
import { IframeDisplayComponent } from '../iframe-display/iframe-display.component';
import { LoaderComponent } from '../loader/loader.component';
import { LoaderService } from '../../service/loader.service';

export interface Earnings {
  totalEarnings: number;
  totalCommission: number;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    UsersComponent,
    CommonModule,
    IframeDisplayComponent,
    LoaderComponent,
  ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css',
})
export class ReportsComponent {
  Transactions: Transaction[] = [];
  totalItems: number = 0; // Total number of users from the server
  pageSize: number = 10; // Number of users per page
  currentPage: number = 0; // The current page number
  totalPages: number = 0; // Total pages available from the API
  totalEarnings: number = 0;
  totalCommission: number = 0;
  isLoading: boolean = false;
  earningsAndCommission!: Earnings;

  ngOnInit() {
    this.loaderService.loading$.subscribe((loading) => {
      this.isLoading = loading;
    });
    this.getTransactions(this.currentPage, this.pageSize);
    this.getEarningsAndCommission();
  }

  constructor(
    private api: HttpService,
    private notify: NotificationService,
    private loaderService: LoaderService
  ) {
    this.isLoading = true;
  }
  getTransactions(pageIndex: number, pageSize: number) {
    const params = {
      page: pageIndex.toString(),
      size: pageSize.toString(),
    };

    this.api
      .get<any>(
        `report/v2/transaction?pageNumber=${params.page}&pageSize=${params.size}`
      )
      .subscribe({
        next: (response) => {
          this.totalItems = response.totalRecords;
          this.totalPages = response.totalPages;
          this.Transactions = this.formatTransactions(response.transactions);
        },
        error: (error) => {
          this.api.handleError('Error fetching transactions.', error);
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }
  getEarningsAndCommission() {
    //http://46.101.104.128:7823/api/report/admin/earningsAndCommission

    this.api.get<Earnings>(`report/admin/earningsAndCommission`).subscribe({
      next: (response) => {
        this.earningsAndCommission = response;
      },
      error: (error) => {},
      complete: () => {},
    });
  }

  onPageChange(pageIndex: number) {
    this.currentPage = pageIndex;
    this.getTransactions(this.currentPage, this.pageSize);
  }

  filters = [{ id: 1, title: 'Transactions', active: true }];

  formatTransactions(transactions: any[]): Transaction[] {
    return transactions.map((transaction) => ({
      transactionId: transaction.transactionId,
      transactionDate: transaction.transactionDate,
      amount: transaction.amount,
      commissionAmount: transaction.commissionAmount,
      startPointReverseGeoCoordinatesResponse: this.parseGeoCoordinatesResponse(
        transaction.startPointReverseGeoCoordinatesResponse
      ),
      destinationReverseGeoCoordinatesResponse:
        this.parseGeoCoordinatesResponse(
          transaction.destinationReverseGeoCoordinatesResponse
        ),
    }));
  }
  parseGeoCoordinatesResponse(response: string): string {
    const parsedResponse: GeoResponse = JSON.parse(response);
    return parsedResponse.name || parsedResponse.display_name;
  }
  updateFilter(index: number) {
    this.filters = this.filters.map((filter, i) => ({
      ...filter,
      active: i === index,
    }));
    this.currentPage = 0;
  }
  calculateTotalAmount(transactions: Transaction[]): number {
    return transactions.reduce(
      (total, transaction) => total + transaction.amount,
      0
    );
  }
  calculateTotalCommissions(transactions: Transaction[]): number {
    return transactions.reduce(
      (total, transaction) => total + transaction.commissionAmount,
      0
    );
  }
}

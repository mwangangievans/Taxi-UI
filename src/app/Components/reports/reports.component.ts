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
  pageSize: number = 5; // Number of users per page
  currentPage: number = 0; // The current page number
  totalearings: number = 0;
  totalCommission: number = 0;
  isLoading: boolean = false;

  ngOnInit() {
    this.loaderService.loading$.subscribe((loading) => {
      this.isLoading = loading;
    });
    this.getTransactions(this.currentPage, this.pageSize);
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
    //        `user/admin?pageNumber=${params.page}&pageSize=${params.size}`,

    this.api
      .get<Transaction[]>(
        `report/transaction?pageNumber=${params.page}&pageSize=${params.size}`
      )
      .subscribe({
        next: (response) => {
          this.totalItems = response.length;
          this.Transactions = this.formatTransactions(response);

          if (this.Transactions.length) {
            this.totalearings = this.calculateTotalAmount(this.Transactions);
            this.totalCommission = this.calculateTotalCommissions(
              this.Transactions
            );
          }

          console.log('Transactions', this.Transactions);
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
    return transactions
      .map((transaction) => ({
        transactionId: transaction.transactionId,
        transactionDate: transaction.transactionDate,
        amount: transaction.amount,
        commissionAmount: transaction.commissionAmount,
        startPointReverseGeoCoordinatesResponse:
          this.parseGeoCoordinatesResponse(
            transaction.startPointReverseGeoCoordinatesResponse
          ),
        destinationReverseGeoCoordinatesResponse:
          this.parseGeoCoordinatesResponse(
            transaction.destinationReverseGeoCoordinatesResponse
          ),
      }))
      .reverse();
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

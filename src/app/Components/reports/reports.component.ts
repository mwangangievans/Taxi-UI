import { Component } from '@angular/core';
import { UsersComponent } from '../users/users.component';
import { NotificationService } from '../../service/notification.service';
import { HttpService } from '../../service/http.service';
import { CommonModule } from '@angular/common';
import { GeoResponse, Transaction } from '../../model';
import { addIcons } from 'ionicons';
import { IframeDisplayComponent } from '../iframe-display/iframe-display.component';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [UsersComponent, CommonModule, IframeDisplayComponent],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css',
})
export class ReportsComponent {
  Transactions: Transaction[] = [];
  totalearings: number = 0;
  totalCommission: number = 0;

  ngOnInit() {
    this.getTransactions();
  }

  // statistics = [
  //   { value: 'KES 300,000.00', title: 'Total earnings' },
  //   { value: '30,000', title: 'Total Commission' },
  // ];

  constructor(private api: HttpService, private notify: NotificationService) {}
  getTransactions() {
    this.api.get<Transaction[]>('report/transaction').subscribe({
      next: (response) => {
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

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { formatDate } from '@angular/common';
import { graphData, Statistics } from '../model';
import { environment } from '../../environments/environment';
import { UserSessionService } from './user-session.service';
import { HelperService } from './helper.service';

const baseUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(
    private http: HttpClient,
    private userSessionService: UserSessionService,
    private helper: HelperService
  ) {}

  private setHeaders(): HttpHeaders {
    return new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${
        this.userSessionService.getSession()?.accessToken || ''
      }`,
    });
  }

  getGraphData(filter: string): Observable<any> {
    return this.http
      .get<graphData[]>(
        `${baseUrl}report/admin/dashboard/earnings?earningGroup=${filter.toUpperCase()}`,
        {
          headers: this.setHeaders(),
        }
      )
      .pipe(
        map((response) => {
          if (filter === 'Daily') {
            return this.processDailyData(response);
          }
          if (filter === 'Weekly') {
            return this.helper.mergeArrays(response);
          }
          if (filter === 'Monthly') {
            return response;
          }
          return;
        })
      );
  }

  private processDailyData(data: graphData[]): graphData[] {
    const last7Days = this.getLast7Days(); // Get the last 7 days including today

    return last7Days.map((date) => {
      const dateKey = formatDate(date, 'yyyy-MM-dd', 'en');
      const dayData = data.find((item) => item.dateKey === dateKey);
      return {
        dateKey,
        totalAmount: dayData ? dayData.totalAmount : 0,
      };
    });
  }

  private getLast7Days(): Date[] {
    const today = new Date();
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      days.push(date);
    }
    return days; // Returns the days in reverse order, starting from today
  }

  formatChartData(
    data: graphData[],
    filter: string
  ): { labels: string[]; datasets: any[] } {
    let labels: string[] = [];
    let earnings: number[] = [];

    switch (filter) {
      case 'Daily':
        labels = this.getLast7DaysLabels().reverse();
        earnings = data.map((item) => item.totalAmount).reverse();

        break;

      case 'Weekly':
        // Extract only the `range` from the returned object
        labels = this.getLast8WeeksLabels()
          .map((week) => week.daterange)
          .reverse();
        earnings = this.aggregateWeeklyData(data);

        break;

      case 'Monthly':
        labels = this.getMonthLabels();
        earnings = this.aggregateMonthlyData(data);

        break;

      default:
        throw new Error(`Unknown filter: ${filter}`);
    }

    return {
      labels,
      datasets: [
        {
          label: 'Earnings',
          data: earnings,
          backgroundColor: ['rgb(43,104,71)'],
          borderColor: ['rgb(80,162,158)'],
          borderWidth: 1,
        },
      ],
    };
  }

  private getLast7DaysLabels(): string[] {
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      return formatDate(date, 'EEE', 'en'); // Format as day name (e.g., Mon, Tue)
    }); // Reversing the array to have the earliest date first
  }

  private getLast8WeeksLabels(): { datekey: string; daterange: string }[] {
    const weekNumbers = this.helper.getLastEightWeeks();
    return this.helper.getWeekDataWithDateRange(weekNumbers);
  }

  private getISOWeekNumber(date: Date): number {
    const tempDate = new Date(date);
    tempDate.setHours(0, 0, 0, 0);
    tempDate.setDate(tempDate.getDate() + 4 - (tempDate.getDay() || 7)); // Adjust to the nearest Thursday
    const yearStart = new Date(tempDate.getFullYear(), 0, 1);
    const weekNo = Math.ceil(
      ((tempDate.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
    );
    return weekNo;
  }

  private getMonthLabels(): string[] {
    return [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
  }

  aggregateWeeklyData(data: graphData[]): number[] {
    const updatedAmounts: number[] = [];

    for (let i = 0; i < data.length; i++) {
      updatedAmounts[i] = data[i].totalAmount;
    }

    return updatedAmounts;
  }

  private aggregateMonthlyData(data: graphData[]): number[] {
    const monthlyEarnings = Array(12).fill(0);
    data.forEach((item) => {
      const date = new Date(item.dateKey);
      const monthIndex = date.getMonth(); // 0-based
      monthlyEarnings[monthIndex] += item.totalAmount;
    });
    return monthlyEarnings;
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { formatDate } from '@angular/common';
import { graphData, Statistics } from '../model';
import { environment } from '../../environments/environment';
import { UserSessionService } from './user-session.service';

const baseUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(
    private http: HttpClient,
    private userSessionService: UserSessionService
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

  getGraphData(filter: string): Observable<graphData[]> {
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
          // Assume API returns aggregated data for 'Weekly' and 'Monthly'
          return response;
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
        labels = this.getLast8WeeksLabels();
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
          backgroundColor: ['rgb(1,120,115)'],
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

  private getLast8WeeksLabels(): string[] {
    const currentDate = new Date();
    const weekLabels: string[] = [];
    for (let i = 7; i >= 0; i--) {
      const weekDate = new Date(currentDate);
      weekDate.setDate(currentDate.getDate() - i * 7);
      weekLabels.push(formatDate(weekDate, 'MMM d', 'en')); // e.g., Aug 22
    }
    return weekLabels;
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

  private aggregateWeeklyData(data: graphData[]): number[] {
    const weeklyEarnings = Array(8).fill(0);
    const last8Weeks = this.getLast8WeeksDateRanges();

    data.forEach((item) => {
      const itemDate = new Date(item.dateKey);
      last8Weeks.forEach((week, index) => {
        const [weekStart, weekEnd] = week;
        if (itemDate >= weekStart && itemDate <= weekEnd) {
          weeklyEarnings[index] += item.totalAmount;
        }
      });
    });

    return weeklyEarnings;
  }

  private getLast8WeeksDateRanges(): [Date, Date][] {
    const currentDate = new Date();
    const last8Weeks: [Date, Date][] = [];

    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date(currentDate);
      weekStart.setDate(currentDate.getDate() - i * 7);
      weekStart.setHours(0, 0, 0, 0);

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      last8Weeks.push([weekStart, weekEnd]);
    }

    return last8Weeks;
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

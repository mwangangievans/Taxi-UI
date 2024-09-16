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
        // Extract only the `range` from the returned object
        labels = this.getLast8WeeksLabels().map((week) => week.range);
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

  private getLast8WeeksLabels(): { index: string; range: string }[] {
    const currentDate = new Date();
    const weekLabels: { index: string; range: string }[] = [];

    for (let i = 0; i < 8; i++) {
      // Create a new Date object for each week
      const endOfWeek = new Date(currentDate);
      endOfWeek.setDate(currentDate.getDate() - i * 7);

      const startOfWeek = new Date(endOfWeek);
      startOfWeek.setDate(endOfWeek.getDate() - 6);

      // Get the ISO year and week number
      const year = endOfWeek.getFullYear();
      const weekNumber = this.getISOWeekNumber(endOfWeek);

      // Build the index in "YYYYWW" format
      const index = `${year}${weekNumber.toString().padStart(2, '0')}`;

      // Format the date range for display
      const startMonth = formatDate(startOfWeek, 'MMM', 'en');
      const endMonth = formatDate(endOfWeek, 'MMM', 'en');

      let range = '';

      if (startMonth === endMonth) {
        // Same month, only show the month once
        range = `${startMonth} ${formatDate(
          startOfWeek,
          'd',
          'en'
        )} to ${formatDate(endOfWeek, 'd', 'en')}`;
      } else {
        // Different months, show both
        range = `${startMonth} ${formatDate(
          startOfWeek,
          'd',
          'en'
        )} to ${endMonth} ${formatDate(endOfWeek, 'd', 'en')}`;
      }

      // Push the index and date range into the array
      weekLabels.push({ index, range });
    }

    return weekLabels.reverse(); // Reverse to show the earliest week first
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

  private aggregateWeeklyData(data: graphData[]): number[] {
    console.log('Weekly data:', data);

    // Initialize the array to hold weekly earnings for the last 8 weeks
    const weeklyEarnings = Array(8).fill(0);
    const last8Weeks = this.getLast8WeeksDateRanges(); // Get the last 8 weeks date ranges

    // Convert date ranges from last8Weeks to Date objects for comparison
    const weekRanges = last8Weeks.map((range) => {
      const [start, end] = range;
      return {
        start: new Date(start),
        end: new Date(end),
      };
    });

    // Aggregate earnings
    data.forEach((item) => {
      // Check if dateKey is valid and is a string
      if (
        item.dateKey &&
        typeof item.dateKey === 'string' &&
        item.dateKey.length === 6
      ) {
        const year = parseInt(item.dateKey.substring(0, 4), 10);
        const week = parseInt(item.dateKey.substring(4), 10);

        // Validate year and week
        if (!isNaN(year) && !isNaN(week) && week >= 1 && week <= 53) {
          const date = this.getDateFromWeek(year, week); // Convert week and year to a Date object

          // Aggregate total amount based on the week range
          weekRanges.forEach((range, index) => {
            if (date >= range.start && date <= range.end) {
              weeklyEarnings[index] += item.totalAmount;
            }
          });
        } else {
          console.warn(`Invalid year or week in dateKey: ${item.dateKey}`);
        }
      } else {
        console.warn(`Invalid dateKey format: ${item.dateKey}`);
      }
    });

    console.log('Weekly data - Weekly earnings:', weeklyEarnings);

    return weeklyEarnings;
  }

  // Helper function to convert year and week number to a Date object (e.g., the start of the week)
  private getDateFromWeek(year: number, week: number): Date {
    const janFirst = new Date(year, 0, 1);
    const days = (week - 1) * 7;
    return new Date(janFirst.setDate(janFirst.getDate() + days));
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

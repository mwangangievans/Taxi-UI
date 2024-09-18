import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class HelperService {
  constructor(private router: Router) {}
  navigateToAnotherComponent(route: string) {
    this.router.navigate([route]);
  }

  /**
   * Get the week data with date ranges for each week.
   *
   * @param {string[]} weekNumbers - Array of week numbers in the format 'YYYYWW'.
   * @returns {{ datekey: string, daterange: string }[]} - Array of objects containing the week number and the date range.
   */
  getWeekDataWithDateRange(weekNumbers: string[]) {
    return weekNumbers.map((weekNumber: string) => {
      // Extract the year and week number from the string
      const year = parseInt(weekNumber.slice(0, 4), 10);
      const week = parseInt(weekNumber.slice(4), 10);

      // Get the Monday date of the specified week
      const mondayDate = this.getMondayOfWeek(year, week);

      // Calculate the Sunday date of the same week
      const sundayDate = new Date(mondayDate);
      sundayDate.setDate(mondayDate.getDate() + 6);

      // Format the date range
      const dateRange = this.formatDateRange(mondayDate, sundayDate);

      // Return the result as an object
      return {
        datekey: weekNumber,
        daterange: dateRange,
      };
    });
  }

  /**
   * Get the Monday of the specified week in the year.
   *
   * @param {number} year - The year of the week.
   * @param {number} week - The week number.
   * @returns {Date} - The date of the Monday for the given week.
   */
  getMondayOfWeek(year: number, week: number) {
    const firstDayOfYear = new Date(year, 0, 1);
    const daysOffset = (week - 1) * 7;
    const firstMonday = new Date(
      firstDayOfYear.setDate(
        firstDayOfYear.getDate() - firstDayOfYear.getDay() + 1
      )
    );
    return new Date(firstMonday.setDate(firstMonday.getDate() + daysOffset));
  }

  /**
   * Format the date range to show the correct format.
   *
   * @param {Date} startDate - The starting date (Monday).
   * @param {Date} endDate - The ending date (Sunday).
   * @returns {string} - The formatted date range, showing month once if within the same month.
   */
  formatDateRange(startDate: Date, endDate: Date) {
    const startDay = startDate.getDate();
    const endDay = endDate.getDate();

    const startMonth = startDate.toLocaleString('default', { month: 'short' });
    const endMonth = endDate.toLocaleString('default', { month: 'short' });

    const startYear = startDate.getFullYear();

    if (startMonth === endMonth) {
      return `${startMonth} ${startDay} to ${endDay}`;
    } else {
      return `${startMonth} ${startDay} to ${endMonth} ${endDay}`;
    }
  }

  // Example usage:
  weekNumbers = [
    '202438',
    '202437',
    '202436',
    '202435',
    '202434',
    '202433',
    '202432',
    '202431',
  ];

  /**
   * @typedef {string} WeekString A string representing the week in the format 'YYYYWW'
   */

  /**
   * Get the last eight weeks in the format 'YYYYWW'.
   *
   * @returns {WeekString[]} An array of last eight weeks as strings in the 'YYYYWW' format.
   */
  getLastEightWeeks() {
    /** @type {WeekString[]} */
    const weeks = [];

    /** @type {Date} */
    const currentDate = new Date();

    /** @type {number} */
    let currentYear = currentDate.getFullYear();

    /** @type {number} */
    const currentWeek = this.getWeekNumber(currentDate);

    // Loop to get the last eight weeks
    for (let i = 0; i < 8; i++) {
      /** @type {number} */
      let week = currentWeek - i;

      // Handle week underflow (i.e., week goes below 1)
      if (week <= 0) {
        currentYear--;
        week = this.getWeeksInYear(currentYear) + week;
      }

      /** @type {WeekString} */
      const formattedWeek = `${currentYear}${String(week).padStart(2, '0')}`;
      weeks.push(formattedWeek);
    }

    return weeks;
  }

  /**
   * Get the ISO week number for a given date.
   *
   * @param {Date} date The date to calculate the week number from.
   * @returns {number} The ISO week number of the year.
   */
  getWeekNumber(date: Date): number {
    // Get the first day of the year
    const startDate: Date = new Date(date.getFullYear(), 0, 1);

    // Calculate the number of days between the date and the start of the year
    const diffInMs: number = date.getTime() - startDate.getTime();
    const days: number = Math.floor(diffInMs / (24 * 60 * 60 * 1000));

    // Calculate the current week number
    const dayOfWeek: number = date.getDay();
    return Math.ceil((dayOfWeek + 1 + days) / 7);
  }

  /**
   * Get the number of weeks in a given year.
   *
   * @param {number} year The year to get the number of weeks for.
   * @returns {number} The total number of weeks in the year.
   */
  getWeeksInYear(year: any) {
    const lastDay = new Date(year, 11, 31);
    return this.getWeekNumber(lastDay);
  }

  mergeArrays(amountData: any) {
    const weekNumbers = this.getLastEightWeeks();
    const WeekDataWithDateRange = this.getWeekDataWithDateRange(weekNumbers);
    // Convert amountData into a map for faster lookup

    const amountMap = new Map();
    amountData.forEach((item: any) => {
      amountMap.set(item.dateKey, item.totalAmount);
    });

    // Map over the whatsappData and add totalAmount to each entry
    const updatedData = WeekDataWithDateRange.map((item: any) => {
      // Get the totalAmount from amountMap or set it to 0 if not found
      const totalAmount = amountMap.get(item.datekey) || 0;

      return {
        datekey: item.datekey,
        totalAmount: totalAmount,
      };
    });

    return updatedData;
  }
}

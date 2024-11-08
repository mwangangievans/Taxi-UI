import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NotificationService } from '../../service/notification.service';
import { graphData, Statistics } from '../../model';
import { ChartService } from '../../service/chart.service';
import { DataService } from '../../service/data.service';
import { CommonModule } from '@angular/common';
import { UsersComponent } from '../users/users.component';
import { HttpService } from '../../service/http.service';
import { LoaderService } from '../../service/loader.service';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, UsersComponent, LoaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  statistics!: Statistics;
  dailyData: graphData[] = [];
  weeklyData: graphData[] = [];
  monthlyData: graphData[] = [];
  isLoading: boolean = false;

  filters = [
    { id: 1, title: 'Daily', active: true },
    { id: 2, title: 'Weekly', active: false },
    { id: 3, title: 'Monthly', active: false },
  ];

  constructor(
    private chartService: ChartService,
    private dataService: DataService,
    private notify: NotificationService,
    private api: HttpService,
    private loaderService: LoaderService
  ) {}

  ngOnInit() {
    this.loaderService.loading$.subscribe((loading) => {
      this.isLoading = loading;
    });
    this.loadGraphData('Daily');
    this.getStatistics();
  }

  ngAfterViewInit() {
    this.updateChart('Daily');
  }

  loadGraphData(filter: string) {
    this.dataService.getGraphData(filter).subscribe({
      next: (data) => {
        switch (filter) {
          case 'Daily':
            this.dailyData = data;
            break;
          case 'Weekly':
            this.weeklyData = data;

            break;
          case 'Monthly':
            this.monthlyData = data;
            break;
        }
        this.updateChart(filter);
      },
      error: (error) =>
        this.notify.showError(
          `Error fetching ${filter.toLowerCase()} data: ${error.message}`,
          `Error`
        ),
    });
  }

  updateChart(filter: string) {
    const data = this.dataService.formatChartData(
      filter === 'Daily'
        ? this.dailyData
        : filter === 'Weekly'
        ? this.weeklyData
        : this.monthlyData,
      filter
    );
    this.chartService.destroyChart();
    this.chartService.initializeChart('canvas', data);
  }

  onFilterClick(filterTitle: string) {
    this.filters.forEach((filter) => (filter.active = false));
    const selectedFilter = this.filters.find(
      (filter) => filter.title === filterTitle
    );
    if (selectedFilter) {
      selectedFilter.active = true;
    }
    this.loadGraphData(filterTitle);
  }

  handleNullValue(value: number | null): number {
    return value === null ? 0 : value;
  }

  getStatistics() {
    this.api.get<Statistics>(`report/admin/dashboard/stats`).subscribe({
      next: (response) => {
        this.statistics = response;
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      },
      complete: () => {},
    });
  }
}

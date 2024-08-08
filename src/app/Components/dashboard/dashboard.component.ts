import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import Chart from 'chart.js/auto';
import { UsersComponent } from '../users/users.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, UsersComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  statistics = [
    { value: 'KES 300,000.00', title: 'Total earnings' },
    { value: '3,000', title: 'Drivers' },
    { value: '23,000', title: 'Passagers' },
    { value: '120', title: 'Trips ' },
  ];
  filters = [
    { id: 1, title: 'day', active: true },
    { id: 2, title: 'Week', active: false },
    { id: 3, title: 'Year', active: false },
  ];
  chart: any = [];

  ngOnInit() {
    this.chart = new Chart('canvas', {
      type: 'bar',
      data: {
        labels: [
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
        ],
        datasets: [
          {
            label: 'Earnings',
            data: [1000, 20, 50, 100, 800, 150, 250, 250, 600, 500, 350, 70],
            backgroundColor: ['rgb(1,120,115)'],
            borderColor: ['rgb(80,162,158)'],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return '$ ' + value;
              },
              font: {
                weight: 'bold',
              },
            },
          },
        },
      },
    });
  }

  updateFilter(index: number) {
    this.filters = this.filters.map((filter, i) => ({
      ...filter,
      active: i === index,
    }));
  }
}

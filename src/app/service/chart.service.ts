import { Injectable } from '@angular/core';
import Chart from 'chart.js/auto';

@Injectable({
  providedIn: 'root',
})
export class ChartService {
  private chart: any;

  initializeChart(chartElementId: string, data: any) {
    this.chart = new Chart(chartElementId, {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return 'KES ' + value;
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

  updateChartData(data: any) {
    if (this.chart) {
      this.chart.data = data;
      this.chart.update();
    }
  }

  destroyChart() {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}

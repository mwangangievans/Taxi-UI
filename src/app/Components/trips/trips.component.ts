import { Component } from '@angular/core';
import { NotificationService } from '../../service/notification.service';
import { HttpService } from '../../service/http.service';
import { CommonModule } from '@angular/common';
import { TrancateWordsPipe } from '../../service/trancate-words.pipe';
import { MatTooltipModule } from '@angular/material/tooltip';
import { tripInterface } from '../../model';

@Component({
  selector: 'app-trips',
  standalone: true,
  imports: [CommonModule, MatTooltipModule, TrancateWordsPipe],
  templateUrl: './trips.component.html',
  styleUrl: './trips.component.css',
})
export class TripsComponent {
  display_name!: string;
  tripdata!: tripInterface[];
  ngOnInit() {
    this.getTrips('');
  }

  constructor(private api: HttpService, private notify: NotificationService) {}
  getTrips(filter: string) {
    this.api.get(`trip?tripCompletionStatus=${filter}`).subscribe({
      next: (response) => {
        this.tripdata = response;
        // You can process the response here, e.g., update the state or UI
      },
      error: (error) => {
        console.error('comming soon:', error);
        this.tripdata = [];
      },
      complete: () => {
        console.log('Completed the request to get users.');
        // Optional: Execute any additional code after the request completes
      },
    });
  }

  filters = [
    { id: 1, title: 'All TRIPS', name: '', active: true },
    { id: 2, title: 'UPCOMING', name: 'UPCOMING', active: false },
    { id: 3, title: 'COMPLETED', name: 'COMPLETED', active: false },
    {
      id: 4,
      title: 'Pending Payments',
      name: 'Pending Payments',
      active: false,
    },
    {
      id: 5,
      title: 'Completed Payments',
      name: 'Completed Payments',
      active: false,
    },
  ];
  chart: any = [];

  updateFilter(index: number, filter: string) {
    this.filters = this.filters.map((filter, i) => ({
      ...filter,
      active: i === index,
    }));

    this.getTrips(filter);
  }

  getPlaceName(startPointReverseGeoCoordinatesResponse: string): string {
    try {
      // Parse the JSON string into an object
      const geoData = JSON.parse(startPointReverseGeoCoordinatesResponse);
      this.display_name = geoData.display_name;

      // Access and return the name property
      return geoData.display_name;
    } catch (error) {
      console.error('Error parsing JSON data:', error);
      return '';
    }
  }
}

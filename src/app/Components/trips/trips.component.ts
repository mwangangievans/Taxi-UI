import { Component } from '@angular/core';
import { NotificationService } from '../../service/notification.service';
import { HttpService } from '../../service/http.service';
import { CommonModule } from '@angular/common';
import { TrancateWordsPipe } from '../../service/trancate-words.pipe';
import { MatTooltipModule } from '@angular/material/tooltip';
import { tripInterface } from '../../model';
import { addIcons } from 'ionicons';
import { RouterModule } from '@angular/router';
import { LoaderService } from '../../service/loader.service';
import { LoaderComponent } from '../loader/loader.component';

interface TripApiResponse {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  trips: tripInterface[];
}

@Component({
  selector: 'app-trips',
  standalone: true,
  imports: [
    CommonModule,
    MatTooltipModule,
    TrancateWordsPipe,
    RouterModule,
    LoaderComponent,
  ],
  templateUrl: './trips.component.html',
  styleUrl: './trips.component.css',
})
export class TripsComponent {
  display_name!: string;
  isLoading: boolean = false;
  filter: string = '';

  tripdata: tripInterface[] = [];
  totalItems: number = 0; // Total number of trips from the server
  pageSize: number = 5; // Number of trips per page
  currentPage: number = 0; // The current page number

  ngOnInit() {
    this.loaderService.loading$.subscribe((loading) => {
      this.isLoading = loading;
    });
    this.getTrips('', this.currentPage, this.pageSize);
  }

  constructor(private api: HttpService, private loaderService: LoaderService) {
    this.isLoading = true;
  }

  getTrips(filter: string, pageIndex: number, pageSize: number) {
    console.log('Fetching trips with filter:', filter);

    const params = {
      kycVerificationStatus: filter,
      page: pageIndex.toString(),
      size: pageSize.toString(),
    };

    this.api
      .get<TripApiResponse>(
        `trip/v2?tripCompletionStatus=${filter}&pageNumber=${params.page}&pageSize=${params.size}`
      )
      .subscribe({
        next: (response) => {
          this.tripdata = response.trips || [];
          this.totalItems = response.totalRecords;
          this.currentPage = response.currentPage;
          // Reverse the trips array if needed
          this.tripdata = this.tripdata;
        },
        error: (error) => {
          console.error('Error fetching trips:', error);
          this.tripdata = [];
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }

  onPageChange(pageIndex: number) {
    this.currentPage = pageIndex;
    this.getTrips(this.filter, this.currentPage, this.pageSize);
  }

  filters = [
    { id: 1, title: 'All TRIPS', name: '', active: true },
    { id: 2, title: 'UPCOMING', name: 'UPCOMING', active: false },
    { id: 3, title: 'COMPLETED', name: 'COMPLETED', active: false },
  ];
  chart: any = [];

  updateFilter(index: number, filter: string) {
    this.filter = filter;
    this.filters = this.filters.map((filter, i) => ({
      ...filter,
      active: i === index,
    }));
    this.currentPage = 0;

    this.getTrips(this.filter, this.currentPage, this.pageSize);
  }

  getPlaceName(startPointReverseGeoCoordinatesResponse: string): string {
    try {
      const geoData = JSON.parse(startPointReverseGeoCoordinatesResponse);
      this.display_name = geoData.display_name;
      return geoData.display_name;
    } catch (error) {
      console.error('Error parsing JSON data:', error);
      return '';
    }
  }
}

import { Component } from '@angular/core';
import {
  FileLink,
  tripInterface,
  UserKycDocument,
  UserResponse,
} from '../../model';
import { NotificationService } from '../../service/notification.service';
import { HttpService } from '../../service/http.service';
import { ActivatedRoute } from '@angular/router';
import { computeMsgId } from '@angular/compiler';
import { CommonModule } from '@angular/common';
import { TripsComponent } from '../trips/trips.component';
import { TrancateWordsPipe } from '../../service/trancate-words.pipe';

@Component({
  selector: 'app-users-detail',
  standalone: true,
  imports: [CommonModule, TripsComponent, TrancateWordsPipe],
  templateUrl: './users-detail.component.html',
  styleUrl: './users-detail.component.css',
})
export class UsersDetailComponent {
  userObject!: UserResponse;
  userKycDoc: UserKycDocument[] = [];
  downLoadLink!: FileLink;
  tripdata!: tripInterface[];
  display_name!: string;

  userId: string = '';

  constructor(
    private api: HttpService,
    private notify: NotificationService,
    private _Activatedroute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.userId = this._Activatedroute.snapshot.paramMap.get('id') ?? '';
    if (this.userId) {
      this.getUserDetails(this.userId);
      this.getUserKycDocs(this.userId);
      this.getTrips('', this.userId);
    }
  }
  filters = [
    { id: 1, name: 'UPCOMING', active: true },
    { id: 2, name: 'COMPLETED', active: false },
  ];

  getUserDetails(id: string) {
    //user/kyc?userId=2
    this.api.get(`user/${this.userId}`).subscribe({
      next: (response) => {
        this.userObject = response;
        console.log('User data retrieved:', response);
        // You can process the response here, e.g., update the state or UI
      },
      error: (error) => {
        console.error('Error fetching users:', error);
        // Handle any errors here, such as showing an error message to the user
      },
      complete: () => {
        console.log('Completed the request to get users.');
        // Optional: Execute any additional code after the request completes
      },
    });
  }
  getUserKycDocs(id: string) {
    this.api.get(`user/kyc?userId=${this.userId}`).subscribe({
      next: (response) => {
        this.userKycDoc = response;
        console.log('User data  kyc...docs this.userKycDoc:', this.userKycDoc);
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      },
      complete: () => {
        console.log('Completed the request to get users.');
      },
    });
  }
  downloadKycDoc(fileId: string) {
    this.api.get(`user/fileLink?fileId=${fileId}`).subscribe({
      next: (response) => {
        this.downLoadLink = response;
        window.open(this.downLoadLink.link);
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      },
      complete: () => {
        console.log('Completed the request to get users.');
      },
    });
  }
  updateFilter(index: number, filter: string) {
    this.filters = this.filters.map((filter, i) => ({
      ...filter,
      active: i === index,
    }));

    this.getTrips(filter, this.userId);
  }

  getTrips(filter: string, userId: string) {
    this.api.get(`trip?tripCompletionStatus=${filter}`).subscribe({
      next: (response) => {
        this.tripdata = response.reverse();
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

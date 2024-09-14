import { Component } from '@angular/core';
import {
  FileLink,
  tripInterface,
  UserKycDocument,
  userProfile,
  UserResponse,
} from '../../model';
import { NotificationService } from '../../service/notification.service';
import { HttpService } from '../../service/http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TripsComponent } from '../trips/trips.component';
import { TrancateWordsPipe } from '../../service/trancate-words.pipe';
import { addIcons } from 'ionicons';
import { MatDialog } from '@angular/material/dialog';
import { IframeDisplayComponent } from '../iframe-display/iframe-display.component';

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
  userProfile!: userProfile;
  downLoadLink!: FileLink;
  tripdata!: tripInterface[];
  display_name!: string;
  dynamicProfileUrl!: string;
  rating: number = this.calculateRating();

  userId: string = '';

  constructor(
    private api: HttpService,
    private notify: NotificationService,
    private _Activatedroute: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
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
    this.api.get<UserResponse>(`user/${this.userId}`).subscribe({
      next: (response) => {
        this.userObject = response;
        this.getProfilePic(this.userObject.userProfile.profilePicFileId);
        if (this.userObject.user.roles[0] === 'DRIVER') {
          this.getUserDeatilsByRole(
            'user/driverDetails?driverUserId',
            this.userId
          );
        }
        if (this.userObject.user.roles[0] === 'CUSTOMER') {
          this.getUserDeatilsByRole(
            'customerDetails?customerUserId',
            this.userId
          );
        }
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
  getUserDeatilsByRole(route: string, userId: string) {
    this.api.get<userProfile>(`${route}=${this.userId}`).subscribe({
      next: (response) => {
        this.userProfile = response;

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
    this.api
      .get<UserKycDocument[]>(`user/kyc?userId=${this.userId}`)
      .subscribe({
        next: (response) => {
          this.userKycDoc = response;
          console.log(
            'User data  kyc...docs this.userKycDoc:',
            this.userKycDoc
          );
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
    this.api.get<FileLink>(`user/fileLink?fileId=${fileId}`).subscribe({
      next: (response) => {
        this.downLoadLink = response;
        this.openDialog(this.downLoadLink);
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      },
      complete: () => {
        console.log('Completed the request to get users.');
      },
    });
  }
  getProfilePic(picUrl: string) {
    this.api.get<FileLink>(`user/fileLink?fileId=${picUrl}`).subscribe({
      next: (response) => {
        this.downLoadLink = response;
        this.dynamicProfileUrl = this.downLoadLink.link;
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
    // http://46.101.104.128:7823/api/trip?tripCompletionStatus=UPCOMING&driverUserId=2
    this.api
      .get<tripInterface[]>(
        `trip?tripCompletionStatus=${filter}&driverUserId=${userId}`
      )
      .subscribe({
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

  calculateRating(): number {
    const userRating = this.getUserRating(); // Replace with your actual method to get the user's rating
    return userRating !== null ? userRating : 0;
  }

  getUserRating(): number {
    return this.userProfile?.ratings ?? 0;
  }

  openDialog(file_link: FileLink) {
    this.dialog.open(IframeDisplayComponent, {
      data: file_link,
      // width: '80%',
      height: '80%',
    });
  }
}

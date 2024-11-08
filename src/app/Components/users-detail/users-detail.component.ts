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
import { LoaderService } from '../../service/loader.service';
import { LoaderComponent } from '../loader/loader.component';
import { SafePipe } from '../../safe.pipe';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

interface TripApiResponse {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  trips: tripInterface[];
}
@Component({
  selector: 'app-users-detail',
  standalone: true,
  imports: [
    CommonModule,
    TripsComponent,
    TrancateWordsPipe,
    LoaderComponent,
    IframeDisplayComponent,
    SafePipe,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './users-detail.component.html',
  styleUrl: './users-detail.component.css',
})
export class UsersDetailComponent {
  userObject!: UserResponse;
  userKycDoc: UserKycDocument[] = [];
  tripdata: tripInterface[] = [];
  totalItems: number = 0; // Total number of users from the server
  pageSize: number = 5; // Number of users per page
  currentPage: number = 0; // The current page number
  userProfile!: userProfile;
  downLoadLink!: FileLink;
  display_name!: string;
  dynamicProfileUrl!: string;
  rating: number = this.calculateRating();
  isLoading: boolean = false;
  activeTab: 1 | 2 = 1;
  singleDocument!: UserKycDocument;
  userId: string = '';
  verifykycForm: FormGroup;
  totalPages: number = 0; // Total pages available from the API

  constructor(
    private api: HttpService,
    private notify: NotificationService,
    private _Activatedroute: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private loaderService: LoaderService,
    private fb: FormBuilder
  ) {
    this.isLoading = true;

    this.verifykycForm = this.fb.group({
      userKycDocumentId: ['', [Validators.required]],
      rejectionReason: ['', [Validators.required]],
      kycVerificationStatus: ['', Validators.required],
    });
    this.verifykycForm.get('rejectionReason')?.disable();
  }

  showRejectionReason: boolean = false;
  kycStatus = [
    { name: 'ACCEPTED', title: 'ACCEPTED' },
    { name: 'PENDING', title: 'PENDING' },
    { name: 'REJECTED', title: 'REJECTED' },
  ];

  get userKycDocumentId() {
    return this.verifykycForm.get('userKycDocumentId');
  }

  get rejectionReason() {
    return this.verifykycForm.get('rejectionReason');
  }

  get kycVerificationStatus() {
    return this.verifykycForm.get('kycVerificationStatus');
  }

  ngOnInit() {
    this.userId = this._Activatedroute.snapshot.paramMap.get('id') ?? '';
    if (this.userId) {
      this.getUserDetails(this.userId);
      this.getUserKycDocs(this.userId);
      this.getTrips('', this.userId, this.currentPage, this.pageSize);
    }
    this.loaderService.loading$.subscribe((loading) => {
      this.isLoading = loading;
    });
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
        if (this.userObject.userProfile.profilePicFileId) {
          this.getProfilePic(this.userObject.userProfile.profilePicFileId);
        }
        if (this.userObject.user.roles[0] === 'DRIVER') {
          this.getUserDeatilsByRole(
            'user/driverDetails?driverUserId',
            this.userId
          );
        }
        if (this.userObject.user.roles[0] === 'CUSTOMER') {
          this.getUserDeatilsByRole(
            'user/customerDetails?customerUserId',
            this.userId
          );
        }
        // You can process the response here, e.g., update the state or UI
      },
      error: (error) => {
        console.error('Error fetching users:', error);
        // Handle any errors here, such as showing an error message to the user
      },
      complete: () => {
        // Optional: Execute any additional code after the request completes
      },
    });
  }

  showReasonForRejectionInput(event: any): void {
    const selectedStatus = event.target.value;

    // Check if the selected status is 'REJECTED'
    if (selectedStatus === 'REJECTED') {
      this.showRejectionReason = true;
      this.verifykycForm.get('rejectionReason')?.enable();
    } else {
      this.showRejectionReason = false;
      this.verifykycForm.get('rejectionReason')?.disable();
    }
  }
  getUserDeatilsByRole(route: string, userId: string) {
    this.api.get<userProfile>(`${route}=${this.userId}`).subscribe({
      next: (response) => {
        this.userProfile = response;

        // You can process the response here, e.g., update the state or UI
      },
      error: (error) => {
        console.error('Error fetching users:', error);
        // Handle any errors here, such as showing an error message to the user
      },
      complete: () => {
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
        },
        error: (error) => {
          console.error('Error fetching users:', error);
        },
        complete: () => {},
      });
  }
  downloadKycDoc(fileId: string, document: UserKycDocument) {
    this.api.get<FileLink>(`user/fileLink?fileId=${fileId}`).subscribe({
      next: (response) => {
        const newLocal = 'hello..';

        this.singleDocument = document;
        this.downLoadLink = response;
        this.activeTab = 2;
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      },
      complete: () => {},
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
      complete: () => {},
    });
  }
  updateFilter(index: number, filter: string) {
    this.filters = this.filters.map((filter, i) => ({
      ...filter,
      active: i === index,
    }));
    this.currentPage = 0;

    this.getTrips(filter, this.userId, this.currentPage, this.pageSize);
  }

  // getTrips(
  //   filter: string,
  //   userId: string,
  //   pageIndex: number,
  //   pageSize: number
  // ) {
  //   const params = {
  //     kycVerificationStatus: filter,
  //     page: pageIndex.toString(),
  //     size: pageSize.toString(),
  //   };
  //   this.api
  //     .get<tripInterface[]>(
  //       `trip/v2?tripCompletionStatus=${filter}&driverUserId=${userId}&pageNumber=${params.page}&pageSize=${params.size}`
  //     )
  //     .subscribe({
  //       next: (response) => {
  //         this.tripdata = [];
  //         this.tripdata = response.reverse();
  //         this.totalItems = response.length;
  //       },
  //       error: (error) => {
  //         console.error('comming soon:', error);
  //         this.tripdata = [];
  //       },
  //       complete: () => {},
  //     });
  // }

  getTrips(
    filter: string,
    userId: string,
    pageIndex: number,
    pageSize: number
  ) {
    console.log('Fetching trips with filter:', filter);

    const params = {
      kycVerificationStatus: filter,
      page: pageIndex.toString(),
      size: pageSize.toString(),
    };

    this.api
      .get<TripApiResponse>(
        `trip/v2?tripCompletionStatus=${filter}&driverUserId=${userId}&pageNumber=${params.page}&pageSize=${params.size}`
      )
      .subscribe({
        next: (response) => {
          this.tripdata = response.trips || [];
          this.totalItems = response.totalRecords;
          this.currentPage = response.currentPage;
          this.totalPages = response.totalPages;

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

  onSubmit() {
    if (this.verifykycForm.valid) {
      this.api.post(`user/kyc/verify`, this.verifykycForm.value).subscribe({
        next: (response) => {
          this.getUserKycDocs(this.userId);
          this.activeTab = 1;
        },
        error: (error) => {
          console.error('Error fetching users:', error);
        },
        complete: () => {},
      });
    } else {
    }
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
  onPageChange(pageIndex: number) {
    this.currentPage = pageIndex;
    this.getTrips('', this.userId, this.currentPage, this.pageSize);
  }
  updateActiveTab(tab: any) {
    this.activeTab = tab;
  }
}

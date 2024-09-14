import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { TripCoordinate, tripInterface } from '../../model';
import { HttpService } from '../../service/http.service';
import { ActivatedRoute } from '@angular/router';
import { log } from 'node:console';
import { CommonModule } from '@angular/common';

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}
interface Point {
  latitude: number;
  longitude: number;
}

@Component({
  selector: 'app-trips-detail',
  standalone: true,
  imports: [GoogleMapsModule, CommonModule],
  templateUrl: './trips-detail.component.html',
  styleUrls: ['./trips-detail.component.css'],
})
export class TripsDetailComponent implements OnInit, AfterViewInit {
  isTripActive: boolean = false;
  tripCoordinates: TripCoordinate[] | Point[] = [];
  tripId: string = '';

  map!: google.maps.Map;
  @ViewChild('mapel', { static: false }) googlemaps!: ElementRef;
  bounds = new google.maps.LatLngBounds();
  center: any = null;
  zoom = 8;
  title = 'google-map';
  markers = [];
  polylineOptions = {
    path: [],
    strokeColor: '#32a1d0',
    strokeOpacity: 1.0,
    strokeWeight: 2,
  };

  // coordinates = [
  //   {
  //     tripCoordinateId: 33,
  //     tripId: 14,
  //     coordinateContributorUserId: 2,
  //     latitude: -4.0436,
  //     longitude: 39.6682,
  //     createdOn: 1725364864408,
  //   },
  //   {
  //     tripCoordinateId: 34,
  //     tripId: 14,
  //     coordinateContributorUserId: 2,
  //     latitude: -1.2864,
  //     longitude: 36.8172,
  //     createdOn: 1725364869387,
  //   },
  //   {
  //     tripCoordinateId: 35,
  //     tripId: 14,
  //     coordinateContributorUserId: 2,
  //     latitude: -1.3598,
  //     longitude: 38.0354,
  //     createdOn: 1725364869440,
  //   },
  //   {
  //     tripCoordinateId: 36,
  //     tripId: 14,
  //     coordinateContributorUserId: 2,
  //     latitude: -0.0917,
  //     longitude: 34.768,
  //     createdOn: 1725364874437,
  //   },
  // ];

  constructor(
    private api: HttpService,
    private _Activatedroute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.tripId = this._Activatedroute.snapshot.paramMap.get('id') ?? '';
    this.getTripCoordinates(this.tripId);
  }

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  initializeMap() {
    const mapOptions: google.maps.MapOptions = {
      center: { lat: -0.0917, lng: 34.768 },
      zoom: 4,
    };

    this.map = new google.maps.Map(this.googlemaps.nativeElement, mapOptions);

    // Plot polyline
    // this.plotPolyline();

    // Try to get user's current location and center the map there
    navigator.geolocation.getCurrentPosition((position) => {
      const center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      this.map.setCenter(center); // Set the map center to user's location
      this.addMarker(center.lat, center.lng);
    });
  }

  addMarker(lat: number, lng: number) {
    const marker = new google.maps.Marker({
      position: { lat, lng },
      map: this.map,
    });
  }

  plotPolyline(tripCoordinates: TripCoordinate[] | Point[]) {
    // Convert the coordinates array into a path for the polyline
    const path = this.tripCoordinates.map((coord) => ({
      lat: coord.latitude,
      lng: coord.longitude,
    }));

    // Create and set the polyline on the map
    const polyline = new google.maps.Polyline({
      path: path,
      strokeColor: this.polylineOptions.strokeColor,
      strokeOpacity: this.polylineOptions.strokeOpacity,
      strokeWeight: this.polylineOptions.strokeWeight,
    });

    // Set the polyline on the map
    polyline.setMap(this.map);

    // Extend map bounds to include all polyline points
    path.forEach((point) => {
      this.bounds.extend(point);
    });
    this.map.fitBounds(this.bounds); // Adjust the map view to include all points
  }

  sortTripCoordinatesByTime(
    tripCoordinates: TripCoordinate[]
  ): TripCoordinate[] {
    return tripCoordinates.sort((a, b) => a.createdOn - b.createdOn);
  }

  getTripCoordinates(tripId: string) {
    this.api
      .get<TripCoordinate[]>(`trip/coordinates?tripId=${tripId}`)
      .subscribe({
        next: (response) => {
          this.tripCoordinates = this.sortTripCoordinatesByTime(response);
          if (this.tripCoordinates.length) {
            this.plotPolyline(this.tripCoordinates);
          } else {
            this.getTripById(this.tripId);
          }
        },
        error: (error) => {
          console.error('Error fetching users:', error);
          // Handle any errors here, such as showing an error message to the user
        },
        complete: () => {
          console.log('Completed the request to get users.');
        },
      });
  }
  getTripById(tripId: string) {
    this.api
      .get<TripCoordinate[] | Point[]>(`trip?tripId=${tripId}`)
      .subscribe({
        next: (response) => {
          this.tripCoordinates = this.transformTripArray(response);
          console.log(
            'this.tripCoordinates. kilimamboko...',
            this.tripCoordinates
          );
          if (this.tripCoordinates.length) {
            this.plotPolyline(this.tripCoordinates);
            this.isTripActive = true;
          } else {
            return;
          }
        },
        error: (error) => {
          console.error('Error fetching users:', error);
          // Handle any errors here, such as showing an error message to the user
        },
        complete: () => {
          console.log('Completed the request to get users.');
        },
      });
  }
  transformTripArray(trips: any[]): Point[] {
    return trips.flatMap((trip) => [
      { latitude: trip.startingPointLat, longitude: trip.startingPointLng },
      { latitude: trip.destinationLat, longitude: trip.destinationLng },
    ]);
  }
}

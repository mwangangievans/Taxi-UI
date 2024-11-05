import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { TripCoordinate } from '../../model';
import { HttpService } from '../../service/http.service';
import { ActivatedRoute } from '@angular/router';
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
  tripCoordinates: TripCoordinate[] = [];
  markerCoodinates: Point[] = [];
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

  constructor(
    private api: HttpService,
    private _Activatedroute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.tripId = this._Activatedroute.snapshot.paramMap.get('id') ?? '';
    this.getTripById(this.tripId);
  }

  ngAfterViewInit(): void {
    this.initializeMap(this.tripCoordinates);
  }

  initializeMap(cordinates: TripCoordinate[] | Point[]) {
    const mapOptions: google.maps.MapOptions = {
      zoom: 8, // initial zoom level
    };

    this.map = new google.maps.Map(this.googlemaps.nativeElement, mapOptions);

    navigator.geolocation.getCurrentPosition((position) => {
      const center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      this.map.setCenter(center); // Set the map center to user's location (no marker here)

      // Add markers with captions (labels)
      const points: Point[] = cordinates;

      // Add "Origin" marker
      this.addMarker(points[0].latitude, points[0].longitude, 'Origin');

      // Add "Destination" marker
      this.addMarker(points[1].latitude, points[1].longitude, 'Destination');
    });
  }

  addMarker(lat: number, lng: number, label: string) {
    const marker = new google.maps.Marker({
      position: { lat, lng },
      map: this.map,
      label: {
        text: label,
        color: '#000', // Optional: Set label color
        fontSize: '16px', // Optional: Set label font size
      },
    });
  }

  plotPolyline(tripCoordinates: TripCoordinate[]) {
    const path = tripCoordinates.map((coord) => ({
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

    console.log('polyline..', polyline);

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
          // this.plotPolyline(this.tripCoordinates);
          console.log(
            'this.plotPolyline(this.tripCoordinates)',
            this.tripCoordinates
          );

          if (this.tripCoordinates.length) {
            this.plotPolyline(this.tripCoordinates);
            this.initializeMap(this.markerCoodinates);
          } else {
            // this.getTripById(this.tripId);
            this.isTripActive = true;
          }
        },
        error: (error) => {
          console.error('Error fetching users:', error);
        },
        complete: () => {},
      });
  }

  getTripById(tripId: string) {
    this.api
      .get<TripCoordinate[] | Point[]>(`trip?tripId=${tripId}`)
      .subscribe({
        next: (response) => {
          this.markerCoodinates = this.transformTripArray(response);
          this.initializeMap(this.markerCoodinates);

          if (this.markerCoodinates.length) {
            this.getTripCoordinates(this.tripId);
          } else {
            return;
          }
        },
        error: (error) => {
          console.error('Error fetching users:', error);
          // Handle any errors here, such as showing an error message to the user
        },
        complete: () => {},
      });
  }

  transformTripArray(trips: any[]): Point[] {
    return trips.flatMap((trip) => [
      { latitude: trip.startingPointLat, longitude: trip.startingPointLng },
      { latitude: trip.destinationLat, longitude: trip.destinationLng },
    ]);
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { environment } from '../../environments/environment';
import { UserSessionService } from './user-session.service';
import { UserSession } from '../model';
import { catchError, Observable, of, tap } from 'rxjs';
import { Location } from '@angular/common';
import { NotificationService } from './notification.service';

const baseUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    private userSessionService: UserSessionService,
    private location: Location,
    private notify: NotificationService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.userSessionService.getSession()?.accessToken;

    return new HttpHeaders({
      Accept: '*/*',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  goBack(): void {
    this.location.back();
  }

  get<T>(route: string): Observable<T> {
    return this.http
      .get<T>(`${baseUrl}${route}`, {
        headers: this.getHeaders(),
      })
      .pipe(
        catchError((error) => {
          this.handleError('Error fetching data.', error);

          // Returning a more explicit empty value based on the type T
          if (Array.isArray([] as T)) {
            return of([] as unknown as T); // Return an empty array
          } else if (typeof {} === typeof ({} as T)) {
            return of({} as T); // Return an empty object
          } else {
            return of('' as unknown as T); // Return an empty string for non-object, non-array types
          }
        })
      );
  }

  patch<T>(route: string, payload?: any): Observable<T> {
    return this.http
      .patch<T>(`${baseUrl}${route}`, payload, {
        headers: this.getHeaders(), // Assuming getHeaders() is defined in your HttpService
      })
      .pipe(
        catchError((error) => {
          this.handleError('Error updating data.', error);

          // Check if T is an array, object, or string, and return an empty value accordingly.
          if (Array.isArray([] as T)) {
            return of([] as T); // Return an empty array if T is expected to be an array
          } else if (typeof {} === typeof ({} as T)) {
            return of({} as T); // Return an empty object if T is an object
          } else {
            return of('' as T); // Return an empty string for other types (e.g., string, number)
          }
        })
      );
  }

  getWithoutToken(route: string): Observable<any> {
    return this.http.get<any>(`${baseUrl}${route}`);
  }

  post(route: string, payload?: any): Observable<any> {
    return this.http
      .post<any>(`${baseUrl}${route}`, payload, {
        headers: this.getHeaders(),
      })
      .pipe(
        tap({
          next: () => {
            this.notify.showSuccess('Record created successfully!', 'Success');
          },
          error: (error) => {
            this.notify.showError('Failed to create record.', 'Error');
            console.error('Error creating record:', error);
          },
        })
      );
  }

  postWithoutToken(route: string, payload?: any): Observable<any> {
    return this.http.post<any>(`${baseUrl}${route}`, payload);
  }
  public handleError(message: string, error: any): void {
    console.error(message, error);
    this.notify.showError(message, 'error'); // Show user-friendly error message
  }
}

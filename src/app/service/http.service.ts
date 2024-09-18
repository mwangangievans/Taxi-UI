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
          return of(([] || {} || '') as T);
        })
      );
  }
  patch(route: string, payload?: any): Observable<any> {
    return this.http
      .patch<any>(`${baseUrl}${route}`, payload, {
        headers: this.getHeaders(),
      })
      .pipe(
        catchError((error) => {
          this.handleError('Error updating data.', error);
          return of(([] || {} || '') as any);
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
          next: (response) => {
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
  private handleError(message: string, error: any): void {
    console.error(message, error);
    this.notify.showError(message, 'error'); // Show user-friendly error message
  }
}

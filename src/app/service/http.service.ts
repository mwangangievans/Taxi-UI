import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { environment } from '../../environments/environment';
import { UserSessionService } from './user-session.service';
import { UserSession } from '../model';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';

const baseUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  userToken: any;
  UserSessionData!: UserSession;

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    private _UserSessionService: UserSessionService,
    private location: Location
  ) {
    this.getUserToken();
    // this.UserSessionData = this._UserSessionService.getSession()?.accessToken;
  }

  SetHeaders() {
    return new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${
        this._UserSessionService.getSession()?.accessToken
      }`,
    });
  }

  async getUserToken() {
    this.userToken = await this._UserSessionService.getSession()?.accessToken;
  }

  goBack(): void {
    this.location.back();
  }

  get(route: string): Observable<any> {
    return this.http.get<any>(`${baseUrl}${route}`, {
      headers: this.SetHeaders(),
    });
  }
  getWithNoToken(route: string): Observable<any> {
    return this.http.get<any>(`${baseUrl}${route}`);
  }

  post(route: string, token: string, payload?: any): Observable<any> {
    console.log({ payload });

    return this.http.post<any>(`${baseUrl}${route}`, payload, {
      headers: this.SetHeaders(),
    });
  }
  postWithNoToken(route: string, payload?: any): Observable<any> {
    return this.http.post<any>(`${baseUrl}${route}`, payload);
  }
}

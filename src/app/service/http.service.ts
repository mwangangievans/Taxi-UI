import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  userToken: any;
  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {
    this.getUserToken();
  }

  async getUserToken() {
    this.userToken = await this.storageService.getItem('userToken');
  }

  post(serviceName: string, data: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const options = {
      headers: headers,
      withCredentials: false,
    };
    let url = environment.apiUrl + serviceName;

    return this.http.post(url, JSON.stringify(data), options);
  }

  put(serviceName: string, data: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const options = { headers: headers, withCredentials: false };
    let url = environment.apiUrl + serviceName;

    return this.http.put(url, JSON.stringify(data), options);
  }

  get(serviceName: string) {
    this.getUserToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.userToken?.access_token}`,
    });

    const options = { headers: headers };
    let url = environment.apiUrl + serviceName;

    return this.http.get(url, options);
  }

  delete(serviceName: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const options = { headers: headers, withCredentials: false };
    let url = environment.apiUrl + serviceName;

    return this.http.delete(url, options);
  }
}

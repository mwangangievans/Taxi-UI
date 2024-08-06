import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserSession } from '../model';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserSessionService {
  private readonly SESSION_KEY = 'userSession';
  private sessionSubject: BehaviorSubject<UserSession | null>;
  public session$: Observable<UserSession | null>;

  constructor(private http: HttpClient, private router: Router) {
    const savedSession = localStorage.getItem(this.SESSION_KEY);
    this.sessionSubject = new BehaviorSubject<UserSession | null>(
      savedSession ? JSON.parse(savedSession) : null
    );
    this.session$ = this.sessionSubject.asObservable();
  }

  private saveSession(session: UserSession): void {
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    this.sessionSubject.next(session);
  }

  private clearSession(): void {
    localStorage.removeItem(this.SESSION_KEY);
    this.sessionSubject.next(null);
  }

  public getSession(): UserSession | null {
    return this.sessionSubject.value;
  }

  public storeUserDataAfterLoginSuccess(data: any): void {
    console.log('login data....', data);

    // Save session data after login
    const session: UserSession = {
      userId: data.userId,
      name: data.name,
      email: data.email,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      roles: data.roles,
      hasVerifiedPhoneNumber: data.hasVerifiedPhoneNumber,
    };
    this.saveSession(session);
  }

  public logout(): void {
    this.clearSession();
    this.router.navigate(['/login']);
  }

  public refreshToken(): Observable<any> {
    const refreshToken = this.getSession()?.refreshToken;
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${refreshToken}`
    );

    return this.http.post('/api/auth/refresh-token', {}, { headers });
  }

  public updateSessionTokens(accessToken: string, refreshToken: string): void {
    const currentSession = this.getSession();
    if (currentSession) {
      const updatedSession = {
        ...currentSession,
        accessToken,
        refreshToken,
      };
      this.saveSession(updatedSession);
    }
  }
}
//ng generate interceptor service/Auth

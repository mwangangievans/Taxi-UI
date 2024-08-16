import { inject, Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HttpHandlerFn,
  HttpHeaders,
  HttpClient,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserSessionService } from './user-session.service';
import { HttpService } from './http.service';
import { environment } from '../../environments/environment';

export const ErrorInterceptor = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const router = inject(Router);
  const userSessionService = inject(UserSessionService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = '';

      if (error.error instanceof ErrorEvent) {
        // Client-side or network error
        errorMessage = `Client-side error: ${error.error.message}`;
      } else {
        // Server-side error
        errorMessage = `Server-side error: ${error.status} ${error.message}`;
      }

      // Log the error or send it to a remote logging infrastructure
      console.error(errorMessage);
      // console.log('Request URL:', req.url);

      // Handle specific HTTP errors
      if (error.status === 401) {
        if (!req.url.includes('login')) {
          return handle401Error(req, next, userSessionService, router);
        } else {
          router.navigate(['/login']);
        }
      } else if (error.status === 404) {
        router.navigate(['/not-found']);
      } else if (error.status >= 500) {
        router.navigate(['/server-error']);
      }

      return throwError(() => new Error(errorMessage));
    })
  );
};

const handle401Error = (
  request: HttpRequest<any>,
  next: HttpHandlerFn,
  userSessionService: UserSessionService,
  router: Router
): Observable<HttpEvent<any>> => {
  const refreshToken = userSessionService.getSession()?.refreshToken;
  // const httpservice_ = inject(HttpService).;
  const http = inject(HttpClient);
  const baseUrl = environment.apiUrl;

  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const headers = new HttpHeaders().set(
    'Authorization',
    `Bearer ${refreshToken}`
  );

  let refreshPayload = {
    accessToken: userSessionService.getSession()?.accessToken,
    refreshToken: userSessionService.getSession()?.refreshToken,
  };
  return http
    .post(`${baseUrl}auth/refresh`, refreshPayload, {
      headers,
    })
    .pipe(
      switchMap((token: any) => {
        // Update session tokens with new ones
        userSessionService.updateSessionTokens(
          token.accessToken,
          token.refreshToken
        );

        // Clone the original request and retry with the new token
        const clonedRequest = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token.accessToken}`,
          },
        });

        return next(clonedRequest);
      }),
      catchError((err) => {
        // If refreshing fails, log out the user and redirect to the login page
        // userSessionService.logout();
        // router.navigate(['/login']);
        console.log('refresh failed....');

        return throwError(
          () => new Error('Session expired, please log in again.')
        );
      })
    );
};

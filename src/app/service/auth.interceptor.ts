import { inject, Injectable } from '@angular/core';

import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpHandlerFn,
} from '@angular/common/http';
import { Observable, throwError, catchError, switchMap } from 'rxjs';
import { UserSessionService } from './user-session.service';

export const AuthInterceptor = (
  request: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  const currentSession = inject(UserSessionService).getSession();
  if (currentSession && currentSession.accessToken) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${currentSession.accessToken}`,
      },
    });
  }

  return next(request).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        // 401 errors are typically due to expired tokens
        return handle401Error(request, next);
      }

      return throwError(() => new Error(error));
    })
  );
};

const handle401Error = (request: HttpRequest<any>, next: HttpHandlerFn) => {
  {
    return inject(UserSessionService)
      .refreshToken()
      .pipe(
        switchMap((token: any) => {
          // Update session tokens with new ones
          inject(UserSessionService).updateSessionTokens(
            token.accessToken,
            token.refreshToken
          );

          // Clone the original request and retry with the new token
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${token.accessToken}`,
            },
          });

          return next(request);
        }),
        catchError((err) => {
          // If refreshing fails, log out the user and redirect to the login page
          inject(UserSessionService).logout();
          return throwError(
            () => new Error('Session expired, please log in again.')
          );
        })
      );
  }
};

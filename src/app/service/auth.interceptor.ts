import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import {
  Observable,
  throwError,
  catchError,
  switchMap,
  filter,
  take,
} from 'rxjs';
import { UserSessionService } from './user-session.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private userSessionService: UserSessionService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Add authorization header with jwt token if available
    const currentSession = this.userSessionService.getSession();
    if (currentSession && currentSession.accessToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentSession.accessToken}`,
        },
      });
    }

    return next.handle(request).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          // 401 errors are typically due to expired tokens
          return this.handle401Error(request, next);
        }

        return throwError(() => new Error(error));
      })
    );
  }

  private handle401Error(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.userSessionService.refreshToken().pipe(
      switchMap((token: any) => {
        // Update session tokens with new ones
        this.userSessionService.updateSessionTokens(
          token.accessToken,
          token.refreshToken
        );

        // Clone the original request and retry with the new token
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token.accessToken}`,
          },
        });

        return next.handle(request);
      }),
      catchError((err) => {
        // If refreshing fails, log out the user and redirect to the login page
        this.userSessionService.logout();
        return throwError(
          () => new Error('Session expired, please log in again.')
        );
      })
    );
  }
}

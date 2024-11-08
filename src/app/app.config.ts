import { ApplicationConfig } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { ErrorInterceptor } from './service/error.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { LoaderInterceptor } from './service/loader.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withHashLocation()),
    provideHttpClient(withInterceptors([ErrorInterceptor, LoaderInterceptor])),
    provideAnimationsAsync(),
  ],
};

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoaderService } from './loader.service';
import { finalize } from 'rxjs/operators';

export const LoaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(LoaderService);

  // Show the loader when the request starts
  loaderService.show();

  return next(req).pipe(
    finalize(() => {
      // Hide the loader when the request finishes
      loaderService.hide();
    })
  );
};

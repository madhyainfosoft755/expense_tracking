import {
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse,
  HttpEvent,
  HttpInterceptorFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { AppNotificationService } from '@shared';

export const errorHandlingInterceptor: HttpInterceptorFn =(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const appNotificationService = inject(AppNotificationService);
  return next(req).pipe(
     catchError((error: HttpErrorResponse) => {
      let errorMsg = 'An unknown error occurred!';
      if (error.error instanceof ErrorEvent) {
        errorMsg = `Client Error: ${error.message}`;
      } else if (error.error?.message) {
        errorMsg = error.error.message;
      }

      switch (error.status) {
        case 0:
          appNotificationService.error('Server error', 'Service Unavailable');
          break;
        // case 400:
        //   appNotificationService.error(error.status.toString(), error.statusText);
        //   break;
        case 404:
          appNotificationService.error('Not Found', 'Requested page not found');
          break;
        // case 401:
        //   appNotificationService.error('Unauthorized Access', error.error.message);
        //   break;
        case 500:
          appNotificationService.error('Internal Server Error', errorMsg);
          break;
        default:
          break;
      }

      return throwError(() => error);
    })
  );
};
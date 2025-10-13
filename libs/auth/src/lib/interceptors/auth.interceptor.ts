import { inject } from '@angular/core';
import { HttpEvent, HttpInterceptorFn, HttpHandlerFn, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, ReplaySubject, combineLatest } from 'rxjs';
import { catchError, switchMap, take, filter, first } from 'rxjs/operators';

import { AuthService } from '../services/auth/auth.service';
import { Store } from '@ngrx/store';
import { setAccessToken } from '../+state/auth.actions';
import { selectAccessToken, selectRefreshToken } from '../+state/auth.selectors';

// Define endpoints to exclude from modification
const EXCLUDED_ENDPOINTS = [
    '/login',
    '/forgot-password',
    '/check-reset-token',
    '/reset-password'
  ];

let refresh = false;
const refreshSubject = new ReplaySubject<string>(1);

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const http = inject(HttpClient); // Inject HttpClient
  const store = inject(Store);
  const baseUrl = 'http://127.0.0.1:8000/api/';
  const authService = inject(AuthService); // Inject AuthService

  return combineLatest([
    store.select(selectAccessToken),
    store.select(selectRefreshToken)
  ]).pipe(
    first(),
    switchMap(([accessToken, refreshToken]) => {
        let clonedRequest = req.clone({
            withCredentials: true,
            setHeaders: {
              Authorization: `Bearer ${accessToken}`
            }
        });
        if (EXCLUDED_ENDPOINTS.some(url => req.url.includes(url))) {
            clonedRequest = req.clone({
                withCredentials: true,
                setHeaders: { }
            });
        }

        return next(clonedRequest).pipe(
            catchError((err: HttpErrorResponse) => {
              if (err.status === 401 && !refresh) {
                refresh = true;
                refreshSubject.next(''); // Invalidate old token
                return http.post(`${baseUrl}token/refresh/`, {refresh: refreshToken}, { withCredentials: true }).pipe(
                  switchMap((res: any) => {
                    store.dispatch(setAccessToken({ access: res.access }));
                    refresh = false;
                    refreshSubject.next(res.access);
                    return next(
                      req.clone({
                        setHeaders: {
                          Authorization: `Bearer ${res.access}`
                        }
                      })
                    );
                  }),
                  catchError(refreshErr => {
                    refresh = false;
                    refreshSubject.error(refreshErr);
                    authService.logout(); // Run logout if refresh token fails
                    return throwError(() => refreshErr);
                  })
                );
              } else if (err.status === 401 && refresh) {
                return refreshSubject.pipe(
                  filter(token => token !== ''),
                  take(1),
                  switchMap(token => {
                    return next(
                      req.clone({
                        setHeaders: {
                          Authorization: `Bearer ${token}`
                        }
                      })
                    );
                  })
                );
              }
              return throwError(() => err);
            })
        );
    }));
}
import { Injectable, inject } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { switchMap, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import * as AuthActions from './auth.actions';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  
  constructor(
    private authService: AuthService,
    private router: Router
  ){}

  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.initAuth),
      switchMap(() =>
        of(AuthActions.loadAuthSuccess({ auth: [] }))
      ),
      catchError((error) => {
        return of(AuthActions.loadAuthFailure({ error }));
      })
    )
  );


  sbmLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.userLogin),
      mergeMap((request) =>
        this.authService.userLogin(request.userLoginPayload).pipe(
          map((response: any) => {
            // Save credentials if Remember Me is checked
            if (request.userLoginPayload.rememberMe) {
              localStorage.setItem('ER_rememberedCredentials', JSON.stringify({
                  username_or_email: request.userLoginPayload.username_or_email,
                  password: request.userLoginPayload.password,
                  rememberMe: request.userLoginPayload.rememberMe
              }));
            } else {
                // Clear credentials if Remember Me is unchecked
                localStorage.removeItem('ER_rememberedCredentials');
            }
            return AuthActions.userLoginSuccess({
              response
            });
          }),
          catchError((error) => {
            return of(
              AuthActions.userLoginFailure({
                error: error,
              }),
            );
          }),
        ),
      ),
    )
  );


  // New: redirect after success
  loginSuccessRedirect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.userLoginSuccess),
        tap(({ response }) => {
          if (response.tokens) {
            this.router.navigate([`/${response.user.role.toLowerCase().replace('_', '-')}`]);
          }
        })
      ),
    { dispatch: false }
  );


  logoutRedirect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logoutSuccess),
        tap(() => {
          this.router.navigate(['/login']); // or your login route
        })
      ),
    { dispatch: false } // this effect does not dispatch another action
  );
}

import { Injectable, inject } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { switchMap, catchError, of } from 'rxjs';
import * as AppSuperadminActions from './app-superadmin.actions';
import * as AppSuperadminFeature from './app-superadmin.reducer';

@Injectable()
export class AppSuperadminEffects {
  private actions$ = inject(Actions);

  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppSuperadminActions.initAppSuperadmin),
      switchMap(() =>
        of(AppSuperadminActions.loadAppSuperadminSuccess({ appSuperadmin: [] }))
      ),
      catchError((error) => {
        console.error('Error', error);
        return of(AppSuperadminActions.loadAppSuperadminFailure({ error }));
      })
    )
  );
}

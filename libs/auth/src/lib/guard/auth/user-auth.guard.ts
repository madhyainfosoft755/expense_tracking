import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  selectUser,
} from '../../+state/auth.selectors';
import { map } from 'rxjs/operators';

export const userAuthGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router: Router = inject(Router);
  
  return store.select(selectUser).pipe(
    map((user) => {
      console.log('user from client admin', user)
      if (!user) {
        return router.createUrlTree([`/login`]);
      } else {
        return true;
      }
    })
  );


};

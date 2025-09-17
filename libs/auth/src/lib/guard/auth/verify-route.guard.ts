import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  selectUser,
} from '../../+state/auth.selectors';
import { map } from 'rxjs/operators';

export const VerifyRouteGuard: CanActivateFn = (route, state) => {
    const store = inject(Store);
    const router: Router = inject(Router);
    
    return store.select(selectUser).pipe(
        map((user) => {
            if (user && (user.role == 'SUPERADMIN' || user.role == 'ADMIN' || user.role == 'SITE_ADMIN') ) {
                return true;
            } else if (user && (user.permissions.includes('allow_verify_cashbook_expense') ||
                            user.permissions.includes('allow_verify_reimbursement_expense')) ) {
                return true;
            } else {
                return false;
            }
        })
    );
};

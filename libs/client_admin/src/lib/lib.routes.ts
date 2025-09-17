import { Route } from '@angular/router';
import { ClientAdmin } from './client_admin/client_admin';

import { AppLayoutComponent, VerifyCashbookTableComponent, VerifyReimbursementTableComponent } from '@shared';

export const clientAdminRoutes: Route[] = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      { path: '', component: ClientAdmin },
      {
        path: 'verify-cashbook',
        component: VerifyCashbookTableComponent,
        data: { title: 'Verify Cashbook' }
      },
      {
        path: 'verify-reimbursement',
        component: VerifyReimbursementTableComponent,
        data: { title: 'Verify Reimbursement' }
      },
    ]
  }
];

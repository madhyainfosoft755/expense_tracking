import { Route } from '@angular/router';

import { AppLayoutComponent, VerifyCashbookTableComponent, VerifyReimbursementTableComponent } from '@shared';
import { ClientComponent } from './components/clients/clients.component';
import { AppSuperAdminDashboardComponent } from './components/dashboard/dashboard.component';
import { AddClientComponent } from './components/clients/add-client/add-client.component';
import { ClientDetailsComponent } from './components/clients/client-details/client-details.component';
import { SuperadminsComponent } from './components/superadmins/superadmins.component';

export const appSuperadminRoutes: Route[] = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      { 
        path: '', 
        component: AppSuperAdminDashboardComponent,
        data: { title: 'Dashboard' },
      },
      {
        path: 'clients',
        component: ClientComponent,
        data: { title: 'All Clients' },
      },
      {
        path: 'add-client',
        component: AddClientComponent,
        data: { title: 'Add Clients' },
      },
      {
        path: 'client-details/:client_id',
        component: ClientDetailsComponent,
        data: { title: 'Client Details' },
      },
      {
        path: 'superadmins',
        component: SuperadminsComponent,
        data: { title: 'All Superadmins' },
      },
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
  },
];

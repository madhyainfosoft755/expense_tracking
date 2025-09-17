import { Route } from '@angular/router';
import { ClientSuperadmin } from './client_superadmin/client_superadmin';

import { AppLayoutComponent, VerifyCashbookTableComponent, VerifyReimbursementTableComponent, SummaryCashbookComponent, SharedProjectExpenseComponent, SharedCashbookComponent, SummaryReimbursementComponent } from '@shared';
import { ExpenseHeadsComponent } from './components/expense-heads/expense-heads.component';
import { AdminListComponent } from './components/admin-list/admin-list.component';
import { SuperadminListComponent } from './components/superadmin-list/superadmin-list.component';
import { SiteAdminListComponent } from './components/site-admin-list/site-admin-list.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { SiteComponent } from './components/site/site.component';
import { SiteDetailsComponent } from './components/site/site-details/site-details.component';

export const clientSuperadminRoutes: Route[] = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      { path: '', component: ClientSuperadmin },
      {
        path: 'expense-head-list',
        component: ExpenseHeadsComponent,
        data: { title: 'All Expense Heads' },
      },
      {
        path: 'superadmin-list',
        component: SuperadminListComponent,
        data: { title: 'All Superadmins' },
      },
      {
        path: 'admin-list',
        component: AdminListComponent,
        data: { title: 'All Admins' },
      },
      {
        path: 'site-admin-list',
        component: SiteAdminListComponent,
        data: { title: 'All Site Admins' },
      },
      {
        path: 'site-list',
        component: SiteComponent,
        data: { title: 'All Sites' },
      },
      {
        path: 'site-details/:id',
        component: SiteDetailsComponent,
        data: { title: 'All Details' },
      },
      {
        path: 'user-list',
        component: UserListComponent,
        data: { title: 'All Users' },
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
      {
        path: 'summary-cashbook',
        component: SummaryCashbookComponent,
        data: { title: 'Summary Cashbook' }
      },
      {
        path: 'summary-reimbursement',
        component: SummaryReimbursementComponent,
        data: { title: 'Summary Reimbursement' }
      },
      {
        path: 'cashbook',
        component: SharedCashbookComponent,
        data: { title: 'Cashbook' }
      },
      {
        path: 'project-expense',
        component: SharedProjectExpenseComponent,
        data: { title: 'Project Expense' }
      },
    ]
  }
];

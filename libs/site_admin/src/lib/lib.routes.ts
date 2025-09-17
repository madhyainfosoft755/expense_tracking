import { Route } from '@angular/router';
import { SiteAdmin } from './site_admin/site_admin';

import { AppLayoutComponent, VerifyCashbookTableComponent, VerifyReimbursementTableComponent, SummaryCashbookComponent, SummaryReimbursementComponent, SharedCashbookComponent, SharedProjectExpenseComponent } from '@shared';
import { UserListComponent } from './components/user-list/user-list.component';
// import { ProjectExpenseComponent } from './components/project-expense/project-expense.component';
import { ExpenseHeadsComponent } from './components/expense-heads/expense-heads.component';
import { SiteAdminListComponent } from './components/site-admin-list/site-admin-list.component';

export const siteAdminRoutes: Route[] = [
    {
    path: '',
    component: AppLayoutComponent,
    children: [
      { path: '', component: SiteAdmin },
      { path: 'site-user-list', component: UserListComponent, data: { title: 'User List' }, },
      { path: 'project-expense', component: SharedProjectExpenseComponent, data: { title: 'Project Expense' }, },
      { path: 'expense-head-list', component: ExpenseHeadsComponent, data: { title: 'Expense Head' }, },
      { path: 'site-admin-list', component: SiteAdminListComponent, data: { title: 'Site Admin' }, },
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
    ]
  }
];

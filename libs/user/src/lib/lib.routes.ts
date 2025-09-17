import { Route } from '@angular/router';

import { ChangePasswordComponent } from './components/change-password/change-password.component'
import { ProfileComponent } from './components/profile/profile.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { AmtReceivedComponent } from './components/amt-received/amt-received.component';
import { ReportExpenseComponent } from './components/report-expense/report-expense.component';
// import { ProjectExpenseComponent } from './components/project-expense/project-expense.component';
// import { CashbookComponent } from './components/cashbook/cashbook.component';


import { AppLayoutComponent, VerifyCashbookTableComponent, VerifyReimbursementTableComponent, SummaryCashbookComponent, SummaryReimbursementComponent, SharedCashbookComponent, SharedProjectExpenseComponent } from '@shared';
import { VerifyRouteGuard } from '@auth';

export const userRoutes: Route[] = [
    {
    path: '',
    component: AppLayoutComponent,
    children: [
      {
        path: '',
        component: UserDashboardComponent,
        data: { title: 'User Dashboard' }
      },
      {
        path: 'profile',
        component: ProfileComponent,
        data: { title: 'User Profile' }
      },
      {
        path: 'change-password',
        component: ChangePasswordComponent,
        data: { title: 'Change Password' }
      },
      {
        path: 'amt-received',
        component: AmtReceivedComponent,
        data: { title: 'Amount Received' }
      },
      {
        path: 'report-expense',
        component: ReportExpenseComponent,
        data: { title: 'Report Expense' }
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
      {
        path: 'verify-cashbook',
        canActivate: [VerifyRouteGuard],
        component: VerifyCashbookTableComponent,
        data: { title: 'Verify Cashbook' }
      },
      {
        path: 'verify-reimbursement',
        canActivate: [VerifyRouteGuard],
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
    ]
  }
];

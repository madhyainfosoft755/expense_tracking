import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { ClientSuperAdminService } from '../services/client-superadmin.service';

import { CashbookExpenseSummaryComponent, ReimbursementSummaryComponent } from '@shared';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { selectUser } from '@auth';

@Component({
  selector: 'lib-client-superadmin',
  imports: [CommonModule, RouterModule, AsyncPipe, CashbookExpenseSummaryComponent, ReimbursementSummaryComponent],
  templateUrl: './client_superadmin.html',
  styleUrl: './client_superadmin.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ClientSuperadmin implements OnInit {
  dashboardData: any;
  loading = false;
  currentUser$: Observable<any | null> = of(null);

  constructor(
    private clientSuperAdminService: ClientSuperAdminService,
    private store: Store
  ) {
    this.currentUser$ = this.store.select(selectUser);
  }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(){
      this.loading = true;
      this.clientSuperAdminService.getDashboardData()
      .subscribe({
          next: (res) => {
              this.dashboardData = res;
              this.loading = false;
          },
          error: (err) => {
              this.loading = false;
          }
      });
  }
}

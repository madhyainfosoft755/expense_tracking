import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router';
import { SiteAdminService } from '../services/site-admin.service';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { selectUser } from '@auth';

import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';

import { CashbookExpenseSummaryComponent, ReimbursementSummaryComponent } from '@shared';

@Component({
  selector: 'lib-site-admin',
  imports: [CommonModule, TableModule, MultiSelectModule, RouterModule, FormsModule, CashbookExpenseSummaryComponent, ReimbursementSummaryComponent],
  templateUrl: './site_admin.html',
  styleUrl: './site_admin.scss',
})
export class SiteAdmin implements OnInit {
  dashboardData: any;
  loading = false;
  expenseSummaryData: any;
  loadingED = false;
  currentUser$: Observable<any | null> = of(null);
  userRole: string | null = null;
  office_locations: any[] = [];

  constructor(
    private siteAdminService: SiteAdminService,
    private store: Store
  ) {
    this.currentUser$ = this.store.select(selectUser);
   }

  ngOnInit(): void {
    // this.currentUser$.subscribe(user => {
    //   if (user) {
    //     this.userRole = user.role || null;
    //   } else {
    //     this.userRole = null;
    //   }
    // });
    this.loadDashboardData();
  }

  loadDashboardData(){
      this.loading = true;
      this.siteAdminService.getDashboardData()
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

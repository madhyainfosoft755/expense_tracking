import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { SkeletonModule } from 'primeng/skeleton';
import { AppSuperAdminService } from '../../services/app-superadmin.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, SkeletonModule]
})
export class AppSuperAdminDashboardComponent implements OnInit {
  dashboardData: any = null;
  loading = true;
  breadcrumbItems: any[] = [];

  constructor(private appSuperAdminService: AppSuperAdminService) {}

  ngOnInit(): void {
    this.appSuperAdminService.getDashboardData()
      .subscribe({
        next: (data) => {
          this.dashboardData = data;
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
        }
      });
  }
}

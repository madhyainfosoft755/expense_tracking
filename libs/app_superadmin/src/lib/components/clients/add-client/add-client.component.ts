import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BreadcrumbModule } from 'primeng/breadcrumb';
import { AppSuperAdminService } from '../../../services/app-superadmin.service';

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  standalone: true,
  imports: [CommonModule, BreadcrumbModule]
})
export class AddClientComponent implements OnInit {
  users: any[] = [];
  loading = true;
  breadcrumbItems: any[] = [];

  constructor(private appSuperAdminService: AppSuperAdminService) {}

  ngOnInit(): void {
    this.breadcrumbItems = [
      { label: 'Dashboard', routerLink: '/app-superadmin' },
      { label: 'Client List', routerLink: '/app-superadmin/clients' },
      { label: 'Add Client'}
    ];
    this.appSuperAdminService.getClientList()
      .subscribe({
        next: (data) => {
          this.users = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching users:', err);
          this.loading = false;
        }
      });
  }
}

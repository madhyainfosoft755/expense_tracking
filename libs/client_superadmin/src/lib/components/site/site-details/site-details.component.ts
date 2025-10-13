import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableModule } from 'primeng/table';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TagModule } from 'primeng/tag';
import { MultiSelectModule } from 'primeng/multiselect';


import { ClientSuperAdminService } from '../../../services/client-superadmin.service';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-client-siteadmin-site-details',
  templateUrl: './site-details.component.html',
  standalone: true,
  imports: [CommonModule, TableModule, MultiSelectModule, DialogModule, InputTextModule, ToggleSwitchModule, TagModule, ConfirmDialogModule, BreadcrumbModule, ButtonModule],
  providers: [ConfirmationService, MessageService],
  styles: ``
})
export class SiteDetailsComponent implements OnInit {
  siteDetails: any;
  loading = true;
  breadcrumbItems: any[] = [];
  siteId!: string;

  constructor(
    private clientSuperAdminService: ClientSuperAdminService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.breadcrumbItems = [
      { label: 'Dashboard', routerLink: '/superadmin' },
      { label: 'Site', routerLink: '/superadmin/site-list' },
      { label: 'Site Details' }
    ];
    // this.siteId = this.route.snapshot.paramMap.get('id')!;
    this.route.paramMap.subscribe(params => {
      this.siteId = params.get('id')!;
    });
    this.loadSiteDetails();
  }
  
  loadSiteDetails(){
    // this.siteAdminService.getSiteDetails()
    //   .subscribe({
    //     next: (data) => {
    //       this.siteDetails = data;
    //       this.loading = false;
    //     },
    //     error: (err) => {
    //       this.loading = false;
    //     }
    // });
  }
}

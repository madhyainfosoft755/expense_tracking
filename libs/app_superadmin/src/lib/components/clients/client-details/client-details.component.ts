import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { BreadcrumbModule } from 'primeng/breadcrumb';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { MessageModule } from 'primeng/message';
import { AppSuperAdminService } from '../../../services/app-superadmin.service';
import { ClientDetails } from '../../../+state/app-superadmin.models';

@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.component.html',
  standalone: true,
  imports: [CommonModule, BreadcrumbModule, PanelModule, TableModule, MessageModule ]
})
export class ClientDetailsComponent implements OnInit {
    clientDetails: ClientDetails | undefined;
    loading = true;
    breadcrumbItems: any[] = [];

    constructor(
        private appSuperAdminService: AppSuperAdminService,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.breadcrumbItems = [
            { label: 'Dashboard', routerLink: '/app-superadmin' },
            { label: 'Client List', routerLink: '/app-superadmin/clients' },
            { label: 'Client Details'}
        ];
        const clientId = this.route.snapshot.paramMap.get('client_id');
        if(clientId){
            this.getClientDetails(clientId)
        }
    }
    
    getClientDetails(clientId: string){
        
        this.appSuperAdminService.getClientDetails(clientId)
        .subscribe({
            next: (data) => {
                this.clientDetails = data;
                this.loading = false;
            },
            error: (err) => {
                console.error('Error fetching users:', err);
                this.loading = false;
            }
        });
    }
}

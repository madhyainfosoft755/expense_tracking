import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

import { AppSuperAdminService } from '../../services/app-superadmin.service';
import { UserDetailsTableComponent, UserManageComponent } from '@shared';


@Component({
  selector: 'app-superuser-superadmins-table',
  templateUrl: './superadmins.component.html',
  standalone: true,
  imports: [CommonModule, BreadcrumbModule, ButtonModule, UserDetailsTableComponent, UserManageComponent, DialogModule],
  styles: ``
})
export class SuperadminsComponent implements OnInit {
    superadmins: any[] = [];
    breadcrumbItems: any[] = [];
    loading = false;
    selectedUserDetails: any;
    visibleUserManageDialog = false;

    constructor(
        private appSuperAdminService: AppSuperAdminService,
    ){}

    ngOnInit(): void{
        this.breadcrumbItems = [
            { label: 'Dashboard', routerLink: '/app-superadmin' },
            { label: 'App Superadmin List' }
        ];
        this.loadAllSuperadmins();
    }

    loadAllSuperadmins(){
        this.loading = true;
        this.appSuperAdminService.getAppSuperadminList()
        .subscribe({
            next: (data) => {
                this.superadmins = data;
                this.loading = false;
            },
            error: (err) => {
                console.error('Error fetching clients:', err);
                this.loading = false;
            }
        });
    }

    addNewAppSuperadmin(){
        this.visibleUserManageDialog = true;
    }

    onEmitSelectedUser(user: any){
        this.selectedUserDetails = user;
    }

    onCloseUserDetailsModel(){
        this.visibleUserManageDialog = false;
        this.selectedUserDetails = null;
    }


    onNewUserDetailsEmit(user: any){
        this.appSuperAdminService.addNewAppSuperadmin(user)
        .subscribe({
            next: (data) => {
                this.loadAllSuperadmins();
                this.visibleUserManageDialog = false;
                this.selectedUserDetails = null;
                // this.loading = false;
            },
            error: (err) => {
                console.error('Error fetching clients:', err);
                // this.loading = false;
            }
        });
    }
}

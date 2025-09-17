import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

import { ClientSuperAdminService } from '../../services/client-superadmin.service';
import { UserDetailsTableComponent, UserManageComponent } from '@shared';


@Component({
  selector: 'app-superadmin-siteadmin-list',
  templateUrl: './site-admin-list.component.html',
  standalone: true,
  imports: [CommonModule, BreadcrumbModule, ButtonModule, UserDetailsTableComponent, UserManageComponent, DialogModule],
  styles: ``
})
export class SiteAdminListComponent implements OnInit {
    siteadmins: any;
    breadcrumbItems: any[] = [];
    loading = false;
    selectedUserDetails: any;
    visibleUserManageDialog = false;
    rolesArr: any[] = [
        {
            label: 'Site Admin',
            name: 'SITE_ADMIN'
        },
        {
            label: 'User',
            name: 'USER'
        }
    ];
    userRole = 'SUPERADMIN';
    sitesArr = [];

    constructor(
        private clientSuperAdminService: ClientSuperAdminService
    ){}

    ngOnInit(): void{
        this.breadcrumbItems = [
            { label: 'Dashboard', routerLink: '/superadmin' },
            { label: 'App Site Admin List' }
        ];
        this.loadAllSiteadmins();
        this.getSiteList();
    }

    getSiteList(){
        this.clientSuperAdminService.listSites()
        .subscribe({
            next: (data) => {
            this.sitesArr = data;
            },
            error: (err) => {
            console.error('Error fetching dashboard data:', err);
            }
        });
    }

    loadAllSiteadmins(){
        this.loading = true;
        this.clientSuperAdminService.getSiteAdminList()
        .subscribe({
            next: (data) => {
                this.siteadmins = data;
                this.loading = false;
            },
            error: (err) => {
                console.error('Error fetching:', err);
                this.loading = false;
            }
        });
    }

    addNewAdmin(){
        this.selectedUserDetails = null;
        this.visibleUserManageDialog = true;
    }

    onEmitSelectedUser(user: any){
        console.log(user)
        this.selectedUserDetails = user;
        this.visibleUserManageDialog = true;
    }

    onCloseUserDetailsModel(){
        this.visibleUserManageDialog = false;
        this.selectedUserDetails = null;
    }


    onNewUserDetailsEmit(user: any){
        if(this.selectedUserDetails){
            const userId: string = user.id ?? '';
            if ('id' in user) {
                delete user.isActive;
            }
            if(user.role === 'SITE_ADMIN'){
                this.clientSuperAdminService.updateSiteAdminDetails(userId, user)
                .subscribe({
                    next: (data) => {
                        this.loadAllSiteadmins();
                        this.visibleUserManageDialog = false;
                        this.selectedUserDetails = null;
                        // this.loading = false;
                    },
                    error: (err) => {
                        console.error('Error fetching clients:', err);
                        // this.loading = false;
                    }
                });
            } else {
                this.clientSuperAdminService.updateSiteUserDetails(userId, user)
                .subscribe({
                    next: (data) => {
                        this.loadAllSiteadmins();
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
        } else {
            this.clientSuperAdminService.siteUserAdminCreate(user)
            .subscribe({
                next: (data) => {
                    this.loadAllSiteadmins();
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
}

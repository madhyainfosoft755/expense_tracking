import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

import { ClientSuperAdminService } from '../../services/client-superadmin.service';
import { UserDetailsTableComponent, UserManageComponent } from '@shared';


@Component({
  selector: 'app-superadmin-admin-list',
  templateUrl: './admin-list.component.html',
  standalone: true,
  imports: [CommonModule, BreadcrumbModule, ButtonModule, UserDetailsTableComponent, UserManageComponent, DialogModule],
  styles: ``
})
export class AdminListComponent implements OnInit {
    admins: any[] = [];
    breadcrumbItems: any[] = [];
    loading = false;
    selectedUserDetails: any;
    visibleUserManageDialog = false;

    constructor(
        private clientSuperAdminService: ClientSuperAdminService,
    ){}

    ngOnInit(): void{
        this.breadcrumbItems = [
            { label: 'Dashboard', routerLink: '/superadmin' },
            { label: 'Admin List' }
        ];
        this.loadAllAdmins();
    }

    loadAllAdmins(){
        this.loading = true;
        this.clientSuperAdminService.getAdminList()
        .subscribe({
            next: (data) => {
                this.admins = data;
                this.loading = false;
            },
            error: (err) => {
                console.error('Error fetching clients:', err);
                this.loading = false;
            }
        });
    }

    addNewAdmin(){
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
            this.clientSuperAdminService.updateAdminDetails(userId, user)
            .subscribe({
                next: (data) => {
                    this.loadAllAdmins();
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
            this.clientSuperAdminService.addNewAdmin(user)
            .subscribe({
                next: (data) => {
                    this.loadAllAdmins();
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

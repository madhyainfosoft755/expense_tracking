import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { DrawerModule } from 'primeng/drawer';

import { SiteAdminService } from '../../services/site-admin.service';
import { UserDetailsTableComponent, UserManageComponent, UserFilterComponent, HelperSharedService } from '@shared';


@Component({
  selector: 'app-site-admin-user-list',
  templateUrl: './user-list.component.html',
  standalone: true,
  imports: [CommonModule, BreadcrumbModule, DrawerModule, UserDetailsTableComponent, ButtonModule, UserManageComponent, UserFilterComponent, DialogModule, TableModule, TagModule],
  styles: ``
})
export class UserListComponent implements OnInit {
    users: any[] = [];
    breadcrumbItems: any[] = [];
    loading = false;
    selectedUserDetails: any;
    visibleUserManageDialog = false;
    rolesArr: any[] = [
        {
            label: 'User',
            name: 'USER'
        }
    ];
    userRole = 'SITE_ADMIN';
    sitesArr = [];

    visibleUserFilter = false;
    page = 1;
    isFilterApplied = false;
    noData = false;
    isActive = '';
    preFilters = {};

    constructor(
        private siteAdminService: SiteAdminService,
        private helperSharedService: HelperSharedService,
        private route: ActivatedRoute
    ){}

    ngOnInit(): void{
        this.breadcrumbItems = [
            { label: 'Dashboard', routerLink: '/site-admin' },
            { label: 'User List' }
        ];
        this.route.queryParams.subscribe(params => {
            this.isActive = params['is_active']; // Convert to boolean
            console.log('Is Active:', this.isActive);
        });
        const data = this.isActive && this.isActive!=''?{is_active: this.isActive === 'true'}:{};
        this.preFilters = data;
        this.isFilterApplied = this.helperSharedService.isTruthyObject(data);
        this.loadAllUsers(this.page, data);
    }

    loadAllUsers(page=1, params = {}){
        this.loading = true;
        this.siteAdminService.getAllSiteUserList(page, {...params, role: 'USER'})
        .subscribe({
            next: (res) => {
                this.users = res;
                this.loading = false;
                this.visibleUserFilter = this.noData ?? false;
            },
            error: (err) => {
                console.error('Error fetching clients:', err);
                this.loading = false;
            }
        });
    }

    addNewSiteUser(){
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

    showFilterDrawer(){
        this.visibleUserFilter = true;
    }

    onPageChanged(val: any){
        console.log(val)
        if(val){
            this.page = val;
            this.loadAllUsers(val)
        }
    }

    onNewUserDetailsEmit(user: any){
        if(this.selectedUserDetails){
            const userId: string = user.id ?? '';
            if ('id' in user) {
                delete user.isActive;
            }
            this.siteAdminService.updateSiteUserDetails(userId, user)
            .subscribe({
                next: (data) => {
                    this.loadAllUsers();
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
            this.siteAdminService.siteUserAdminCreate(user)
            .subscribe({
                next: (data) => {
                    this.loadAllUsers();
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

    onClearFilter(){
        this.page = 1;
        this.isFilterApplied = false;
        this.preFilters = {};
        this.loadAllUsers(this.page, {});
    }

    onEmitFilterData(data: any){
        console.log(data)
        this.page = 1;
        this.noData = !this.helperSharedService.isTruthyObject(data);
        this.isFilterApplied = !this.noData;
        this.loadAllUsers(this.page, data);
    }
}

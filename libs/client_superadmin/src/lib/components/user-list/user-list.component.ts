import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { DrawerModule } from 'primeng/drawer';

import { ClientSuperAdminService } from '../../services/client-superadmin.service';
import { UserManageComponent, UserFilterComponent, HelperSharedService } from '@shared';
import { ButtonGroupModule } from 'primeng/buttongroup';


@Component({
  selector: 'app-superadmin-user-list',
  templateUrl: './user-list.component.html',
  standalone: true,
  imports: [CommonModule, BreadcrumbModule, DrawerModule, ButtonGroupModule, ButtonModule, UserManageComponent, UserFilterComponent, DialogModule, TableModule, TagModule],
  styles: ``
})
export class UserListComponent implements OnInit {
    users: any;
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

    visibleUserFilter = false;
    page = 1;
    isFilterApplied = false;
    noData = false;
    isActive = '';
    preFilters = {};
    paginationText: any;

    constructor(
        private clientSuperAdminService: ClientSuperAdminService,
        private helperSharedService: HelperSharedService,
        private route: ActivatedRoute
    ){}

    ngOnInit(): void{
        this.breadcrumbItems = [
            { label: 'Dashboard', routerLink: '/superadmin' },
            { label: 'User List' }
        ];
        this.route.queryParams.subscribe(params => {
            this.isActive = params['is_active']; // Convert to boolean
        });
        const data = this.isActive && this.isActive!=''?{is_active: this.isActive === 'true'}:{};
        this.preFilters = data;
        this.isFilterApplied = this.helperSharedService.isTruthyObject(data);
        this.loadAllUsers(this.page, data);
        this.getSiteList();
    }


    getSiteList(){
        this.clientSuperAdminService.listSites()
        .subscribe({
            next: (data) => {
            this.sitesArr = data;
            },
            error: (err) => {
            }
        });
    }

    loadAllUsers(page=1, params = {}){
        this.loading = true;
        this.clientSuperAdminService.getAllUserList(page, params)
        .subscribe({
            next: (res) => {
                this.users = res;
                this.paginationText = this.helperSharedService.getPaginationText(res);
                this.loading = false;
                this.visibleUserFilter = this.noData ?? false;
            },
            error: (err) => {
                this.loading = false;
            }
        });
    }

    addNewUser(){
        this.selectedUserDetails = null;
        this.visibleUserManageDialog = true;
    }

    selectUser(user: any){
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
            this.clientSuperAdminService.updateUserorSiteAdmin(userId, user)
            .subscribe({
                next: (data) => {
                    this.loadAllUsers();
                    this.visibleUserManageDialog = false;
                    this.selectedUserDetails = null;
                    // this.loading = false;
                },
                error: (err) => {
                    // this.loading = false;
                }
            });
        } else {
            this.clientSuperAdminService.addNewUserorSiteAdmin(user)
            .subscribe({
                next: (data) => {
                    this.loadAllUsers();
                    this.visibleUserManageDialog = false;
                    this.selectedUserDetails = null;
                    // this.loading = false;
                },
                error: (err) => {
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
        this.page = 1;
        this.noData = !this.helperSharedService.isTruthyObject(data);
        this.isFilterApplied = !this.noData;
        this.loadAllUsers(this.page, data);
    }

    next() {
        this.onPageChanged(this.users?.next_page);
    }

    prev() {
        this.onPageChanged(this.users?.previous_page);
    }

    isLastPage(): boolean {
        return !this.users?.next_page;
    }

    isFirstPage(): boolean {
        return !this.users?.previous_page;
    }
}

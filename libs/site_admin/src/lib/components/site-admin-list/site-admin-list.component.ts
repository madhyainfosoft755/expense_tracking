import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DrawerModule } from 'primeng/drawer';

import { SiteAdminService } from '../../services/site-admin.service';
import { UserDetailsTableComponent, UserManageComponent, UserFilterComponent, HelperSharedService } from '@shared';


@Component({
  selector: 'app-superadmin-siteadmin-list',
  templateUrl: './site-admin-list.component.html',
  standalone: true,
  imports: [CommonModule, BreadcrumbModule, ButtonModule, DrawerModule, UserDetailsTableComponent, UserManageComponent, DialogModule, UserFilterComponent],
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
            { label: 'App Site Admin List' }
        ];
        this.route.queryParams.subscribe(params => {
            this.isActive = params['is_active']; // Convert to boolean
        });
        const data = this.isActive && this.isActive!=''?{is_active: this.isActive === 'true'}:{};
        this.preFilters = data;
        this.isFilterApplied = this.helperSharedService.isTruthyObject(data);
        this.loadAllSiteadmins(this.page, data);
    }

    loadAllSiteadmins(page=1, params = {}){
        this.loading = true;
        this.siteAdminService.getAllSiteUserList(page, {...params, role: 'SITE_ADMIN'})
        .subscribe({
            next: (data) => {
                this.siteadmins = data;
                this.loading = false;
                this.visibleUserFilter = this.noData ?? false;
            },
            error: (err) => {
                this.loading = false;
            }
        });
    }

    addNewAdmin(){
        this.visibleUserManageDialog = true;
    }

    onEmitSelectedUser(user: any){
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
            this.loadAllSiteadmins(val)
        }
    }


    onNewUserDetailsEmit(user: any){
        this.siteAdminService.siteUserAdminCreate(user)
        .subscribe({
            next: (data) => {
                this.loadAllSiteadmins();
                this.visibleUserManageDialog = false;
                this.selectedUserDetails = null;
                // this.loading = false;
            },
            error: (err) => {
                // this.loading = false;
            }
        });
    }

    onClearFilter(){
        this.page = 1;
        this.isFilterApplied = false;
        this.preFilters = {};
        this.loadAllSiteadmins(this.page, {});
    }

    onEmitFilterData(data: any){
        this.page = 1;
        this.noData = !this.helperSharedService.isTruthyObject(data);
        this.isFilterApplied = !this.noData;
        this.loadAllSiteadmins(this.page, data);
    }
}


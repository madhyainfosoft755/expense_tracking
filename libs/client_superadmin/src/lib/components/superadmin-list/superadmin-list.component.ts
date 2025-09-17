import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DrawerModule } from 'primeng/drawer';

import { ClientSuperAdminService } from '../../services/client-superadmin.service';
import { UserDetailsTableComponent, UserManageComponent, UserFilterComponent, HelperSharedService } from '@shared';


@Component({
  selector: 'app-client-superadmin-superadmin-list',
  templateUrl: './superadmin-list.component.html',
  standalone: true,
  imports: [CommonModule, BreadcrumbModule, DrawerModule, ButtonModule, UserDetailsTableComponent, UserManageComponent, DialogModule, UserFilterComponent],
  styles: ``
})
export class SuperadminListComponent implements OnInit {
    superadmins: any[] = [];
    breadcrumbItems: any[] = [];
    loading = false;
    selectedUserDetails: any;
    visibleUserManageDialog = false;
    visibleUserFilter = false;
    page = 1;
    isFilterApplied = false;
    noData = false;
    isActive = '';
    preFilters = {};

    constructor(
        private clientSuperAdminService: ClientSuperAdminService,
        private helperSharedService: HelperSharedService,
        private route: ActivatedRoute
    ){}

    ngOnInit(): void{
        this.breadcrumbItems = [
            { label: 'Dashboard', routerLink: '/superadmin' },
            { label: 'Superadmin List' }
        ];
        this.route.queryParams.subscribe(params => {
            this.isActive = params['is_active']; // Convert to boolean
            console.log('Is Active:', this.isActive);
        });
        const data = this.isActive && this.isActive!=''?{is_active: this.isActive === 'true'}:{};
        this.preFilters = data;
        this.isFilterApplied = this.helperSharedService.isTruthyObject(data);
        this.loadAllSuperadmins(this.page, data);
    }

    loadAllSuperadmins(page=1, params = {}){
        this.loading = true;
        this.clientSuperAdminService.getSuperadminList(page, params)
        .subscribe({
            next: (data) => {
                this.superadmins = data;
                this.loading = false;
                this.visibleUserFilter = this.noData ?? false;
            },
            error: (err) => {
                console.error('Error fetching clients:', err);
                this.loading = false;
            }
        });
    }

    addNewSuperadmin(){
        this.visibleUserManageDialog = true;
    }

    onEmitSelectedUser(user: any){
        this.selectedUserDetails = user;
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
            this.loadAllSuperadmins(val)
        }
    }


    onNewUserDetailsEmit(user: any){
        this.clientSuperAdminService.addNewSuperadmin(user)
        .subscribe({
            next: (data) => {
                this.page = 1;
                this.loadAllSuperadmins(this.page);
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

    onClearFilter(){
        this.page = 1;
        this.isFilterApplied = false;
        this.preFilters = {};
        this.loadAllSuperadmins(this.page, {});
    }

    onEmitFilterData(data: any){
        console.log(data)
        this.page = 1;
        this.noData = !this.helperSharedService.isTruthyObject(data);
        this.isFilterApplied = !this.noData;
        this.loadAllSuperadmins(this.page, data);
    }
}

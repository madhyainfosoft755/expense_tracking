import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitemComponent } from './app.menuitem.component';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { selectUser } from '@auth';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitemComponent, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenuComponent implements OnInit, OnDestroy {
    model: MenuItem[] = [];
    userMenuSub: Subscription | null = null;

    constructor(private store: Store){}

    defaultVerifyRolesArr = ['SUPERADMIN', 'ADMIN', 'SITE_ADMIN'];

    ngOnInit() {
        const old = [
            {
                label: 'Home',
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }]
            },
            {
                label: 'Links',
                items: [
                    { label: 'Home', icon: 'pi pi-fw pi-id-card', routerLink: ['/'] },
                    { label: 'User', icon: 'pi pi-fw pi-check-square', routerLink: ['/user'] },
                    { label: 'ClientSuperadmin', icon: 'pi pi-fw pi-mobile', class: 'rotated-icon', routerLink: ['/client-superadmin'] },
                    { label: 'AppSuperadmin', icon: 'pi pi-fw pi-table', routerLink: ['/app-superadmin'] },
                    { label: 'ClientAdmin', icon: 'pi pi-fw pi-list', routerLink: ['/client-admin'] },
                    { label: 'SiteAdmin', icon: 'pi pi-fw pi-share-alt', routerLink: ['/site-admin'] },
                    { label: 'Public', icon: 'pi pi-fw pi-tablet', routerLink: ['/public'] }
                ]
            },
            {
                label: 'UI Components',
                items: [
                    { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', routerLink: ['/uikit/formlayout'] },
                    { label: 'Input', icon: 'pi pi-fw pi-check-square', routerLink: ['/uikit/input'] },
                    { label: 'Button', icon: 'pi pi-fw pi-mobile', class: 'rotated-icon', routerLink: ['/uikit/button'] },
                    { label: 'Table', icon: 'pi pi-fw pi-table', routerLink: ['/uikit/table'] },
                    { label: 'List', icon: 'pi pi-fw pi-list', routerLink: ['/uikit/list'] },
                    { label: 'Tree', icon: 'pi pi-fw pi-share-alt', routerLink: ['/uikit/tree'] },
                    { label: 'Panel', icon: 'pi pi-fw pi-tablet', routerLink: ['/uikit/panel'] },
                    { label: 'Overlay', icon: 'pi pi-fw pi-clone', routerLink: ['/uikit/overlay'] },
                    { label: 'Media', icon: 'pi pi-fw pi-image', routerLink: ['/uikit/media'] },
                    { label: 'Menu', icon: 'pi pi-fw pi-bars', routerLink: ['/uikit/menu'] },
                    { label: 'Message', icon: 'pi pi-fw pi-comment', routerLink: ['/uikit/message'] },
                    { label: 'File', icon: 'pi pi-fw pi-file', routerLink: ['/uikit/file'] },
                    { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/uikit/charts'] },
                    { label: 'Timeline', icon: 'pi pi-fw pi-calendar', routerLink: ['/uikit/timeline'] },
                    { label: 'Misc', icon: 'pi pi-fw pi-circle', routerLink: ['/uikit/misc'] }
                ]
            },
            {
                label: 'Pages',
                icon: 'pi pi-fw pi-briefcase',
                routerLink: ['/pages'],
                items: [
                    {
                        label: 'Landing',
                        icon: 'pi pi-fw pi-globe',
                        routerLink: ['/landing']
                    },
                    {
                        label: 'Auth',
                        icon: 'pi pi-fw pi-user',
                        items: [
                            {
                                label: 'Login',
                                icon: 'pi pi-fw pi-sign-in',
                                routerLink: ['/login']
                            },
                            {
                                label: 'Error',
                                icon: 'pi pi-fw pi-times-circle',
                                routerLink: ['/auth/error']
                            },
                            {
                                label: 'Access Denied',
                                icon: 'pi pi-fw pi-lock',
                                routerLink: ['/auth/access']
                            }
                        ]
                    },
                    {
                        label: 'Crud',
                        icon: 'pi pi-fw pi-pencil',
                        routerLink: ['/pages/crud']
                    },
                    {
                        label: 'Not Found',
                        icon: 'pi pi-fw pi-exclamation-circle',
                        routerLink: ['/pages/notfound']
                    },
                    {
                        label: 'Empty',
                        icon: 'pi pi-fw pi-circle-off',
                        routerLink: ['/pages/empty']
                    }
                ]
            },
            {
                label: 'Hierarchy',
                items: [
                    {
                        label: 'Submenu 1',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [
                            {
                                label: 'Submenu 1.1',
                                icon: 'pi pi-fw pi-bookmark',
                                items: [
                                    { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
                                    { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
                                    { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' }
                                ]
                            },
                            {
                                label: 'Submenu 1.2',
                                icon: 'pi pi-fw pi-bookmark',
                                items: [{ label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }]
                            }
                        ]
                    },
                    {
                        label: 'Submenu 2',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [
                            {
                                label: 'Submenu 2.1',
                                icon: 'pi pi-fw pi-bookmark',
                                items: [
                                    { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
                                    { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' }
                                ]
                            },
                            {
                                label: 'Submenu 2.2',
                                icon: 'pi pi-fw pi-bookmark',
                                items: [{ label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' }]
                            }
                        ]
                    }
                ]
            },
            {
                label: 'Get Started',
                items: [
                    {
                        label: 'Documentation',
                        icon: 'pi pi-fw pi-book',
                        routerLink: ['/documentation']
                    },
                    {
                        label: 'View Source',
                        icon: 'pi pi-fw pi-github',
                        url: 'https://mistpl.com',
                        target: '_blank'
                    }
                ]
            }
        ];
        const APP_SUPERADMIN_MODEL: MenuItem[] = [
            {
                label: 'Masters',
                items: [
                    { label: 'Superadmin', icon: 'pi pi-fw pi-users', routerLink: [`/app-superadmin/superadmins`] },
                    { label: 'Client', icon: 'pi pi-fw pi-building', routerLink: [`/app-superadmin/clients`] }
                ]
            },
        ];
        const SUPERADMIN_MODEL: MenuItem[] = [
            {
                label: 'Masters',
                items: [
                    { label: 'Superadmin', icon: 'pi pi-fw pi-check-square', routerLink: ['/superadmin/superadmin-list'] },
                    // { label: 'Admin', icon: 'pi pi-fw pi-mobile', class: 'rotated-icon', routerLink: ['/superadmin/admin-list'] },
                    { label: 'Site', icon: 'pi pi-fw pi-table', routerLink: ['/superadmin/site-list'] },
                    { label: 'User', icon: 'pi pi-fw pi-mobile', class: 'rotated-icon', routerLink: ['/superadmin/user-list'] },
                    { label: 'Expense Head', icon: 'pi pi-fw pi-share-alt', routerLink: ['/superadmin/expense-head-list'] },
                    { label: 'Cashbook', icon: 'pi pi-fw pi-table', routerLink: ['/superadmin/cashbook'] },
                    { label: 'Project Expense', icon: 'pi pi-fw pi-table', routerLink: ['/superadmin/project-expense'] },
                ]
            },
        ];
        const ADMIN_MODEL: MenuItem[] = [
            {
                label: 'Masters',
                items: [
                    { label: 'Admin', icon: 'pi pi-fw pi-mobile', class: 'rotated-icon', routerLink: ['/admin/admin-list'] },
                    { label: 'Site', icon: 'pi pi-fw pi-table', routerLink: ['/admin/site-list'] },
                    { label: 'User', icon: 'pi pi-fw pi-mobile', class: 'rotated-icon', routerLink: ['/admin/user-list'] },
                    { label: 'Expense Head', icon: 'pi pi-fw pi-share-alt', routerLink: ['/admin/expense-head-list'] },
                    { label: 'Cashbook', icon: 'pi pi-fw pi-table', routerLink: ['/admin/cashbook'] },
                    { label: 'Project Expense', icon: 'pi pi-fw pi-table', routerLink: ['/admin/project-expense'] },
                ]
            },
        ];
        const SITE_ADMIN_MODEL: MenuItem[] = [
            {
                label: 'Masters',
                items: [
                    { label: 'Site Admin', icon: 'pi pi-fw pi-table', routerLink: ['/site-admin/site-admin-list'] },
                    { label: 'User', icon: 'pi pi-fw pi-mobile', class: 'rotated-icon', routerLink: ['/site-admin/site-user-list'] },
                    { label: 'Expense Head', icon: 'pi pi-fw pi-share-alt', routerLink: ['/site-admin/expense-head-list'] },
                    { label: 'Cashbook', icon: 'pi pi-fw pi-table', routerLink: ['/site-admin/cashbook'] },
                    { label: 'Project Expense', icon: 'pi pi-fw pi-table', routerLink: ['/site-admin/project-expense'] },
                ]
            },
        ];
        const USER_MODEL: MenuItem[] = [
            {
                label: 'Cashbook',
                items: [
                    { label: 'Amt Received', icon: 'pi pi-fw pi-table', routerLink: ['/user/amt-received'] },
                    { label: 'Report Expense', icon: 'pi pi-fw pi-table', routerLink: ['/user/report-expense'] },
                    { label: 'Cashbook', icon: 'pi pi-fw pi-table', routerLink: ['/user/cashbook'] },
                    { label: 'Project Expense', icon: 'pi pi-fw pi-table', routerLink: ['/user/project-expense'] },
                ]
            }
        ];
        this.userMenuSub = this.store.select(selectUser).subscribe(
            (user) => {
                if (user) {
                    this.model = [
                        {
                            label: 'Home',
                            items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: [`/${user.roleLower}`] }]
                        }
                    ]
                    const verifyObj = {
                        label: 'Verify',
                        icon: 'pi pi-fw pi-bookmark',
                        visible: user.permissions.includes('allow_verify_cashbook_expense') ||
                            user.permissions.includes('allow_verify_reimbursement_expense') || this.defaultVerifyRolesArr.includes(user.role),
                        items: [
                            { 
                                label: 'Reimbursement', icon: 'pi pi-fw pi-bookmark' ,
                                visible: user.permissions.includes('allow_verify_reimbursement_expense') || this.defaultVerifyRolesArr.includes(user.role),
                                routerLink: [`/${user.roleLower}/verify-reimbursement`]
                            },
                            { 
                                label: 'Cashbook', icon: 'pi pi-fw pi-bookmark' ,
                                visible: user.permissions.includes('allow_verify_cashbook_expense') || this.defaultVerifyRolesArr.includes(user.role),
                                routerLink: [`/${user.roleLower}/verify-cashbook`]
                            }
                        ]
                    };

                    const summaryObj = {
                        label: 'Summary',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [
                            { 
                                label: 'Reimbursement', icon: 'pi pi-fw pi-bookmark' ,
                                routerLink: [`/${user.roleLower}/summary-reimbursement`]
                            },
                            { 
                                label: 'Cashbook', icon: 'pi pi-fw pi-bookmark' ,
                                routerLink: [`/${user.roleLower}/summary-cashbook`]
                            }
                        ]
                    };
                    if(user.role === "APP_SUPERADMIN"){
                        this.model = [...this.model, ...APP_SUPERADMIN_MODEL];
                    } else if(user.role === "SUPERADMIN"){
                        this.model = [...this.model, ...SUPERADMIN_MODEL, verifyObj, summaryObj];
                    } else if(user.role === "ADMIN"){
                        this.model = [...this.model, ...ADMIN_MODEL, verifyObj, summaryObj];
                    } else if(user.role === "SITE_ADMIN"){
                        this.model = [...this.model, ...SITE_ADMIN_MODEL, verifyObj, summaryObj];
                    } else {
                        this.model = [...this.model, ...USER_MODEL, verifyObj, summaryObj];
                    }
                }
            });
    }

    ngOnDestroy(): void {
        if(this.userMenuSub){
            this.userMenuSub.unsubscribe();
        }
    }
}
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MenuItem, ConfirmationService } from 'primeng/api';
import { StyleClassModule } from 'primeng/styleclass';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MenuModule } from 'primeng/menu';

import { AuthService, selectUser } from '@auth';

import { LayoutService } from '../service/layout.service';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, ConfirmDialogModule, MenuModule],
    providers: [ConfirmationService],
    template: ` <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
                <i class="pi pi-bars"></i>
            </button>
            <a class="layout-topbar-logo" routerLink="/">
                <img src="{{user.logo ? user.logo : 'et-logo.png'}}" alt="APCON" height="80" width="80" />
                <!-- <span>MISTPL</span> -->
            </a>
        </div>

        <div class="layout-topbar-actions">
            <!-- <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" (click)="toggleDarkMode()">
                    <i [ngClass]="{ 'pi ': true, 'pi-moon': layoutService.isDarkTheme(), 'pi-sun': !layoutService.isDarkTheme() }"></i>
                </button>
                <div class="relative">
                    <button
                        class="layout-topbar-action layout-topbar-action-highlight"
                        pStyleClass="@next"
                        enterFromClass="hidden"
                        enterActiveClass="animate-scalein"
                        leaveToClass="hidden"
                        leaveActiveClass="animate-fadeout"
                        [hideOnOutsideClick]="true"
                    >
                        <i class="pi pi-palette"></i>
                    </button>
                    <app-configurator />
                </div>
            </div>

            <button class="layout-topbar-menu-button layout-topbar-action" pStyleClass="@next" enterFromClass="hidden" enterActiveClass="animate-scalein" leaveToClass="hidden" leaveActiveClass="animate-fadeout" [hideOnOutsideClick]="true">
                <i class="pi pi-ellipsis-v"></i>
            </button> -->

            <div *ngIf="user && user.role" class="flex items-center">
                <strong>{{ user.site_name ? user.site_name.trim() + ' - ': '' }}</strong> <strong class="text-green-500">{{user.role.replace("_", " ")}}</strong>
            </div>

            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    <!-- <button type="button" class="layout-topbar-action">
                        <i class="pi pi-calendar"></i>
                        <span>Calendar</span>
                    </button>
                    <button type="button" class="layout-topbar-action">
                        <i class="pi pi-inbox"></i>
                        <span>Messages</span>
                    </button> -->
                    <button type="button" class="layout-topbar-action" (click)="menu.toggle($event)">
                        <i class="pi pi-user"></i>
                        <span>Profile</span>
                    </button>
                    <p-menu #menu [model]="items" [popup]="true" />
                </div>
            </div>
        </div>
    </div>
    <p-confirmDialog></p-confirmDialog>`
})
export class AppTopbarComponent implements OnInit, OnDestroy {
    items!: MenuItem[];
    user: any
    userMenuSub: Subscription | null = null;


    constructor(
        public layoutService: LayoutService, 
        private authService: AuthService,
        public router: Router,
        private confirmationService: ConfirmationService,
        private store: Store
    ) {}

    ngOnInit(): void {
        this.userMenuSub = this.store.select(selectUser).subscribe(
                    (user) => {
                        this.user = user
                    })
        this.items = [
            {
                label: 'Options',
                items: [
                    {
                        label: 'Profile',
                        icon: 'pi pi-user',
                        command: () => {
                            this.router.navigate(['/user/profile']);
                        }
                    },
                    {
                        label: 'Change Password',
                        icon: 'pi pi-lock',
                        command: () => {
                            this.router.navigate(['/user/change-password']);
                        }
                    }
                ]
            },
            {
                separator: true
            },
            {
                items: [
                    {
                        label: 'Logout',
                        icon: 'pi pi-sign-out',
                        shortcut: '⌘+Q',
                        command: () => {
                            this.confirm();
                        }
                    }
                ]
            },
        ];
    }

    confirm() {
        this.confirmationService.confirm({
            message: 'Are you sure that you want to logout?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptIcon:"none",
            rejectIcon:"none",
            rejectButtonStyleClass:"p-button",
            acceptButtonStyleClass: 'p-button-outlined',
            accept: () => {
                this.authService.logout();
            },
            reject: () => {
                // do nothing
            }
        });
    }

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }

    ngOnDestroy(): void {
        if(this.userMenuSub){
            this.userMenuSub.unsubscribe();
        }
    }
}
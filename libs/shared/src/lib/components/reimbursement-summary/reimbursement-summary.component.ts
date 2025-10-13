import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';

import { TableModule } from 'primeng/table';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';

import { HelperSharedService } from '../../services/helper-shared.service';
import { CommonAPIService } from '../../services/common-api.service';

import {
  selectUser,
} from '@auth';

@Component({
  selector: 'lib-shared-reimbursement-summary',
  imports: [CommonModule, TableModule, MultiSelectModule, FormsModule, SelectModule, ButtonModule],
  templateUrl: 'reimbursement-summary.component.html',
  styles: [],
  encapsulation: ViewEncapsulation.None,
})
export class ReimbursementSummaryComponent implements OnInit {
    projectExpenseSummaryData: any[] = [];
    loadingPED = false;
    userRole: string | null = null;
    office_locations: any[] = [];
    currentUser$: Observable<any | null> = of(null);

    selectedOfficeLocations: number[] = [];

    currentYear: number= new Date().getFullYear();
    years: {name: number}[] = []

    selectedMonthCashBook: number[] = [];

    months: { number: number | string; month: string }[] = [];

    constructor(
        private helperSharedService: HelperSharedService,
        private commonApiService: CommonAPIService,
        private store: Store
    ) { 
        this.currentUser$ = this.store.select(selectUser);
     }

    ngOnInit(): void {
        this.months = this.helperSharedService.getAllMonths();

        // Fallback if parent didn't pass currentYear or months
        const today = new Date();
        // if (!this.currentYear) {
        //     this.currentYear = today.getFullYear();
            // this.years = [{name: this.currentYear-2}, {name: this.currentYear-1}, {name: this.currentYear}];
            this.years = [{name: this.currentYear}];
        // }

        if (!this.selectedMonthCashBook || this.selectedMonthCashBook.length === 0) {
            const currentMonth = today.getMonth() + 1;
            this.selectedMonthCashBook = [currentMonth];
        }

        this.currentUser$.subscribe(user => {
            if (user) {
                this.userRole = user.role || null;
                if (user.role == 'SUPERADMIN'){
                    this.getSiteList(user.priority_site);
                }
            } else {
                this.userRole = null;
            }
        });
        this.projectExpenseSummary();
    }

     // 🔁 Trigger emitters on change (bind these in template)
    onMonthChange(value: number[]) {
        this.selectedMonthCashBook = value;
    }

    onOfficeLocationChange(value: number[]) {
        this.selectedOfficeLocations = value;
    }

    onYearChange(value: number) {
        this.currentYear = value;
    }

    filterApplyed(){
        this.projectExpenseSummary();
    }

    projectExpenseSummary(){
        this.loadingPED = true;
        const data: any = {
            months:  this.selectedMonthCashBook,
            year: this.currentYear
        };
        if(this.userRole == 'SUPERADMIN'){
            data['office_locations'] = this.selectedOfficeLocations;
        }
        // {
        //   "months": [1, 2, 3],
        //   "year": 2024,
        //   "office_locations": [1, 3],
        //   "username": "aman",
        //   "sort_by": "amount",
        //   "sort_order": "desc"
        // }
        this.commonApiService.ProjectExpenseSummaryData(data)
        .subscribe({
            next: (res: any) => {
                this.projectExpenseSummaryData = res;
                this.loadingPED = false;
            },
            error: (err: any) => {
                this.loadingPED = false;
            }
        });
    }

    getSiteList(site_data: {id: number, name: string} | null){
        this.commonApiService.listSites()
        .subscribe({
            next: (data: any) => {
                this.office_locations = data;
                if(site_data){
                    this.selectedOfficeLocations = [site_data.id];
                    this.projectExpenseSummary();
                }
            },
            error: (err: any) => {
            }
        });
    }
}

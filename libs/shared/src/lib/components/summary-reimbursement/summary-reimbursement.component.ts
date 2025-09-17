import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';

import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { SelectModule } from 'primeng/select';
import {
  selectUser,
} from '@auth';

import { CommonAPIService } from '../../services/common-api.service';
import { HelperSharedService } from '../../services/helper-shared.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'lib-summary-reimbursement',
  templateUrl: './summary-reimbursement.component.html',
  standalone: true,
  imports: [CommonModule, TableModule, FormsModule, ButtonModule, MultiSelectModule, SelectModule, BreadcrumbModule],
  styles: ``
})
export class SummaryReimbursementComponent implements OnInit {

    data: any;
    loading = false;
    today = new Date();
    currentYear: number;
    breadcrumbItems: any[] = [];
    sites: any[] = [];
    userRole: string | null = null;
    currentUser$: Observable<any | null> = of(null);
    statusOptions = [
        { label: 'Pending', value: 'PENDING' },
        // { label: 'Withdraw', value: 'WITHDRAW' },
        { label: 'Approved', value: 'APPROVED' },
        { label: 'Rejected', value: 'REJECTED' }
    ];
    selectedStatus;
    selectedOfficeLocations: any;
    years: {name: number}[] = [
        {name: this.today.getFullYear()},
    ];

    months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    constructor(
        private commonApiService: CommonAPIService,
        private store: Store,
        private helperSharedService: HelperSharedService
    ) {
        this.selectedStatus = this.statusOptions[1].value;
        this.currentYear = this.today.getFullYear();
        this.currentUser$ = this.store.select(selectUser);
    }

    ngOnInit(): void {
        this.breadcrumbItems = [
            { label: 'Dashboard', routerLink: '/' },
            { label: 'Reimbursement Summary' }
        ];
        this.currentUser$.subscribe(user => {
            if (user) {
                this.userRole = user.role || null;
                if (user.role == 'SUPERADMIN'){
                    this.getSiteList(user.priority_site);
                } else {
                    this.loadSummaryData();
                }
            } else {
                this.userRole = null;
                this.loadSummaryData();
            }
        });
    }

    loadSummaryData(): void {
        this.loading = true;
        const data: any = {
            year: this.currentYear,
            statusoptions: [this.selectedStatus].join(',')
        }
        if(this.userRole == 'SUPERADMIN' && this.selectedOfficeLocations){
            data['office_locations'] = [this.selectedOfficeLocations].join(',');
        }
        this.commonApiService.getSummaryReimbursement(data).subscribe({
            next: (res) => {
                // this.data = res.reimbursement_summary_data;
                // Copy data
                this.data = res.reimbursement_summary_data.map((item: any) => {
                    // Row total (Grand total per row)
                    const rowTotal = this.months.reduce((sum, month) => sum + (item.total[month] || 0), 0);

                    return {
                        ...item,
                        total: {
                        ...item.total,
                        GrandTotal: rowTotal   // ✅ new column in each row
                        }
                    };
                });

                // Now compute the "Grand Total" row
                const grandTotals: any = {};
                this.months.forEach(month => {
                    grandTotals[month] = this.data.reduce(
                        (sum: number, item: any) => sum + (item.total[month] || 0), 0
                    );
                });

                // Grand total of all months
                grandTotals['GrandTotal'] = this.months.reduce(
                    (sum, month) => sum + grandTotals[month], 0
                );

                // Push the final row
                this.data.push({
                    name: 'Grand Total',
                    id: null,
                    total: grandTotals
                });
                console.log(this.data)
                this.loading = false;
            },
            error: (err) => {
                this.loading = false;
            }
        });
    }

    getSiteList(site_data: {id: number, name: string} | null){
        this.commonApiService.listSites()
        .subscribe({
            next: (data: any) => {
                this.sites = data;
                if(site_data){
                    this.selectedOfficeLocations = site_data.id;
                    this.loadSummaryData();
                }
            },
            error: (err: any) => {
                console.error('Error fetching dashboard data:', err);
            }
        });
    }

    onStatusChange(value: string) {
        this.selectedStatus = value;
        this.loadSummaryData();
    }

    onYearChange(value: number) {
        this.currentYear = value;
        this.loadSummaryData();
    }

    onOfficeLocationChange(value: number) {
        this.selectedOfficeLocations = value;
        this.loadSummaryData();
    }

    getRowTotal(item: any): number {
        return this.months.reduce((sum, month) => sum + (item.total[month] || 0), 0);
    }

    getColumnTotal(month: string): number {
        return this.data.reduce((sum: any, item: any) => sum + (item.total[month] || 0), 0);
    }

    getGrandTotal(): number {
        return this.months.reduce((sum, month) => sum + this.getColumnTotal(month), 0);
    }

    exportToCSV() {
        const data = structuredClone(this?.data || []);
        const csvRows: any[] = [];
        data.forEach((row: any, index: number) => {
            const data: any = {
                'SN': index + 1,
                'Expense Head': row.name || '',
                'January': row.total.January || '',
                'February': row.total.February || '',
                'March': row.total.March || '',
                'April': row.total.April || '',
                'May': row.total.May || '',
                'June': row.total.June || '',
                'July': row.total.July || '',
                'August': row.total.August || '',
                'September': row.total.September || '',
                'October': row.total.October || '',
                'November': row.total.November || '',
                'December': row.total.December || '',
                'Total': row.total.GrandTotal,
            };
            csvRows.push(data);
        });
        this.helperSharedService.exportToCSV(csvRows, 'summary_reimbursement');

    }
}
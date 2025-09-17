import { Component, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DrawerModule } from 'primeng/drawer';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { Subscription } from 'rxjs';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonGroupModule } from 'primeng/buttongroup';
import {
  selectUser,
} from '@auth';

import { CommonAPIService } from '../../services/common-api.service';
import { HelperSharedService } from '../../services/helper-shared.service';
import { ImageModule } from 'primeng/image';

@Component({
  selector: 'lib-verify-reimbursement-table',
  templateUrl: './verify-reimbursement-table.component.html',
  standalone: true,
  imports: [CommonModule, DatePickerModule, ButtonGroupModule, ImageModule, SelectModule, MultiSelectModule, ReactiveFormsModule, DrawerModule, TableModule, BreadcrumbModule, ButtonModule, TagModule, DialogModule, InputTextModule],
  styles: ``
})
export class VerifyReimbursementTableComponent implements OnInit, OnDestroy {
    loading = false;
    response: any;
    visibleRemarksModal = false;
    loadingRemarks = false;
    rolesArr: string[] = ['SUPERADMIN', 'ADMIN'];
    isVisibleVerified = false;
    currentUser$: Observable<any | null>;
    userRole: string | null = null;
    remarksForm: FormGroup;
    claimId = '';
    claimStatus: 'approve' | 'reject' | '' = '';
    breadcrumbItems: any[] = [];
    userFilterForm: FormGroup;
    initialAdvSearchValues: any;
    page = 1;
    enableAdvSearch = false;
    subscriptions: Subscription[] = [];
    loadingAdvanceFilter = false;
    sites: any[] = [];
    visibleUserFilter = false;
    isFilterApplied = false;
    noData = false;
    paginationText: any;
    loadingExport = false;

    constructor(
      private commonAPIService: CommonAPIService,
      private store: Store,
      private fb: FormBuilder,
      private helperSharedService: HelperSharedService
    ){
      this.remarksForm = this.fb.group({
        remarks: ['', [Validators.required, Validators.maxLength(255)]]
      });
      this.currentUser$ = this.store.select(selectUser);
      this.userFilterForm = this.fb.group({
          name: ['', [Validators.maxLength(255)]],
          vendor_name: ['', [Validators.maxLength(255)]],
          expense_expense_head: ['', [Validators.maxLength(255)]],
          date: ['', [Validators.maxLength(255)]],
          amount: ['', [Validators.maxLength(10)]],
          expense_office_location: ['', [Validators.maxLength(50)]]
      });
      this.initialAdvSearchValues = this.userFilterForm.value;
    }

    onCloseRemarksModel(){
      this.claimId = '';
      this.claimStatus = '';
      this.visibleRemarksModal = false;
      this.remarksForm.reset();
    }

    ngOnInit(){
      this.breadcrumbItems = [
        { label: 'Dashboard', routerLink: '/' },
        { label: 'Reimbursement' }
      ];
      this.currentUser$.subscribe(user => {
        if (user) {
          this.userRole = user.role || null;

          this.isVisibleVerified = this.rolesArr.includes(this.userRole ?? '');
          if(user.role == "SUPERADMIN"){
            this.getSiteList();
          }
        } else {
          this.userRole = null;
          this.isVisibleVerified = false;
        }
      });
      const advanceSearchFormSub = this.userFilterForm.valueChanges.subscribe((currentValue: any)  => {
          this.enableAdvSearch = JSON.stringify(this.helperSharedService.replaceNullsWithEmpty(currentValue)) !== JSON.stringify(this.helperSharedService.replaceNullsWithEmpty(this.initialAdvSearchValues));
      });
      this.subscriptions.push(advanceSearchFormSub);
      this.loadUnApprovedCashbook(this.page, {});
    }

    getSiteList(){
      this.commonAPIService.listSites()
        .subscribe({
          next: (data) => {
            this.sites = data;
            this.loading = false;
          },
          error: (err) => {
            console.error('Error fetching dashboard data:', err);
            this.loading = false;
          }
        });
    }

    showRemarksModal(claimId: string, claimStatus: 'approve' | 'reject'|''){
      this.claimId = claimId;
      this.claimStatus = claimStatus;
      this.remarksForm.reset();
      this.visibleRemarksModal = true;
    }

    loadUnApprovedCashbook(page=1, params={}){
        this.loading = true;
        this.commonAPIService.UnapprovedProjectExpense(page, {...params, ordering: 'name'})
        .subscribe(
            {
                next: (res: any) => {
                  this.response = res;
                  this.paginationText = this.helperSharedService.getPaginationText(res);
                  this.loading = false;
                  this.visibleUserFilter = this.noData ?? false;
                  this.noData = false;
                  // this.addMessages({severity: 'success', life: 30000, content:'Verified Successfully.'});
                },
                error: (error: any) => {
                  this.loading = false;
                  // this.addMessages({severity: 'error', life: 30000, content: error?.error?.error || 'An error occurred while processing your request.'});
                }
            }
            );
    }

    onSubmit() {
        if (this.remarksForm.invalid) {
            this.remarksForm.markAllAsTouched();
            return;
        }
        this.loadingRemarks = true;
        this.commonAPIService.VerifyProjectExpense({remarks: this.remarksForm.value.remarks}, this.claimId, this.claimStatus)
        .subscribe(
            {
                next: (res: any) => {
                  this.claimId = '';
                  this.claimStatus = '';
                  this.visibleRemarksModal = false;
                  this.loadingRemarks = false;
                  this.loadUnApprovedCashbook();
                  // this.addMessages({severity: 'success', life: 30000, content:'Verified Successfully.'});
                },
                error: (error: any) => {
                  this.loadingRemarks = false;
                  // this.addMessages({severity: 'error', life: 30000, content: error?.error?.error || 'An error occurred while processing your request.'});
                }
            }
            );
    }

    onSubmitFilter(){
      this.page = 1;
      this.isFilterApplied = true;
      this.loadUnApprovedCashbook(this.page, this.helperSharedService.removeEmptyTrimmedStrings(this.userFilterForm.value, true, true));
    }

    clearAdvanceFilter(){
      this.userFilterForm.reset();
      this.page = 1;
      this.isFilterApplied = false;
      this.noData = true;
      this.loadUnApprovedCashbook(this.page, {});
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    showFilterDrawer(){
        this.visibleUserFilter = true;
    }

    onPageChanged(val: any){
        console.log(val)
        if(val){
            this.page = val;
            this.loadUnApprovedCashbook(val)
        }
    }

    onClearFilter(){
        this.page = 1;
        this.userFilterForm.reset();
        this.isFilterApplied = false;
        this.loadUnApprovedCashbook(this.page, {});
    }

    next() {
      console.log('next call')
      this.onPageChanged(this.response?.next_page);
    }

    prev() {
      this.onPageChanged(this.response?.previous_page);
    }

    isLastPage(): boolean {
      return !this.response?.next_page;
    }

    isFirstPage(): boolean {
      return !this.response?.previous_page;
    }

    checkAmountInput(controlName: string) {
        const control: AbstractControl<any, any> | null = this.userFilterForm.get(controlName);
        this.helperSharedService.checkAmountInput(control);
        // let value = control?.value;
        // if (value !== null && value !== undefined) {
        //     // Convert to string
        //     value = value.toString();

        //     // Allow only digits and one decimal point
        //     const cleanedValue = value.replace(/[^0-9.]/g, '');

        //     // Handle multiple decimals: keep only the first one
        //     const parts = cleanedValue.split('.');
        //     let formattedValue = parts[0];

        //     if (parts.length > 1) {
        //       // Limit to two decimal places
        //       formattedValue += '.' + parts[1].substring(0, 2);
        //     }

        //     // Set the formatted value back to control (without triggering events)
        //     control?.setValue(formattedValue, { emitEvent: false });
        // }
    }

    exportToCSV() {
      this.loadingExport = true;

      this.commonAPIService.UnapprovedProjectExpense(1, {...this.helperSharedService.removeEmptyTrimmedStrings(this.userFilterForm.value, true, true), export: true})
      .subscribe({
        next: (res: any) => {
          const data = res?.data || [];
          const csvRows: any[] = [];
          data.forEach((row: any, index: number) => {
            const expenseBy = row.expense_expense_by || {};
            const expenseHead = row.expense_expense_head || {};
            const data: any = {
              'SN': index + 1,
              'Expense By (Name)': `${expenseBy.first_name || ''} ${expenseBy.last_name || ''}`.trim(),
              'Amount': row.expense_amount || '',
              'Vendor Name': row.vendor_name || '',
              'Bill Image URL': row.bill_image || '',
              'Expense Head': expenseHead.name || '',
              'Expense Date': row.date || '',
            };
            if(this.userRole == "SUPERADMIN"){
              const site = row.expense_office_location || {};
              data['Site'] = site.name || '';
            }
            csvRows.push(data);
          });
          this.helperSharedService.exportToCSV(csvRows, 'unapproved_reimbursements');
          this.loadingExport = false;
        },
        error: (error: any) => {
          this.loadingExport = false;
        }
      });

    }
   
}

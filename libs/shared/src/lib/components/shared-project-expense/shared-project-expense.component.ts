import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonGroupModule } from 'primeng/buttongroup';


import { CommonAPIService } from '../../services/common-api.service';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { Subscription } from 'rxjs';
import { DrawerModule } from 'primeng/drawer';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  selectUser,
} from '@auth';
import { HelperSharedService } from '../../services/helper-shared.service';
import { ImageModule } from 'primeng/image';

@Component({
  selector: 'lib-shared--project-expense',
  templateUrl: './shared-project-expense.component.html',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonGroupModule, ImageModule, FormsModule, DrawerModule, MultiSelectModule, DatePickerModule, SelectModule, ReactiveFormsModule, DialogModule, InputTextModule, ToggleSwitchModule, TagModule, ConfirmDialogModule, BreadcrumbModule, ButtonModule],
  providers: [ConfirmationService, MessageService],
  styles: ``
})
export class SharedProjectExpenseComponent implements OnInit, OnDestroy {
  data: any;
  loading = true;
  breadcrumbItems: any[] = [];

  displayEHEditModal = false;
  amtReceivedFrom: FormGroup;
  loadAdding = false;
  expenseHeads: any[] = [];

  currentYear: number= new Date().getFullYear();

  selectedMonthCashBook: number[] = [];

  currentUser$: Observable<any | null>;
  rolesArr: string[] = ['SUPERADMIN', 'ADMIN'];
  isVisibleVerified = false;
  subscriptions: Subscription[] = [];
  visibleUserFilter = false;
  isFilterApplied = false;
  userFilterForm: FormGroup;
  initialAdvSearchValues: any;
  page = 1;
  userRole: string | null = null;
  sites: any[] = [];
  enableAdvSearch = false;
  noData = false;
  today = new Date();
  paginationText: any;
  billImageFile: File | null = null;
  imageError = '';

  selectedMonths: number[] = [];
  selectedYear: number= new Date().getFullYear();
  years: {name: number}[] = []
  months: { number: number | string; month: string }[] = [];
  selectedOfficeLocations: number | null = null;
  disabledDates: Date[] = [];
  loadingExport = false;


  constructor(
    private commonAPIService: CommonAPIService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private store: Store,
    private helperSharedService: HelperSharedService
  ) {
    this.amtReceivedFrom = this.fb.group({
      date: [this.today, [Validators.required]],
      amount: ['', [Validators.required, Validators.min(1)]],
      expense_head: ['', [Validators.required]],
      description: [''],
      vendor_name: ['', [Validators.required]],
    });
    this.currentUser$ = this.store.select(selectUser);
    this.userFilterForm = this.fb.group({
      expense_date: [''],
      amount: ['', [Validators.maxLength(10)]],
      // paid_by_name: ['', [Validators.maxLength(255)]],
      expense_expense_head: [''],

      status: ['', [Validators.maxLength(255)]],
      remarks: ['', [Validators.maxLength(255)]],
      approved_by_name: ['', [Validators.maxLength(255)]],
      date_approved: [''],
    });
    this.initialAdvSearchValues = this.userFilterForm.value;
  }

  ngOnInit(): void {
    this.breadcrumbItems = [
      { label: 'Dashboard', routerLink: '/user' },
      { label: 'Report Expense' }
    ];
    this.months = this.helperSharedService.getAllMonths();
    this.selectedMonths = [this.today.getMonth() + 1];
    this.selectedYear = this.today.getFullYear();
    this.years = [{name: this.selectedYear}];
    this.generateDisabledDates();

    this.currentUser$.subscribe(user => {
      if (user) {
        this.userRole = user.role || null;

        this.isVisibleVerified = this.rolesArr.includes(this.userRole ?? '');
        if(user.role !== "USER"){
          // Add paid_by_name if it doesn't already exist
          if (!this.userFilterForm.contains('paid_by_name')) {
            this.userFilterForm.addControl(
              'paid_by_name',
              this.fb.control('', [Validators.maxLength(255)])
            );
          }

        }
        if(user.role == "SUPERADMIN"){
          // Add office_location_ids if it doesn't already exist
          if (!this.userFilterForm.contains('office_location_ids')) {
            this.userFilterForm.addControl(
              'office_location_ids',
              this.fb.control('')
            );
          }
          this.getSiteList(user.priority_site);

        } else {
          this.loadData(this.page, {});
        }
      } else {
        
        // Remove paid_by_name if it exists
        if (this.userFilterForm.contains('paid_by_name')) {
          this.userFilterForm.removeControl('paid_by_name');
        }

        // Remove office_location_ids if it exists
        if (this.userFilterForm.contains('office_location_ids')) {
          this.userFilterForm.removeControl('office_location_ids');
        }
        this.userRole = null;
        this.isVisibleVerified = false;
        this.loadData(this.page, {});
      }
    });
    const advanceSearchFormSub = this.userFilterForm.valueChanges.subscribe((currentValue: any)  => {
        this.enableAdvSearch = JSON.stringify(this.helperSharedService.replaceNullsWithEmpty(currentValue)) !== JSON.stringify(this.helperSharedService.replaceNullsWithEmpty(this.initialAdvSearchValues));
    });
    this.subscriptions.push(advanceSearchFormSub);
    
    this.loadExpenseHeads();
  }

  onMonthChange(value: number[]) {
      this.selectedMonths = value;
      this.generateDisabledDates();
      this.onClearFilter();
  }
  onYearChange(value: number) {
      this.selectedYear = value;
      this.generateDisabledDates();
      this.onClearFilter();
  }
  
  loadExpenseHeads(){
    this.commonAPIService.listExpenseHeads()
      .subscribe({
        next: (data: any) => {
          this.expenseHeads = data;
          this.loading = false;
        },
        error: (err: any) => {
          this.loading = false;
        }
    });
  }

  provideData(params={}){
    const data: any = {...params, order_by: '-date', months: this.selectedMonths.join(','), year: this.selectedYear};
    if(this.userRole === 'SUPERADMIN' && this.selectedOfficeLocations){
      data['expense_office_location'] = this.selectedOfficeLocations;
    }
    return data;
  }

  loadData(page=1, params={}){
    this.loading= true;
    this.commonAPIService.getProjectExpense(page, this.provideData(params))
      .subscribe({
        next: (data: any) => {
          this.data = data;
          this.paginationText = this.helperSharedService.getPaginationText(data);
          this.visibleUserFilter = this.noData ?? false;
          this.noData = false;
          this.loading = false;
        },
        error: (err: any) => {
          this.loading = false;
        }
    });
  }

  getSiteList(site_data: {id: number, name: string} | null){
    this.commonAPIService.listSites()
      .subscribe({
        next: (data: any) => {
          this.sites = data;
          if(site_data){
            this.selectedOfficeLocations = site_data.id;
            this.loadData();
          }
        },
        error: (err: any) => {
        }
      });
  }


  addAmtReceived(){
    this.amtReceivedFrom.reset();
    this.displayEHEditModal = true;
  }

  onSubmit() {
    if (this.amtReceivedFrom.invalid || this.imageError) {
      this.amtReceivedFrom.markAllAsTouched();
      return;
    }
    const formData = new FormData();
    formData.append('amount', this.amtReceivedFrom.get('amount')?.value);
    formData.append('date', this.amtReceivedFrom.get('date')?.value);
    formData.append('vendor_name', this.amtReceivedFrom.get('vendor_name')?.value);
    formData.append('description', this.amtReceivedFrom.get('description')?.value);
    formData.append('expense_head', this.amtReceivedFrom.get('expense_head')?.value);
    if (this.billImageFile) {
      formData.append('bill_image', this.billImageFile);
    }
    this.confirmationService.confirm({
      message: 'Are you sure you want to add this expense?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.loadAdding = true;
        const date = new Date(this.amtReceivedFrom.value.date);
        date.setDate(date.getDate() + 1);
        formData.append('date', date.toISOString());
        this.commonAPIService.addProjectExpense(formData)
          .subscribe({
            next: () => {
              this.displayEHEditModal = false;
              this.loadAdding = false;
              this.amtReceivedFrom.reset();
              this.billImageFile = null;
              this.selectedMonths = [this.today.getMonth() + 1];
              this.selectedYear = this.today.getFullYear();
              this.onClearFilter();
            },
            error: (err: any) => {
              this.loadAdding = false;
            }
        });
      },
      reject: () => {
        // Nothing needed, the UI stays the same
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

      if (!allowedTypes.includes(file.type)) {
        this.imageError = 'Only JPG, JPEG or PNG files are allowed.';
        this.billImageFile = null;
      } else {
        this.imageError = '';
        this.billImageFile = file;
      }
    }
  }

  cancelEHEditModal(){
    this.displayEHEditModal = false;
  }

  
  ngOnDestroy(): void {
      this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  showFilterDrawer(){
      this.visibleUserFilter = true;
  }

  onSubmitFilter(){
    this.page = 1;
    this.isFilterApplied = true;
    this.loadData(this.page, this.helperSharedService.removeEmptyTrimmedStrings(this.userFilterForm.value, true, true));
  }

  clearAdvanceFilter(){
    this.userFilterForm.reset();
    this.page = 1;
    this.isFilterApplied = false;
    this.noData = true;
    this.loadData(this.page, {});
  }

  onPageChanged(val: any){
    if(val){
        this.page = val;
        this.loadData(val)
    }
  }

  onClearFilter(){
    this.page = 1;
    this.userFilterForm.reset();
    this.isFilterApplied = false;
    this.loadData(this.page, {});
  }


  next() {
    this.onPageChanged(this.data?.next_page);
  }

  prev() {
    this.onPageChanged(this.data?.previous_page);
  }

  isLastPage(): boolean {
    return !this.data?.next_page;
  }

  isFirstPage(): boolean {
    return !this.data?.previous_page;
  }

  onOfficeLocationChange(value: number) {
    this.selectedOfficeLocations = value;
    this.onClearFilter();
  }

  checkAmountInput2(controlName: string) {
    const control: AbstractControl<any, any> | null = this.amtReceivedFrom.get(controlName);
    this.helperSharedService.checkAmountInput(control);
  }

  checkAmountInput(controlName: string) {
    const control: AbstractControl<any, any> | null = this.userFilterForm.get(controlName);
    this.helperSharedService.checkAmountInput(control);
  }

  generateDisabledDates() {
    this.disabledDates = [];
    this.disabledDates = this.helperSharedService.generateDisabledDates(this.selectedYear, this.selectedMonths);
  }

  exportToCSV() {
    this.loadingExport = true;

    this.commonAPIService.getProjectExpense(1, {...this.provideData(this.helperSharedService.removeEmptyTrimmedStrings(this.userFilterForm.value, true, true)), export: true})
    .subscribe({
      next: (res: any) => {
        const data = res.data || [];
        const csvRows: any[] = [];
        data.forEach((row: any, index: number) => {
          const expenseBy = row.expense_expense_by || {};
          const approvedBy = row.expense_approved_by || {};
          const expenseHead = row.expense_expense_head || {};
          const data: any = {
            'SN': index + 1,
            'Vendor Name': row.vendor_name || '',
            'Expense Head': expenseHead.name || '',
            'Description': row.description || '',
            'Amount': row.expense_amount || '',
            'Bill Image URL': row.bill_image || '',
            'Expense Date': row.date || '',

            'Approved By': `${approvedBy.first_name || ''} ${approvedBy.last_name || ''}`.trim(),
            'Status': row.status || '',
            'Remarks': row.remarks || '',
            'Date Approved': row.date_approved || '',
          };
          if(this.userRole == "SUPERADMIN"){
            data['Expense By (Name)'] = `${expenseBy.first_name || ''} ${expenseBy.last_name || ''}`.trim();
          }
          csvRows.push(data);
        });
        this.helperSharedService.exportToCSV(csvRows, 'project_expense');
        this.loadingExport = false;
      },
      error: (error: any) => {
        this.loadingExport = false;
      }
    });

  }
}

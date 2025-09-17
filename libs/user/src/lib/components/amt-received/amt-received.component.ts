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
import { MultiSelectModule } from 'primeng/multiselect';
import { DatePickerModule } from 'primeng/datepicker';
import { Subscription } from 'rxjs';
import { DrawerModule } from 'primeng/drawer';
import { SelectModule } from 'primeng/select';


import { UserService } from '../../services/user.service';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  selectUser,
} from '@auth';
import { HelperSharedService } from '@shared';
import { ButtonGroupModule } from 'primeng/buttongroup';

@Component({
  selector: 'app-user-amt-received',
  templateUrl: './amt-received.component.html',
  standalone: true,
  imports: [CommonModule, TableModule, DrawerModule, ButtonGroupModule, SelectModule, FormsModule, DatePickerModule, MultiSelectModule, ReactiveFormsModule, DialogModule, InputTextModule, ToggleSwitchModule, TagModule, ConfirmDialogModule, BreadcrumbModule, ButtonModule],
  providers: [ConfirmationService, MessageService],
  styles: ``
})
export class AmtReceivedComponent implements OnInit, OnDestroy {
  data: any ;
  loading = true;
  breadcrumbItems: any[] = [];

  displayEHEditModal = false;
  amtReceivedFrom: FormGroup;
  loadAdding = false;
  users: any[] = [];

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

  selectedMonths: number[] = [];
  selectedYear: number= new Date().getFullYear();
  years: {name: number}[] = []
  months: { number: number | string; month: string }[] = [];
  disabledDates: Date[] = [];


  constructor(
    private userService: UserService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private store: Store,
    private helperSharedService: HelperSharedService
  ) {
    this.amtReceivedFrom = this.fb.group({
      date_received: [null, [Validators.required]],
      amount: ['', [Validators.required, Validators.min(1)]],
      received_from_user: [''],
      received_from_name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(255)]],
    });
    this.currentUser$ = this.store.select(selectUser);
    this.userFilterForm = this.fb.group({
      date_received: ['', [Validators.maxLength(255)]],
      cashbook_amount: ['', [Validators.maxLength(10)]],
      received_from_name: ['', [Validators.maxLength(255)]],
    });
    this.initialAdvSearchValues = this.userFilterForm.value;
  }

  generateDisabledDates() {
    this.disabledDates = [];
    this.disabledDates = this.helperSharedService.generateDisabledDates(this.selectedYear, this.selectedMonths);
    // const start = new Date(this.selectedYear, 0, 1); // Jan 1, 2025
    // const end = new Date(this.selectedYear, 11, 31); // Dec 31, 2025

    // const currentDate = new Date(start);

    // while (currentDate <= end) {
    //   const month = currentDate.getMonth() + 1; // 1-12

    //   // If month is not in allowed list, disable the date
    //   if (!this.selectedMonths.includes(month)) {
    //     this.disabledDates.push(new Date(currentDate));
    //   }

    //   // Move to next day
    //   currentDate.setDate(currentDate.getDate() + 1);
    // }
  }


  ngOnInit(): void {
    this.breadcrumbItems = [
      { label: 'Dashboard', routerLink: '/user' },
      { label: 'Amount Received' }
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
        if(user.role == "SUPERADMIN"){
          // Add received_from_name if it doesn't already exist
          if (!this.userFilterForm.contains('received_from_name')) {
            this.userFilterForm.addControl(
              'received_from_name',
              this.fb.control('', [Validators.maxLength(255)])
            );
          }

          // Add office_location_ids if it doesn't already exist
          if (!this.userFilterForm.contains('office_location_ids')) {
            this.userFilterForm.addControl(
              'office_location_ids',
              this.fb.control('')
            );
          }
          this.getSiteList();
        }
      } else {
        
        // Remove received_from_name if it exists
        if (this.userFilterForm.contains('received_from_name')) {
          this.userFilterForm.removeControl('received_from_name');
        }

        // Remove office_location_ids if it exists
        if (this.userFilterForm.contains('office_location_ids')) {
          this.userFilterForm.removeControl('office_location_ids');
        }
        this.userRole = null;
        this.isVisibleVerified = false;
      }
    });
    const advanceSearchFormSub = this.userFilterForm.valueChanges.subscribe((currentValue: any)  => {
        this.enableAdvSearch = JSON.stringify(this.helperSharedService.replaceNullsWithEmpty(currentValue)) !== JSON.stringify(this.helperSharedService.replaceNullsWithEmpty(this.initialAdvSearchValues));
    });
    this.subscriptions.push(advanceSearchFormSub);
    this.loadData(this.page, {});
    // this.loadUsers();
  }

  onMonthChange(value: number[]) {
      this.selectedMonths = value;
      this.generateDisabledDates();
      this.loadData();
  }
  onYearChange(value: number) {
      this.selectedYear = value;
      this.generateDisabledDates();
      this.loadData();
  }
  
  getSiteList(){
      this.userService.listSites()
        .subscribe({
          next: (data) => {
            this.sites = data;
          },
          error: (err) => {
            console.error('Error fetching dashboard data:', err);
          }
        });
    }

  loadData(page=1, params={}){
    this.loading= true;
    this.userService.getReveivingAmt(page, {...params, order_by: '-date_received', months: this.selectedMonths.join(','), year: this.selectedYear})
      .subscribe({
        next: (data) => {
          this.data = data;
          this.paginationText = this.helperSharedService.getPaginationText(data);
          this.visibleUserFilter = this.noData ?? false;
          this.noData = false;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching data:', err);
          this.loading = false;
        }
    });
  }


  addAmtReceived(){
    this.amtReceivedFrom.reset();
    this.displayEHEditModal = true;
  }

  onSubmit() {
    if (this.amtReceivedFrom.invalid) {
      this.amtReceivedFrom.markAllAsTouched();
      return;
    }
    this.confirmationService.confirm({
      message: 'Are you sure you want to change this status?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.loadAdding = true;
        const date = new Date(this.amtReceivedFrom.value.date_received);
        date.setDate(date.getDate() + 1);
        const data = {
          amount: Number(this.amtReceivedFrom.value.amount),
          date_received: date,
          received_from: this.amtReceivedFrom.value.received_from_user ?? this.amtReceivedFrom.value.received_from_name.trim(),
        }; 
        this.userService.addReceivingAmt(data)
          .subscribe({
            next: () => {
              this.displayEHEditModal = false;
              this.loadAdding = false;
              this.selectedMonths = [this.today.getMonth() + 1];
              this.selectedYear = this.today.getFullYear();
              this.onClearFilter();
            },
            error: (err: any) => {
              console.error('Error in expense head:', err);
              this.loadAdding = false;
            }
        });
      },
      reject: () => {
        // Nothing needed, the UI stays the same
      }
    });
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
    console.log(val)
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
    console.log('next call')
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

  checkAmountInput2(controlName: string) {
    const control: AbstractControl<any, any> | null = this.amtReceivedFrom.get(controlName);
    this.helperSharedService.checkAmountInput(control);
  }

  checkAmountInput(controlName: string) {
    const control: AbstractControl<any, any> | null = this.userFilterForm.get(controlName);
    this.helperSharedService.checkAmountInput(control);
  }
}

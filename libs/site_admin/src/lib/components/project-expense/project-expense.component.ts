import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';


import { SiteAdminService } from '../../services/site-admin.service';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-user-project-expense',
  templateUrl: './project-expense.component.html',
  standalone: true,
  imports: [CommonModule, TableModule, FormsModule, DatePickerModule, SelectModule, ReactiveFormsModule, DialogModule, InputTextModule, ToggleSwitchModule, TagModule, ConfirmDialogModule, BreadcrumbModule, ButtonModule],
  providers: [ConfirmationService, MessageService],
  styles: ``
})
export class ProjectExpenseComponent implements OnInit {
  data: any[] = [];
  loading = true;
  breadcrumbItems: any[] = [];

  displayEHEditModal = false;
  amtReceivedFrom: FormGroup;
  loadAdding = false;
  expenseHeads: any[] = [];


  constructor(
    private siteAdminService: SiteAdminService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder
  ) {
    this.amtReceivedFrom = this.fb.group({
      date: [null, [Validators.required]],
      amount: ['', [Validators.required, Validators.min(1)]],
      expense_head: ['', [Validators.required]],
      description: [''],
      vendor_name: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.breadcrumbItems = [
      { label: 'Dashboard', routerLink: '/site-admin' },
      { label: 'Report Expense' }
    ];
    this.loadData();
    this.loadExpenseHeads();
  }
  
  loadExpenseHeads(){
    this.siteAdminService.listExpenseHeads()
      .subscribe({
        next: (data) => {
          this.expenseHeads = data;
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
        }
    });
  }

  loadData(){
    this.loading= true;
    this.siteAdminService.getProjectExpense()
      .subscribe({
        next: (data) => {
          this.data = data;
          this.loading = false;
        },
        error: (err) => {
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
      message: 'Are you sure you want to add this expense?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.loadAdding = true;
        this.siteAdminService.addProjectExpense(this.amtReceivedFrom.value)
          .subscribe({
            next: () => {
              this.displayEHEditModal = false;
              this.loadAdding = false;
              this.loadData();
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

  cancelEHEditModal(){
    this.displayEHEditModal = false;
  }
}

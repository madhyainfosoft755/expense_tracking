import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TagModule } from 'primeng/tag';
import { MultiSelectModule } from 'primeng/multiselect';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';


import { ClientSuperAdminService } from '../../services/client-superadmin.service';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';

interface OfficeLocation{
  id:number;
  name: string;
}
interface ExpenseHead {
  id: number;
  name: string;
  created_by: {
    username: string;
    email: string;
  };
  icon: string;
  is_active: boolean; 
  timestamp: string;
  office_locations_data: OfficeLocation[];
}

@Component({
  selector: 'app-client-superadmin-eh-list',
  templateUrl: './expense-heads.component.html',
  standalone: true,
  imports: [CommonModule, TableModule, MessageModule, IconFieldModule, InputIconModule, FormsModule, MultiSelectModule, ReactiveFormsModule, DialogModule, InputTextModule, ToggleSwitchModule, TagModule, ConfirmDialogModule, BreadcrumbModule, ButtonModule],
  providers: [ConfirmationService, MessageService],
  styles: ``
})
export class ExpenseHeadsComponent implements OnInit {
  expenseHeads: ExpenseHead[] = [];
  loading = true;
  breadcrumbItems: any[] = [];

  displayEHEditModal = false;
  expenseHeadForm: FormGroup;
  loadingEHEdit = false;
  selectedExpenseHead: ExpenseHead | null = null;
  serverUrl: string;
  sites: OfficeLocation[] = [];
  apiErrorMessage : string | null = '';
  messages = signal<any[]>([]);

  addMessages(message: { severity: string, content: string, life: number }) {
      this.messages.set([message]);
      // this.messages.set([ ...this.messages(), message]);
  }


  constructor(
    private clientSuperAdminService: ClientSuperAdminService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder
  ) {
    this.serverUrl = 'http://127.0.0.1:8000/api/'.slice(0, -5);
    this.expenseHeadForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(255)]],
      office_locations: ['', [Validators.required]],
      is_active: [false]
    });
  }

  ngOnInit(): void {
    this.breadcrumbItems = [
      { label: 'Dashboard', routerLink: '/superadmin' },
      { label: 'Expense Head List' }
    ];
    this.loadExpenseHeads();
    this.getAllSites();
  }
  
  loadExpenseHeads(){
    this.clientSuperAdminService.listExpenseHeads()
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

  getAllSites(){
    this.clientSuperAdminService.listSites()
      .subscribe({
        next: (data) => {
          this.sites = data;
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
        }
    });
  }


  addNewExpenseHead(){
    this.selectedExpenseHead = null;
    this.expenseHeadForm.reset();
    this.expenseHeadForm.patchValue({
      office_locations: this.sites.map(val=>val.id)
    });
    this.displayEHEditModal = true;
  }

  showEHEditModal(expenseHead: ExpenseHead){
    this.selectedExpenseHead= expenseHead;
    this.expenseHeadForm.patchValue({
      name: expenseHead.name,
      office_locations: expenseHead.office_locations_data.map(val=>val.id),
      is_active: expenseHead.is_active,
    });
    this.displayEHEditModal = true;
  }


  onSubmit() {
    if (this.expenseHeadForm.invalid) {
      this.expenseHeadForm.markAllAsTouched();
      return;
    }
    const msgCnf = this.selectedExpenseHead ? 
      'Are you sure you want to update this expense head?' : 
      'Are you sure you want to add this expense head?';
    this.confirmationService.confirm({
      message: msgCnf,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.loadingEHEdit = true;
        this.apiErrorMessage = '';
        const expenseHeadSub = this.selectedExpenseHead ? 
        this.clientSuperAdminService.updateExpenseHeads(this.selectedExpenseHead?.id.toString() ?? '0', this.expenseHeadForm.value) : 
        this.clientSuperAdminService.createExpenseHeads({name: this.expenseHeadForm.value.name, office_locations: this.expenseHeadForm.value.office_locations});
        expenseHeadSub
          .subscribe({
            next: (response: any) => {
              this.displayEHEditModal = false;
              const msg = this.selectedExpenseHead ? 'Expense head updated successfully.' : 'Expense head added successfully.';
              this.selectedExpenseHead = null;
              this.loadingEHEdit = false;
              this.addMessages({ severity: 'success', content: response?.message ?? msg, life: 30000 });
              this.loadExpenseHeads();
            },
            error: (err: any) => {
              this.apiErrorMessage = err?.error?.name ?? (this.selectedExpenseHead ? "Unable to update expense head." : "Unable to add expense head.");
              this.loadingEHEdit = false;
              const msg = this.selectedExpenseHead ? 'Unable to update ecpense head.' : 'Unable to add expense head.';
              this.addMessages({ severity: 'error', content: err?.error?.error ?? msg, life: 30000 });
            }
        });
      },
      reject: () => {
        // Nothing needed, the UI stays the same
      }
    });
  }

  cancelEHEditModal(){
    this.selectedExpenseHead = null;
    this.displayEHEditModal = false;
  }
}

import { Component, OnInit } from '@angular/core';
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
  imports: [CommonModule, TableModule, IconFieldModule, InputIconModule, FormsModule, MultiSelectModule, ReactiveFormsModule, DialogModule, InputTextModule, ToggleSwitchModule, TagModule, ConfirmDialogModule, BreadcrumbModule, ButtonModule],
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
          console.error('Error fetching expense head list:', err);
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
          console.error('Error fetching site list:', err);
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
    this.confirmationService.confirm({
      message: 'Are you sure you want to change this status?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.loadingEHEdit = true;
        const expenseHeadSub = this.selectedExpenseHead ? 
        this.clientSuperAdminService.updateExpenseHeads(this.selectedExpenseHead?.id.toString() ?? '0', this.expenseHeadForm.value) : 
        this.clientSuperAdminService.createExpenseHeads({name: this.expenseHeadForm.value.name, office_locations: this.expenseHeadForm.value.office_locations});
        expenseHeadSub
          .subscribe({
            next: () => {
              this.selectedExpenseHead = null;
              this.displayEHEditModal = false;
              this.loadingEHEdit = false;
              this.loadExpenseHeads();
            },
            error: (err: any) => {
              console.error('Error in expense head:', err);
              this.loadingEHEdit = false;
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

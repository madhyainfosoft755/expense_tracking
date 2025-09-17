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


import { SiteAdminService } from '../../services/site-admin.service';
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
  selector: 'app-client-siteadmin-eh-list',
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
    private siteAdminService: SiteAdminService,
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
      { label: 'Dashboard', routerLink: '/site-admin' },
      { label: 'Expense Head List' }
    ];
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
          console.error('Error fetching expense head list:', err);
          this.loading = false;
        }
    });
  }
}

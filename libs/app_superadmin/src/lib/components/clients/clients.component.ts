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
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';


import { AppSuperAdminService } from '../../services/app-superadmin.service';

interface Client {
  id: number;
  client_name: string;
  company_name: string;
  icon: string;
  is_active: boolean; 
  timestamp: string;
}

@Component({
  selector: 'app-superuser-client-table',
  templateUrl: './clients.component.html',
  standalone: true,
  imports: [CommonModule, TableModule, FormsModule, ReactiveFormsModule, DialogModule, InputTextModule, ToggleSwitchModule, TagModule, ConfirmDialogModule, BreadcrumbModule, ButtonModule],
  providers: [ConfirmationService, MessageService],
  styles: `
    .client-logo{
      max-height: 100px;
      max-width: 200px;
    }
  `
})
export class ClientComponent implements OnInit {
  clients: Client[] = [];
  loading = true;
  breadcrumbItems: any[] = [];

  displayClientEditModal = false;
  clientForm: FormGroup;
  uploadedIcon: File | null = null;
  iconError = '';
  loadingClientEdit = false;
  selectedClient: Client | null = null;
  serverUrl: string;
  previewUrl: string | ArrayBuffer | null = null;


  constructor(
    private appSuperAdminService: AppSuperAdminService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder
  ) {
    this.serverUrl = 'http://127.0.0.1:8000/api/'.slice(0, -5);
    this.clientForm = this.fb.group({
      client_name: ['', [Validators.required, Validators.maxLength(255)]],
      company_name: ['', [Validators.required, Validators.maxLength(255)]],
      is_active: [false]
    });
  }

  ngOnInit(): void {
    this.breadcrumbItems = [
      { label: 'Dashboard', routerLink: '/app-superadmin' },
      { label: 'Client List' }
    ];
    this.loadClients();
  }
  
  loadClients(){
    this.appSuperAdminService.getClientList()
      .subscribe({
        next: (data) => {
          this.clients = data.map((val: Client)=>{
            return {...val, icon: this.serverUrl+val.icon}
          });
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching clients:', err);
          this.loading = false;
        }
    });
  }


  addNewClient(){
    this.router.navigate(['/app-superadmin/add-client'])
  }

  getClientDetails(client: Client){
    this.router.navigate([`/app-superadmin/client-details/${client.id}`])
  }

  showClientEditModal(client: Client){
    this.selectedClient= client;
    this.previewUrl = client.icon;
    this.clientForm.patchValue({
      client_name: client.client_name,
      company_name: client.company_name,
      is_active: client.is_active,
    });
    this.displayClientEditModal = true;
  }


  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
  
    // Reset
    this.uploadedIcon = null;
    this.iconError = '';
  
    if (!input.files || input.files.length === 0) {
      this.iconError = 'No file selected.';
      return;
    }
  
    if (input.files.length > 1) {
      this.iconError = 'Only one file is allowed.';
      input.value = ''; // Reset the input
      return;
    }
  
    const file = input.files[0];
  
    if (!file.type.startsWith('image/')) {
      this.iconError = 'Only image files are allowed.';
      input.value = ''; // Reset the input
      return;
    }
  
    // All validations passed
    this.uploadedIcon = file;

    const reader = new FileReader();
    reader.onload = () => this.previewUrl = reader.result;
    reader.readAsDataURL(file);
  }

  onSubmit() {
    if (this.clientForm.invalid) {
      this.clientForm.markAllAsTouched();
      return;
    }
    if(!this.selectedClient){
      return;
    }
    console.log(this.clientForm.value)
    const formData = new FormData();
    // formData.set('client_name', 's')
    formData.append('client_name', this.clientForm.controls['client_name'].value);
    formData.append('client_name', this.clientForm.value.client_name);
    formData.append('company_name', this.clientForm.value.company_name);
    formData.append('is_active', this.clientForm.value.is_active);
    if(this.uploadedIcon){
      formData.append('icon', this.uploadedIcon as Blob);
    }
    console.log(formData);
    // return;
    this.confirmationService.confirm({
      message: 'Are you sure you want to change this status?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.loadingClientEdit = true;
        this.appSuperAdminService.updateClient(this.selectedClient?.id.toString() ?? '0', formData)
          .subscribe({
            next: () => {
              this.selectedClient = null;
              this.displayClientEditModal = false;
              this.uploadedIcon = null;
              this.loadingClientEdit = false;
              this.loadClients();
            },
            error: (err) => {
              console.error('Error fetching clients:', err);
              this.loadingClientEdit = false;
            }
        });
      },
      reject: () => {
        // Nothing needed, the UI stays the same
      }
    });
  }

  cancelClientEditModal(){
    this.selectedClient = null;
    this.displayClientEditModal = false;
    this.uploadedIcon = null;
  }
}

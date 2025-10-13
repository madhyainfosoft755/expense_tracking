import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BreadcrumbModule } from 'primeng/breadcrumb';
import { AppSuperAdminService } from '../../../services/app-superadmin.service';
import { InputTextModule } from 'primeng/inputtext';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { FieldsetModule } from 'primeng/fieldset';
import { HelperSharedService } from '@shared';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  standalone: true,
  imports: [CommonModule, BreadcrumbModule, FieldsetModule, PasswordModule, ReactiveFormsModule, ButtonModule, InputTextModule]
})
export class AddClientComponent implements OnInit {
  users: any[] = [];
  loading = true;
  breadcrumbItems: any[] = [];
  clientForm;
  iconError = '';
  uploadedIcon: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;

  constructor(
    private appSuperAdminService: AppSuperAdminService, 
    private fb: FormBuilder,
    private router: Router,
    private helperSharedService: HelperSharedService) {
    this.clientForm = this.fb.group({
        username:     ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
        first_name:   ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
        last_name:    ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
        email:        ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
        mobile_number:['', [Validators.required, Validators.maxLength(10), Validators.pattern('^[0-9]{10}$')]],
        employee_id:  [''],
        client_name: ['', [Validators.required, Validators.maxLength(255)]],
        company_name: ['', [Validators.required, Validators.maxLength(255)]],
        password: ['', [Validators.required, Validators.maxLength(60), Validators.minLength(6)]],
        confirm_password: ['', [Validators.required]],
    });

    this.clientForm.setValidators(this.passwordsMatchValidator);
    this.clientForm.updateValueAndValidity();
  }

  checkPhone(controlName: string) {
    const control: AbstractControl<any, any> | null = this.clientForm.get(controlName);
    this.helperSharedService.checkPhone(control);
  }

   /** simple form-level validator to ensure password === confirm_password */
    private passwordsMatchValidator: ValidatorFn = (group: AbstractControl) => {
      const p  = group.get('password')?.value;
      const cp = group.get('confirm_password')?.value;
      return p && cp && p !== cp ? { passwordMismatch: true } : null;
    };
  

  ngOnInit(): void {
    this.breadcrumbItems = [
      { label: 'Dashboard', routerLink: '/app-superadmin' },
      { label: 'Client List', routerLink: '/app-superadmin/clients' },
      { label: 'Add Client'}
    ];
    this.appSuperAdminService.getClientList()
      .subscribe({
        next: (data) => {
          this.users = data;
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
        }
      });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
  
    // Reset
    this.uploadedIcon = null;
    this.iconError = '';
  
    if (!input.files || input.files.length === 0) {
      // this.iconError = 'No file selected.';
      this.previewUrl = null;
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

  onSubmit(){
    if (this.clientForm.invalid) {
      this.clientForm.markAllAsTouched();
      return;
    }
    this.iconError = '';
    const formData = new FormData();
    formData.append('username', this.clientForm.get('username')?.value ?? '');
    formData.append('first_name', this.clientForm.get('first_name')?.value ?? '');
    formData.append('last_name', this.clientForm.get('last_name')?.value ?? '');
    formData.append('email', this.clientForm.get('email')?.value ?? '');
    formData.append('mobile_number', this.clientForm.get('mobile_number')?.value ?? '');
    formData.append('employee_id', this.clientForm.get('employee_id')?.value ?? '');
    formData.append('client_name', this.clientForm.get('client_name')?.value ?? '');
    formData.append('company_name', this.clientForm.get('company_name')?.value ?? '');
    formData.append('password', this.clientForm.get('password')?.value ?? '');
    formData.append('confirm_password', this.clientForm.get('confirm_password')?.value ?? '');
    if(this.uploadedIcon){
      formData.append('icon', this.uploadedIcon as Blob);
    }

    this.loading =  true;
    this.appSuperAdminService.addClient(formData).subscribe({
      next: (data) => {
        this.loading = false;
        alert('Client added successfully');
        this.clientForm.reset();
        this.router.navigate(['/app-superadmin/clients']);
      },error: (err) => {
        this.loading = false;
        alert('Error adding client');
      }
    });
  }
}

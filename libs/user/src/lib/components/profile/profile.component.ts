import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { FieldsetModule } from 'primeng/fieldset';
import { SelectModule } from 'primeng/select';
import { MessageModule } from 'primeng/message';

import { UserService } from '../../services/user.service';
import { InputTextModule } from 'primeng/inputtext';
import { HelperSharedService } from '@shared';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: ``,
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, InputTextModule, MessageModule, SelectModule, BreadcrumbModule, ButtonModule, ProgressSpinnerModule, FieldsetModule]
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  submitted = false;
  loading = false;
  loadingProfile = false;
  breadcrumbItems: any[] = [];
  messages = signal<any[]>([]);
  user: any;

  // Dropdown Options
  salutationOptions = [
    { label: 'Mr.', value: 'Mr.' },
    { label: 'Mrs.', value: 'Mrs.' },
    { label: 'Ms.', value: 'Ms.' },
    { label: 'Dr.', value: 'Dr.' },
    { label: 'Prof.', value: 'Prof.' }
  ];

  constructor(
    private fb: FormBuilder, 
    private userService: UserService,
    private helperSharedService: HelperSharedService) {
    this.profileForm = this.fb.group(
      {
        // salutation: ['Mr.', Validators.required],
        first_name: ['', [Validators.required, Validators.maxLength(255)]],
        last_name: ['', [Validators.required, Validators.maxLength(255)]],
        email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
        username: ['', [Validators.required, Validators.maxLength(255)]],
        // employee_id: ['', [Validators.maxLength(25)]],
        mobile_number: ['', [Validators.required, Validators.maxLength(10), Validators.pattern('^[0-9]{10}$')]],
      }
    );
  }

  addMessages(message: { severity: string, content: string, life: number }) {
      this.messages.set([message]);
      // this.messages.set([ ...this.messages(), message]);
  }

  ngOnInit(): void {
    this.breadcrumbItems = [
      { label: 'Dashboard', routerLink: '/' },
      { label: 'Profile' }
    ];
    this.load_profile();
  }

  load_profile(){
    this.loadingProfile = true;

    this.userService.getUserProfile().subscribe({
      next: (res)=>{
        this.user = res;
        this.profileForm.patchValue({
          // salutation: res.data.salutation,
          first_name: res.first_name,
          last_name: res.last_name,
          email: res.email,
          username: res.username,
          mobile_number: res.mobile_number,
          // employee_id: res.employee_id,
        });
        this.loadingProfile = false;
      }, 
      error: (err)=>{
        this.loadingProfile = false;
        console.log(err);
      }
    });
  }

  checkPhone(controlName: string) {
      const control: AbstractControl<any, any> | null = this.profileForm.get(controlName);
      this.helperSharedService.checkPhone(control);
  }

  // Submit Form
  onSubmit(): void {
    this.submitted = true;

    if (this.profileForm.invalid) {
      return;
    }

    this.loading = true;

    this.userService.updateUserProfile(this.profileForm.value).subscribe({
      next: (res)=>{
        this.loading = false;
        this.addMessages({ severity: 'success', content: 'Profile updated successfully.', life: 30000 });
      }, 
      error: (err)=>{
        this.loading = false;
        console.log(err);
        this.addMessages({ severity: 'error', content: err?.error?.error, life: 30000 });
      }
    });
  }
}
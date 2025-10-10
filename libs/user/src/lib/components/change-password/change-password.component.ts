import { Component, OnInit, signal } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { FieldsetModule } from 'primeng/fieldset';
import { MessageModule } from 'primeng/message';


import { UserService } from '../../services/user.service';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styles: ``,
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MessageModule, PasswordModule, BreadcrumbModule, ButtonModule, FieldsetModule]
})
export class ChangePasswordComponent implements OnInit{
  changePasswordForm: FormGroup;
  loading = false;
  breadcrumbItems: any[] = [];
  messages = signal<any[]>([]);

  constructor(
      private fb: FormBuilder, 
      private userService: UserService,
  ) {
    this.changePasswordForm = this.fb.group({
      current_password: ['', Validators.required],
      new_password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', Validators.required]
      },
      { validator: this.passwordMatchValidator });

   }

  addMessages(message: { severity: string, content: string, life: number }) {
      this.messages.set([message]);
      // this.messages.set([ ...this.messages(), message]);
  }

  ngOnInit(): void {
    this.breadcrumbItems = [
      { label: 'Dashboard', routerLink: '/' },
      { label: 'Change Password' }
    ];
      

  }

  // Custom validator for matching passwords
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('new_password')?.value;
    const confirmPassword = form.get('confirm_password')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  // convenience getter for easy access to form fields
  get f() { return this.changePasswordForm.controls; }

  onSubmit() {
      
      // stop here if form is invalid
      if (this.changePasswordForm.invalid) {
          return;
      }
      this.loading = true;
      this.userService.changePassword(this.changePasswordForm.value)
          .subscribe(
              {
                  next: (data: any) => {
                    
                      this.loading = false;
                      this.changePasswordForm.reset();
                      this.addMessages({ severity: 'success', content: 'Password changed successfully.', life: 30000 });
                      
                      localStorage.removeItem('ER_rememberedCredentials');
                  },
                  error: (error: any) => {
                      this.loading = false;
                      // this.serverErr = error.error;
                      console.log(error)
                      this.addMessages({ severity: 'error', content: error?.error?.error, life: 30000 });
                  }
              }
              );
  }
}



import { CommonModule } from '@angular/common';
import { Component, signal  } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AuthService } from '../../services/auth/auth.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'lib-app-forgot-password',
  template: `
    <!-- <app-floating-configurator /> -->
        <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
            <div class="flex flex-col items-center justify-center">
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                        <div class="text-center mb-8">
                            <img src="et-logo.png" alt="Expense Tracking" height="100" width="100" class="mb-4 m-auto" />
                            <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Forgot Password</div>
                        </div>
                        <div class="flex flex-col">
                            @for (message of messages(); track message; let first = $first) {
                                <p-message [life]="message.life" closable [severity]="message.severity" [text]="message.content" styleClass="mb-2 mt-2" />
                            }
                        </div>
                        <form [formGroup]="forgotPasswordForm" (ngSubmit)="onSubmit()">
                            <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                            <input formControlName="email" pInputText id="email1" type="text" placeholder="Email address" class="w-full md:w-[30rem] mb-4"  />

                            <div class="flex items-center justify-between mt-2 mb-8 gap-8">
                                <a [routerLink]="['/login']" class="font-medium no-underline ml-2 text-right cursor-pointer" style="color: var(--primary-color)">Login</a>
                            </div>
                            <p-button [loading]="loading" type="submit" label="Submit" styleClass="w-full"></p-button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
  `,
  styles:  ``,
  standalone: true,
  imports: [ButtonModule, RouterModule, ReactiveFormsModule, MessageModule, CommonModule, InputTextModule]
})
export class ForgotPasswordComponent {
    email = '';

    forgotPasswordForm;
    loading = false;
    submitted = false;
    messages = signal<any[]>([]);

    constructor(
        private fb: FormBuilder, 
        private authService: AuthService,
    ) { 
        this.forgotPasswordForm = this.fb.group({
            email: ['', Validators.required]
            });
    }

    // convenience getter for easy access to form fields
    get f() { return this.forgotPasswordForm.controls; }

    addMessages(message: { severity: string, content: string, life: number }) {
        this.messages.set([message]);
        // this.messages.set([ ...this.messages(), message]);
    }

    clearMessages() {
        this.messages.set([]);
    }

    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.forgotPasswordForm.invalid) {
            return;
        }
        this.loading = true;
          this.authService.forgotPassword(this.forgotPasswordForm.value)
              .subscribe(
                  {
                      next: (data: any) => {
                        this.submitted = false;
                        this.loading = false;
                        this.forgotPasswordForm.reset();
                        this.addMessages({severity: 'success', life: 30000, content:'Reset password link sent to your email.'});
                      },
                      error: (error: any) => {
                        this.submitted = false;
                        this.loading = false;
                        // this.serverErr = error.error;
                        console.log(error)
                        this.addMessages({severity: 'error', life: 30000, content: error?.error?.error || 'An error occurred while processing your request.'});
                      }
                  }
                  );
    }
}

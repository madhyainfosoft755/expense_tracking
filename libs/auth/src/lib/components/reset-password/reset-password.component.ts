import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule  } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription, interval } from 'rxjs';

import { AuthService } from '../../services/auth/auth.service';

import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'lib-app-reset-password',
  template: `
    <!-- <app-floating-configurator /> -->
    <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
            <div class="flex flex-col items-center justify-center">
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                        <div class="text-center mb-8">
                            <img src="et-logo.png" alt="Expense Tracking" height="100" width="100" class="mb-4 m-auto" />
                            <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Reset Your Password</div>
                        </div>

                        <form *ngIf="validToken; else checkingToken" [formGroup]="resetPasswordForm" (ngSubmit)="onSubmit()">
                            <label for="password2" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">New Password</label>
                            <p-password formControlName="new_password" id="password2" placeholder="Password" [toggleMask]="true" styleClass="w-full md:w-[30rem] mb-4" [fluid]="true" [feedback]="false"></p-password>

                            <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Confirm Password</label>
                            <p-password formControlName="confirm_password" id="password1" placeholder="Password" [toggleMask]="true" styleClass="mb-4" [fluid]="true" [feedback]="false"></p-password>

                            <div class="flex items-center justify-between mt-2 mb-8 gap-8">
                                <a [routerLink]="['/forgot-password']" class="font-medium no-underline ml-2 text-right cursor-pointer" style="color: var(--primary-color)">Forgot password?</a>
                            </div>
                            <p-button type="submit" label="Reset" styleClass="w-full"></p-button>
                        </form>

                        <ng-template #checkingToken>
                            <div>
                                <div *ngIf="checkTokenLoading; else errorMessage" class="text-center">
                                    <p-progressSpinner 
                                        styleClass="w-4rem h-4rem"  />
                                </div>
                                <ng-template #errorMessage>
                                    @for (message of messages(); track message; let first = $first) {
                                        <p-message [life]="message.life" closable [severity]="message.severity" [text]="message.content" styleClass="mb-2 mt-2" />
                                    }
                                    <div class="w-full flex justify-around">
                                        <p-button [routerLink]="['/login']" label="Login" ></p-button>
                                        <p-button [routerLink]="['/forgot-password']" label="Forgot Password" ></p-button>
                                    </div>
                                </ng-template>
                            </div>
                        </ng-template>
                    </div>
                </div>
            </div>
        </div>

    
    `,
    standalone: true,
    imports: [ButtonModule, MessageModule, ProgressSpinnerModule, RouterModule, ReactiveFormsModule, CommonModule, PasswordModule, InputTextModule],
    styles: ``
})
export class ResetPasswordComponent implements OnInit, OnDestroy {

    password!: string;
    resetPasswordForm;
    loading = false;
    submitted = false;
    validToken = false;
    checkTokenLoading = true;
    token: string | null = null;
    tokenCheckInterval$: Subscription | null = null;
    messages = signal<any[]>([]);

    constructor(
        //   public layoutService: LayoutService,
        private fb: FormBuilder, 
        private router: Router,
        private authService: AuthService,
        private route: ActivatedRoute
    ) { 

        this.resetPasswordForm = this.fb.group({
            new_password: ['', [Validators.required, Validators.minLength(6)]],
            confirm_password: ['', Validators.required]
            },
            { validator: this.passwordMatchValidator });
    }

    ngOnInit(): void {
        //   this.authService.currentUser.subscribe({
        //       next: (user) => {
        //         if (user){
        //           this.router.navigate(['/']);
        //         }
        //       }
        //   });
        // Access the token from the route parameters
        this.token = this.route.snapshot.paramMap.get('token');
        console.log('Token:', this.token);

        // Optionally, handle scenarios where the token is missing
        if (!this.token) {
            console.error('Token is missing in the URL');
            //    this.messages = [
            //     { severity: 'error', detail: 'Token not found!' }
            //   ]
            this.checkTokenLoading = false;
        } else{
            this.startTokenValidation(this.token);
            this.check_token(this.token);
        }
        

    }

    addMessages(message: { severity: string, content: string, life: number }) {
        this.messages.set([message]);
        // this.messages.set([ ...this.messages(), message]);
    }

  ngOnDestroy(): void {
      // Clean up the interval on component destruction
      if (this.tokenCheckInterval$) {
          this.tokenCheckInterval$.unsubscribe();
      }
  }

  startTokenValidation(token: string): void {
      // Call the check_token method every 2 minutes
      this.tokenCheckInterval$ = interval(2 * 60 * 1000).subscribe(() => {
          this.check_token(token);
      });
  }

  check_token(token:string){
    this.authService.checkResetToken(token)
          .subscribe(
              {
                  next: (data: any) => {
                      this.checkTokenLoading = false;
                      this.validToken = true;
                  },
                  error: (error: any) => {
                      this.validToken = false;
                      this.checkTokenLoading = false;
                      // this.serverErr = error.error;
                      console.log(error)
                    //   this.messages = [
                    //       { severity: 'error', detail: error?.error?.message }
                    //   ]
                  }
              }
              );
  }


  // Custom validator for matching passwords
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('new_password')?.value;
    const confirmPassword = form.get('confirm_password')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  // convenience getter for easy access to form fields
  get f() { return this.resetPasswordForm.controls; }

  onSubmit() {
      this.submitted = true;
      // stop here if form is invalid
      if (this.resetPasswordForm.invalid) {
          return;
      }
      this.loading = true;
      this.authService.resetPassword({password: this.resetPasswordForm.value.new_password, token : this.token})
          .subscribe(
              {
                  next: (data: any) => {
                    this.submitted = false;
                    this.loading = false;
                    this.resetPasswordForm.reset();
                    this.addMessages({ severity: 'success', content: 'Password reset successfully.', life: 30000 });
                    this.router.navigate(['/login']);
                  },
                  error: (error: any) => {
                    this.submitted = false;
                    this.loading = false;
                    // this.serverErr = error.error;
                    console.log(error)
                    this.addMessages({ severity: 'error', content: error?.error?.error, life: 30000 });
                  }
              }
              );
  }
}


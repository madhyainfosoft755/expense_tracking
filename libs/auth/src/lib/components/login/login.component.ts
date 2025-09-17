import { Component, OnInit, signal } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { Store } from '@ngrx/store';
import { userLogin } from '../../+state/auth.actions';
import { selectAuthError, selectLoading } from '../../+state/auth.selectors';
import { Observable } from 'rxjs';
import { MessageModule } from 'primeng/message';

@Component({
    selector: 'lib-app-login',
    standalone: true,
    imports: [ReactiveFormsModule, MessageModule, CommonModule, ButtonModule, AsyncPipe, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule ],
    template: `
        <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
            <div class="flex flex-col items-center justify-center">
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                        <div class="text-center mb-8">
                            <img src="et-logo.png" alt="Expense Tracking" height="100" width="100" class="mb-4 m-auto" />
                            <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Welcome to Smart Expense Reporting</div>
                            <span class="text-muted-color font-medium">Sign in to continue</span>
                        </div>
                        @for (message of messages(); track message; let first = $first) {
                            <p-message [life]="message.life" closable [severity]="message.severity" [text]="message.content" styleClass="mb-2 mt-2" />
                        }
                        <form [formGroup]="loginForm" (ngSubmit)="loginSubmit()">
                            <span *ngIf="message" class="text-red-500 mb-2"> {{ message?.content }}</span>
                            <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Username or Email</label>
                            <input pInputText formControlName="username_or_email" id="email1" type="text" placeholder="Username or Email" class="w-full mb-8" />

                            <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Password</label>
                            <p-password formControlName="password" id="password1" placeholder="Password" [toggleMask]="true" styleClass="mb-4" [fluid]="true" [feedback]="false"></p-password>

                            <div class="flex items-center justify-between mt-2 mb-8 gap-8">
                                <div class="flex items-center">
                                    <!-- <p-checkbox formControlName="rememberMe" id="rememberme1" binary class="mr-2"></p-checkbox>
                                    <label for="rememberme1">Remember me</label> -->
                                </div>
                                <a [routerLink]="['/forgot-password']" class="font-medium no-underline ml-2 text-right cursor-pointer" style="color: var(--primary-color)">Forgot password?</a>
                            </div>
                            <p-button type="submit" [disabled]="loading$ | async" [loading]="loading$ | async" label="Sign In" styleClass="w-full"></p-button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class LoginComponent implements OnInit {
    message: any | undefined;
    valCheck: string[] = ['remember'];
    loading$: Observable<boolean>;
    password!: string;
    loginForm;
    submitted = false;
    messages = signal<any[]>([]);

    constructor(
        private fb: FormBuilder, 
        private store: Store
    ) {
        this.loading$ = this.store.select(selectLoading);
        this.loginForm = this.fb.group({
            username_or_email: ['', Validators.required],
            password: ['', Validators.required],
            rememberMe: [false] // Add Remember Me checkbox field
        });
        this.store.select(selectAuthError).subscribe((error)=>{
            const errMessage = error?.error?.non_field_errors?.length > 0 ? error?.error?.non_field_errors[0] : null;
            if(errMessage){
                this.addMessages({ severity: 'error', content: errMessage, life: 30000 });
            }
        })
    }

    addMessages(message: { severity: string, content: string, life: number }) {
        this.messages.set([message]);
        // this.messages.set([ ...this.messages(), message]);
    }

    clearMessages() {
        this.messages.set([]);
    }


    ngOnInit(): void {
        // Populate email and password from localStorage if available
        const savedCredentials = JSON.parse(localStorage.getItem('ER_rememberedCredentials') || '{}');
        if (savedCredentials?.username_or_email && savedCredentials?.password) {
            this.loginForm.patchValue({
                username_or_email: savedCredentials.username_or_email,
                password: savedCredentials.password,
                rememberMe: true
            });
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    loginSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }
        
        this.store.dispatch(userLogin({
            userLoginPayload: {
                rememberMe: !!this.loginForm.value.rememberMe,
                username_or_email: this.loginForm.value.username_or_email?.trim() ?? "",
                password: this.loginForm.value.password ?? ""
            }}
        ));
    }
}
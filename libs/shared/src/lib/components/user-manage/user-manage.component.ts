import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidatorFn, FormControl } from '@angular/forms';

import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { CommonAPIService } from '../../services/common-api.service';


@Component({
  selector: 'lib-user-manage',
  templateUrl: './user-manage.component.html',
  standalone: true,
  imports: [CommonModule, PanelModule, TableModule, SelectModule, MessageModule, ReactiveFormsModule, ButtonModule, ToggleSwitchModule, InputTextModule ]
})
export class UserManageComponent implements OnInit, OnChanges {
    @Input() userDetails: any | undefined;
    @Output() closeUserDetails = new EventEmitter<void>();
    @Output() newUserDetails = new EventEmitter<any>();
    loading = true;
    @Input() userRole = '';
    @Input() createRole = '';
    @Input() rolesArr: any[] = [];
    @Input() sitesArr: any[] = [];
    showPermissionSection = true;
    loadingPermissions = false;

    userForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private commonApiService: CommonAPIService
    ) {
        this.userForm = this.fb.group({
            username:     ['', [Validators.required, Validators.maxLength(255)]],
            first_name:   ['', [Validators.required, Validators.maxLength(255)]],
            last_name:    ['', [Validators.required, Validators.maxLength(255)]],
            email:        ['', [Validators.required, Validators.maxLength(255)]],
            mobile_number:['', [Validators.required, Validators.maxLength(10)]],
            employee_id:  [''],
            allow_verify_cashbook_expense: [false, Validators.required],
            allow_verify_reimbursement_expense: [false, Validators.required],
        });

        
    }

    ngOnInit(): void {
        if(this.userDetails){
            this.userForm.patchValue({
                username: this.userDetails.username,
                first_name: this.userDetails.first_name,
                last_name: this.userDetails.last_name,
                email: this.userDetails.email,
                mobile_number: this.userDetails.mobile_number,
                employee_id: this.userDetails.employee_id,
                is_active: this.userDetails.is_active,
            });

            
        }
    }

    userRoleChanged(role: string) {
        console.log(role)
        this.showPermissionSection = role === 'USER';
        if(role !== 'USER'){
            this.userForm.patchValue({
                allow_verify_cashbook_expense: true,
                allow_verify_reimbursement_expense: true,
            });
        } else {
            this.userForm.patchValue({
                allow_verify_cashbook_expense: false,
                allow_verify_reimbursement_expense: false,
            });
        }

    }

     /** runs if the @Input changes after init */
    ngOnChanges(changes: SimpleChanges): void {
        this.applyUserDetails();
        if (changes['userDetails']){
            if(this.userDetails){
                this.loadingPermissions = true;
                this.commonApiService.getUserPermissions(changes['userDetails'].currentValue.id).subscribe({
                    next: (res: any) => {
                        this.loadingPermissions = false;
                        this.userForm.patchValue({
                            allow_verify_cashbook_expense: res?.permissions?.includes('allow_verify_cashbook_expense'),
                            allow_verify_reimbursement_expense: res?.permissions?.includes('allow_verify_reimbursement_expense'),
                        });
                    },
                    error: (err: any) => {
                        console.error('Error fetching user permissions:', err);
                        this.loadingPermissions = false;
                    }
                });
            }
        }
        if (changes['userDetails'] && !changes['userDetails'].firstChange) {
            console.log(changes['userDetails'])
        }
        if (changes['rolesArr']) {
            this.showPermissionSection = this.rolesArr.filter(val=>val.name === 'USER').length > 0 && (this.userDetails ? this.userDetails.role === 'USER': true);
        }
        if (changes['createRole'] && this.createRole == 'SITE_ADMIN') {
            this.userForm.patchValue({
                allow_verify_cashbook_expense: true,
                allow_verify_reimbursement_expense: true,
            });
        }
    }



    /** add / remove the mode-specific controls + validators */
    private applyUserDetails(): void {
        console.log(this.userRole);
        console.log(this.userRole && this.userRole !== 'USER' && this.userRole === 'SUPERADMIN');
        

        if(this.userRole && this.userRole !== 'USER' && this.userRole === 'SITE_ADMIN') {
            if (!this.userForm.contains('role')) {
                this.userForm.addControl(
                    'role',
                    new FormControl(this.createRole ?? '', Validators.required)
                );
            } else {
                this.userForm.get('role')?.setValue(this.userDetails?.role ?? '');
            }
        }

        if(this.userRole && this.userRole !== 'USER' && this.userRole === 'SUPERADMIN') {
            if (!this.userForm.contains('role')) {
                this.userForm.addControl(
                    'role',
                    new FormControl(this.userDetails?.role ?? '', Validators.required)
                );
                this.userForm.addControl(
                    'site',
                    new FormControl(this.userDetails?.office_location ? this.userDetails.office_location.id: '', Validators.required)
                );
            } else {
                this.userForm.get('role')?.setValue(this.userDetails?.role ?? '');
                this.userForm.get('site')?.setValue(this.userDetails?.site ?? '');
            }
        }
        /* ----------- CREATE (new user) ----------- */
        if (!this.userDetails) {
            // remove edit-only control
            if (this.userForm.contains('is_active')) {
                this.userForm.removeControl('is_active');
            }

            // add create-only controls once
            if (!this.userForm.contains('password')) {
                this.userForm.addControl(
                'password',
                new FormControl('', [Validators.required, Validators.maxLength(255)])
                );
                this.userForm.addControl(
                'confirm_password',
                new FormControl('', [Validators.required, Validators.maxLength(255)])
                );
            }

            // form-level validator: passwords must match
            this.userForm.setValidators(this.passwordsMatchValidator);
            this.userForm.updateValueAndValidity();
            return;
        }

        /* ----------- EDIT (existing user) ----------- */
        // remove password controls & their form-level validator
        ['password', 'confirm_password'].forEach(c => {
            if (this.userForm.contains(c)) this.userForm.removeControl(c);
        });
        this.userForm.clearValidators();

        // add / update is_active (required)
        if (!this.userForm.contains('is_active')) {
            this.userForm.addControl(
                'is_active',
                new FormControl(this.userDetails.is_active ?? false, Validators.required)
            );
        } else {
            this.userForm.get('is_active')?.setValue(this.userDetails.is_active ?? false);
        }

        // patch the rest of the user data
        this.userForm.patchValue({
            username:      this.userDetails.username,
            first_name:    this.userDetails.first_name,
            last_name:     this.userDetails.last_name,
            email:         this.userDetails.email,
            mobile_number: this.userDetails.mobile_number,
            employee_id:   this.userDetails.employee_id
        });

        this.userForm.updateValueAndValidity();
    }

    /** simple form-level validator to ensure password === confirm_password */
    private passwordsMatchValidator: ValidatorFn = (group: AbstractControl) => {
        const p  = group.get('password')?.value;
        const cp = group.get('confirm_password')?.value;
        return p && cp && p !== cp ? { passwordMismatch: true } : null;
    };


    onSubmit() {
        if (this.userForm.invalid) {
            this.userForm.markAllAsTouched();
            return;
        }
        if(this.userDetails){
            this.newUserDetails.emit({...this.userForm.value, id: this.userDetails.id});
        } else {
            this.newUserDetails.emit(this.userForm.value);
        }
    }
    
}

import { Component, Output, Input, OnChanges, EventEmitter, OnInit, SimpleChanges, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';

import { HelperSharedService } from '../../services/helper-shared.service';


@Component({
  selector: 'lib-user-filter',
  templateUrl: './user-filter.component.html',
  standalone: true,
  imports: [CommonModule, ButtonModule, TagModule, SelectModule, InputTextModule, ReactiveFormsModule],
  styles: ``
})
export class UserFilterComponent implements OnInit, OnChanges, OnDestroy {
    @Output() filterData = new EventEmitter<any>();
    userFilterForm: FormGroup;
    initialAdvSearchValues: any;
    @Input() loadingAdvanceFilter = false;
    @Input() preFilters: any = {};
    enableAdvSearch = false;
    subscriptions: Subscription[] = [];
    statusOpt =  [
        {
            label: 'Active',
            value: true
        },
        {
            label: 'In-active',
            value: false
        }
    ]

    constructor(
        private helperSharedService: HelperSharedService,
        private fb: FormBuilder,
    ){
        this.userFilterForm = this.fb.group({
            username: ['', [Validators.maxLength(255)]],
            name: ['', [Validators.maxLength(255)]],
            email: ['', [Validators.maxLength(255)]],
            mobile_number: ['', [Validators.maxLength(10)]],
            employee_id: ['', [Validators.maxLength(50)]],
            is_active: [''],
        });
        this.initialAdvSearchValues = this.userFilterForm.value;
    }

    ngOnInit(): void {
        const advanceSearchFormSub = this.userFilterForm.valueChanges.subscribe((currentValue: any)  => {
            this.enableAdvSearch = JSON.stringify(this.helperSharedService.replaceNullsWithEmpty(currentValue)) !== JSON.stringify(this.helperSharedService.replaceNullsWithEmpty(this.initialAdvSearchValues));
        });
        this.subscriptions.push(advanceSearchFormSub);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['preFilters'] && changes['preFilters'].currentValue !== changes['preFilters'].previousValue) {
            const newPreFilters = changes['preFilters'].currentValue;

            if (!this.helperSharedService.isTruthyObject(newPreFilters)) {
                this.userFilterForm.reset();
            } else {
            Object.keys(this.userFilterForm.controls).forEach(key => {
                if (newPreFilters.hasOwnProperty(key)) {
                    this.userFilterForm.get(key)?.patchValue(newPreFilters[key]);
                }
            });
            // this.initialAdvSearchValues = this.userFilterForm.value;
            }
        }
    }

    onSubmitFilter(){
        this.filterData.emit(this.helperSharedService.removeEmptyTrimmedStrings(this.userFilterForm.value));
    }

    clearAdvanceFilter(){
        this.userFilterForm.reset();
        this.filterData.emit({});
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
   
}

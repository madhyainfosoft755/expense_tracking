import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { HelperSharedService } from '../../services/helper-shared.service';
import { ButtonGroupModule } from 'primeng/buttongroup';


@Component({
  selector: 'lib-user-details-table',
  templateUrl: './user-details-table.component.html',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, TagModule, ButtonGroupModule],
  styles: ``
})
export class UserDetailsTableComponent implements OnChanges {
    @Input() users: any;
    @Input() action = false;
    @Input() loading = false;
    @Output() editUser = new EventEmitter<any>();
    @Output() pageChanged = new EventEmitter<number>();
    paginationText: any;

    constructor(
      private helperSharedService: HelperSharedService
    ) { }

    ngOnChanges(changes: SimpleChanges) {
      if (changes['users'] && this.users) {
        this.paginationText = this.helperSharedService.getPaginationText(this.users);
      }
    }

    showUserManageModal(user: any){
        this.editUser.emit(user);
    }

    pageChange(event: any) {
      console.log(event)
        // this.first = event.first;
        // this.rows = event.rows;
    }

    next() {
      console.log('next call')
      console.log(this.users)
      console.log(this.users?.next_page)
        this.pageChanged.emit(this.users?.next_page);
    }

    prev() {
        this.pageChanged.emit(this.users?.previous_page);
    }

    isLastPage(): boolean {
        return !this.users?.next_page;
    }

    isFirstPage(): boolean {
        return !this.users?.previous_page;
    }
   
}

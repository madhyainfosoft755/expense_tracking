import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserService } from '../../services/user.service';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import {
  selectUser,
} from '@auth';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  standalone: true,
  imports: [CommonModule],
  styles: ``
})
export class UserDashboardComponent implements OnInit {

  loading = false;
  financial_summary_data: any = null;
  currentUser$: Observable<any | null> = of(null);

  constructor(
    private userService: UserService,
    private store: Store
  ){
    this.currentUser$ = this.store.select(selectUser);
  }

  ngOnInit(): void {
    // this.currentUser$.subscribe(user => {
    //   if (user) {
    //     console.log(user)
    //   } else {
    //   }
    // });
    this.get_user_financial_summary();
  }

  get_user_financial_summary(){
    this.loading = true;
    this.userService.get_user_financial_summary()
      .subscribe({
        next: (data) => {
          this.financial_summary_data = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching expense head list:', err);
          this.loading = false;
        }
    });
  }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private apiService: ApiService
  ) { }
  prefix = 'user/';
  changePassword(data: any): Observable<any> {
    return this.apiService.post(this.prefix+'change-password/', data);
  }

  getUserProfile(): Observable<any> {
    return this.apiService.get(this.prefix+'profile/');
  }


  addReceivingAmt(data: any): Observable<any> {
    return this.apiService.post(this.prefix+'add-receiving-amt/', data);
  }

  getReveivingAmt(page=1, params= {}): Observable<any> {
    return this.apiService.get(this.prefix+'get-receiving-amt/', {...params, page: page});
  }

  addReportExpense(data: any): Observable<any> {
    return this.apiService.post(this.prefix+'add-report-expense/', data);
  }

  addProjectExpense(data: any): Observable<any> {
    return this.apiService.post('create-project-expenses/', data);
  }

  getReportExpense(page=1, params= {}): Observable<any> {
    return this.apiService.get(this.prefix+'get-report-expense/', {...params, page: page});
  }

  listSites(): Observable<any> {
    return this.apiService.get('admin/list-office-locations/');
  }


  getProjectExpense(page=1, params= {}): Observable<any> {
    return this.apiService.get('get-project-expenses/', {...params, page: page});
  }

  listExpenseHeads(): Observable<any> {
    return this.apiService.get('list-expense-heads/');
  }

  getCashbook(params: any = {}): Observable<any> {
    return this.apiService.get(this.prefix+'get-cashbook/', params);
  }

  get_user_financial_summary(): Observable<any> {
    return this.apiService.get('get-user-financial-summary/');
  }

  updateUserProfile(data: any): Observable<any> {
    return this.apiService.put('update-profile/', data);
  }


}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@auth';

@Injectable({
  providedIn: 'root'
})
export class SiteAdminService {
  constructor(
    private apiService: ApiService
  ) { }
  prefix = 'site-admin/';

  getAllSiteUserList(page =1, params: any = {}): Observable<any> {
    return this.apiService.get(`${this.prefix}all-site-users/`, {...params, ordering:'name', page: page});
  }

  getDashboardData(): Observable<any> {
    return this.apiService.get(`${this.prefix}dashboard-data`);
  }

  siteUserAdminCreate(user: any): Observable<any> {
    return this.apiService.post(`${this.prefix}site-user-admin-create/`, user);
  }

  updateSiteUserDetails(user_id: string, user: any): Observable<any> {
    return this.apiService.put(`${this.prefix}update-site-user/${user_id}/`, user);
  }

  addProjectExpense(data: any): Observable<any> {
    return this.apiService.post('create-project-expenses/', data);
  }
  getProjectExpense(): Observable<any> {
      return this.apiService.get('get-project-expenses/');
    }
  listExpenseHeads(): Observable<any> {
      return this.apiService.get('list-expense-heads/');
    }

  expenseSummaryData(data: any): Observable<any> {
      return this.apiService.post('expense-summary-data/', data);
    }

  ProjectExpenseSummaryData(data: any): Observable<any> {
    return this.apiService.post('project-expense-summary-data/', data);
  }


}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@auth';

@Injectable({
  providedIn: 'root'
})
export class CommonAPIService {
    constructor(
        private apiService: ApiService
    ) { }

    UnapprovedCashbookExpense(page=1, params= {}): Observable<any> {
        return this.apiService.get('unapprove-cashbook-expenses/', {...params, page: page});
    }

    UnapprovedProjectExpense(page=1, params= {}): Observable<any> {
        return this.apiService.get('unapprove-project-expenses/', {...params, page: page});
    }

    VerifyCashbookExpense(data: {remarks: string}, id: string, status: 'approve'|'reject'|''): Observable<any> {
        return this.apiService.post(`cashbook-expense/${id}/${status}/`, data);
    }

    VerifyProjectExpense(data: {remarks: string}, id: string, status: 'approve'|'reject'|''): Observable<any> {
        return this.apiService.post(`project-expense/${id}/${status}/`, data);
    }

    expenseSummaryData(data: any): Observable<any> {
        return this.apiService.post('expense-summary-data/', data);
    }

    ProjectExpenseSummaryData(data: any): Observable<any> {
        return this.apiService.post('project-expense-summary-data/', data);
    }

    listSites(): Observable<any> {
        return this.apiService.get('admin/list-office-locations/');
    }

    getSummaryCashbook(params: any): Observable<any> {
        return this.apiService.get('summary-cashbook/', params);
    }


    getSummaryReimbursement(params: any): Observable<any> {
        return this.apiService.get('summary-reimbursement/', params);
    }

    getCashbook(params: any = {}): Observable<any> {
        return this.apiService.get('get-cashbook/', params);
    }

    listExpenseHeads(): Observable<any> {
        return this.apiService.get('list-expense-heads/');
    }

    getProjectExpense(page=1, params= {}): Observable<any> {
        return this.apiService.get('get-project-expenses/', {...params, page: page});
    }

    addProjectExpense(data: any): Observable<any> {
        return this.apiService.post('create-project-expenses/', data);
    }

    getUserPermissions(id: string): Observable<any> {
        return this.apiService.get(`user-permissions/${id}/`);
    }

}
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@auth';

@Injectable({
  providedIn: 'root'
})
export class ClientSuperAdminService {
  constructor(
    private apiService: ApiService
  ) { }
  prefix = 'superadmin/';

  listExpenseHeads(): Observable<any> {
    return this.apiService.get('list-expense-heads/');
  }

  createExpenseHeads(data: {
    name: string,
    office_locations: number[]
  }): Observable<any> {
    return this.apiService.post('create-expense-heads/', data);
  }

  updateExpenseHeads(expense_head_id: string, data: {
    name: string, is_active?: boolean,
    office_locations: number[]
  }): Observable<any> {
    return this.apiService.put(`update-expense-heads/${expense_head_id}/`, data);
  }

  getSuperadminList(page =1, params: any = {}): Observable<any> {
    console.log(params)
    return this.apiService.get(this.prefix+'get-client-superadmin/', {...params, ordering:'name', page: page});
  }

  addNewSuperadmin(user: any): Observable<any> {
    return this.apiService.post(this.prefix+'client-superadmin/', user);
  }

  getAdminList(): Observable<any> {
    return this.apiService.get('admin/admin-manage/');
  }

  addNewAdmin(user: any): Observable<any> {
    return this.apiService.post('admin/admin-manage/', user);
  }

  addNewUserorSiteAdmin(user: any): Observable<any> {
    return this.apiService.post('site-admin/site-user-admin-create/', user);
  }

  updateUserorSiteAdmin(userId: string, user: any): Observable<any> {
    return this.apiService.put(`site-admin/update-site-user/${userId}/`, user);
  }

  updateAdminDetails(user_id: string, user: any): Observable<any> {
    return this.apiService.put(`${this.prefix}update-client-admin/${user_id}/`, user);
  }


  getSiteAdminList(params: any = {page:1}): Observable<any> {
    return this.apiService.get('site-admin/all-site-users/', params);
  }

  siteUserAdminCreate(user: any): Observable<any> {
    return this.apiService.post('site-admin/site-user-admin-create/', user);
  }

  updateSiteUserDetails(user_id: string, user: any): Observable<any> {
    return this.apiService.put(`site-admin/update-site-user//${user_id}/`, user);
  }

  updateSiteAdminDetails(user_id: string, user: any): Observable<any> {
    return this.apiService.put(`admin/update-site-admin//${user_id}/`, user);
  }

  getAllUserList(page =1, params: any = {}): Observable<any> {
    return this.apiService.get('admin/all-client-users/', {...params, ordering:'name', page: page});
  }


  // Site Management
  
  listSites(): Observable<any> {
    return this.apiService.get('admin/list-office-locations/');
  }

  addNewSite(data: any){
    return this.apiService.post('admin/add-office-location/', data);
  }


  updateSitePriority(id: string){
    return this.apiService.patch(`admin/office-location/${id}/update-priority/`, {});
  }

  updateSite(id: string, data: any){
    return this.apiService.put(`admin/update-office-location/${id}`, data);
  }

  getDashboardData(){
    return this.apiService.get(`${this.prefix}dashboard-data/`);
  }

}

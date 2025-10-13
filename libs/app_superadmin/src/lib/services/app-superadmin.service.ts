import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@auth';
import { ClientDetails } from '../+state/app-superadmin.models';

@Injectable({
  providedIn: 'root'
})
export class AppSuperAdminService {
  constructor(
    private apiService: ApiService
  ) { }
  prefix = 'app-superadmin/';
  getDashboardData(): Observable<any> {
    return this.apiService.get(this.prefix+'get-dashboard-data/');
  }

  addClient(data: FormData): Observable<any> {
    return this.apiService.post(this.prefix+'clients/', data);
  }

  updateClient(client_id: string, data: FormData): Observable<any> {
    return this.apiService.patch(`${this.prefix}update-client/${client_id}/`, data);
  }

  markClientInactive(data: any): Observable<any> {
    return this.apiService.post(this.prefix+'clients', data);
  }

  getClientDetails(client_id: string): Observable<ClientDetails> {
    return this.apiService.get(this.prefix+'client-details/'+client_id);
  }

  getClientList(): Observable<any> {
    return this.apiService.get(this.prefix+'clients-list/');
  }

  getAppSuperadminList(page =1, params: any = {}): Observable<any> {
    return this.apiService.get(this.prefix+'list-app-superadmins/', {...params, page: page});
  }

  addNewAppSuperadmin(user: any): Observable<any> {
    return this.apiService.post(this.prefix+'app-superadmins/', user);
  }


}

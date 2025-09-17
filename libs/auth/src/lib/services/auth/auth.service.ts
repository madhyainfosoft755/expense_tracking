import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api/api.service';
import { userLoginResponse } from '../../+state/auth.models';
import { Store } from '@ngrx/store';
import { logoutSuccess } from '../../+state/auth.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private apiService: ApiService,
    private store: Store
  ) { }
  authApiUrl = '';

  userLogin(data: any = {}): Observable<userLoginResponse> {
    const enc_password = data['password'];
    const encryptedData = {
      username_or_email: data['username_or_email'],
      password: enc_password,
    };
    
    return this.apiService.post(
      'login/',
      encryptedData
    );
  }

  checkResetToken(token: string){
    return this.apiService.get( `check-reset-token/${token}` );
  }

  resetPassword(data: any){
    return this.apiService.post( 'reset-password/', data );
  }

  forgotPassword(data: any){
    return this.apiService.post( 'forgot-password/', data );
  }

  changePasswordByUser(data: {currentPassword: string, newPassword: string}): Observable<Response> {
    const encryptedData = {
      data: {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }
    };
    return this.apiService.post<Response, any>('changePasswordByUser',encryptedData);
  }

  logout(){
    this.store.dispatch(logoutSuccess());
  }


}

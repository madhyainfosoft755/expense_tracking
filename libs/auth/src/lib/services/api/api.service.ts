import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly http = inject(HttpClient);
   headers: HttpHeaders;
   apiURL = 'http://127.0.0.1:8000/api/';

   setParams(data: any): HttpParams {
    let httpParams = new HttpParams();
    Object.keys(data).forEach(key => {
      const value = data[key];
      if (value !== null && value !== undefined) {
        httpParams = httpParams.set(key, value.toString());
      }
    });
    return httpParams
  }

  get<T>(url: string, params: any = {}, headers: HttpHeaders|null=null): Observable<T> {
    const newParams: HttpParams = this.setParams(params);
     if(headers === null){
       return this.http.get<T>(this.apiURL+url, {
         headers: this.headers,
         params: newParams
       });
     } else {
      return this.http.get<T>(this.apiURL+url, {
        headers: headers,
        params: newParams
      });
     }
  }

  getRaw<T>(url: string, params: HttpParams = new HttpParams(), headers: HttpHeaders|null=null): Observable<T> {
    
    if(headers === null){
      return this.http.get<T>(this.apiURL+url, {
        headers: this.headers,
        params,
      });
    } else {
     return this.http.get<T>(this.apiURL+url, {
       headers: headers,
       params,
     });
    }
  }

  post<T, D>(url: string, data?: D, headers: HttpHeaders|null=null,  skipEncrytion = false): Observable<T> {
    
    if(headers === null){
      return this.http.post<T>(this.apiURL+url, data);
    }
    return this.http.post<T>(this.apiURL+url, data, {headers});
  }

  postRaw<T, D>(url: string, data?: D, headers: HttpHeaders|null=null,  skipEncrytion = false): Observable<T> {
    
    if(headers === null){
      return this.http.post<T>(url, data);
    }
    return this.http.post<T>(url, data, {headers});
  }

  postLogin<T, S, D>(url: string, userId : string, data?: D ): Observable<T> {
     const headers = new HttpHeaders({
      'X-APPToken': userId
     })
     
    return this.http.post<T>(this.apiURL+url, data, {headers});
  }

  put<T, D>(url: string, data: D ): Observable<T> {
    
    return this.http.put<T>(this.apiURL+url, data);
  }

  patch<T, D>(url: string, data: D ): Observable<T> {
    
    return this.http.patch<T>(this.apiURL+url, data);
  }

  delete<T, D>(url: string, data?: D ): Observable<T> {
    const options = {
      headers: this.headers,
      body: data };
    
    return this.http.delete<T>(this.apiURL+url, options);
  }
  postFormData<T, D>(url: string, data?: D ): Observable<T> {
    const headers = new HttpHeaders({
      'Accept': '*/*',
    });
    
    return this.http.post<T>(this.apiURL+url, data, { headers: headers });
  }

  postNewFormData<T, D, S>(url: string, data?: D,  additionalData? :S ): Observable<T> {
    const headers = new HttpHeaders({
      'Accept': '*/*',
    });
    const dataObj = {
      formData : data,
      requestdata : additionalData
    }
    
    return this.http.post<T>(this.apiURL+url, dataObj, { headers: headers });
  }

  constructor() {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json' , // default content type
        'Accept': 'application/json',
    });
  }
}

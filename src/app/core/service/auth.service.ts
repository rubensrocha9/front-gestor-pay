import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { ConfirmEmail, Register, RegisterEmployee, SendResetPassword } from '../../shared/models/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private api = environment.host;
  private userPayload: any;

  constructor(
    private router: Router,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.userPayload = this.decodedToken();
    }
  }

  signUpCompany(user: Register): Observable<Register>{
    return this.http.post<Register>(`${this.api}/company/register`, user);
  }

  signUpEmployee(companyId: number, id: number, user: RegisterEmployee): Observable<RegisterEmployee>{
    return this.http.post<RegisterEmployee>(`${this.api}/company/${companyId}/employee/${id}/register`, user);
  }

  sendResetPassword(email: SendResetPassword): Observable<SendResetPassword> {
    return this.http.post<SendResetPassword>(`${this.api}/send/reset-password`, email);
  }

  resetPassword(email: SendResetPassword): Observable<SendResetPassword> {
    return this.http.post<SendResetPassword>(`${this.api}/reset-password`, email);
  }

  confirmEmail(confirmEmail: ConfirmEmail): Observable<ConfirmEmail>{
    return this.http.post<ConfirmEmail>(`${this.api}/confirm-email`, confirmEmail);
  }

  confirmEmployeeEmail(confirmEmail: ConfirmEmail): Observable<ConfirmEmail>{
    return this.http.post<ConfirmEmail>(`${this.api}/company/employee/confirm-email`, confirmEmail);
  }

  signIn(user: any): Observable<any>{
    const url = `${this.api}/authenticate`;
    return this.http.post<any>(url, user);
  }

  signOut(){
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
      this.router.navigate(['login']);
    }
  }

  storeToken(tokenValue: string){
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', tokenValue);
    }
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }

  userAuthenticated(): boolean {
    return isPlatformBrowser(this.platformId) && !!localStorage.getItem('token');
  }

  decodedToken() {
    if (isPlatformBrowser(this.platformId)) {
      const jwtHelper = new JwtHelperService();
      const token = this.getToken();
      return token ? jwtHelper.decodeToken(token) : null;
    }
    return null;
  }

  getFullNameFromToken() {
    if (this.userPayload){
      return this.userPayload.unique_name;
    }
  }

  getRoleFromToken() {
    if (this.userPayload){
      return this.userPayload.role;
    }
  }
}

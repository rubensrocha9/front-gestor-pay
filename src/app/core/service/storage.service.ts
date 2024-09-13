import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private fullName$ = new BehaviorSubject<string>(this.getFromLocalStorage('fullName', ''));
  private role$ = new BehaviorSubject<string>(this.getFromLocalStorage('role', ''));
  private isCompany$ = new BehaviorSubject<string>(this.getFromLocalStorage('is_company', ''));
  private employeeId$ = new BehaviorSubject<string>(this.getFromLocalStorage('employeeId', ''));
  private companyId$ = new BehaviorSubject<string>(this.getFromLocalStorage('companyId', ''));

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  private getFromLocalStorage(key: string, defaultValue: string): string {
    if (isPlatformBrowser(this.platformId)) {
      const storedValue = localStorage.getItem(key);
      return storedValue ? storedValue : defaultValue;
    }
    return defaultValue;
  }

  private setToLocalStorage(key: string, value: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(key, value);
    }
  }

  public getIsCompanyFromStore(): Observable<string> {
    return this.isCompany$.asObservable();
  }

  public setIsCompanyForStore(isCompany: string): void {
    this.setToLocalStorage('is_company', isCompany);
    this.isCompany$.next(isCompany);
  }

  public getCompanyFromStore(): Observable<string> {
    return this.companyId$.asObservable();
  }

  public setCompanyForStore(companyId: string): void {
    this.setToLocalStorage('companyId', companyId);
    this.companyId$.next(companyId);
  }

  public getEmployeeFromStore(): Observable<string> {
    return this.employeeId$.asObservable();
  }

  public setEmployeeForStore(employeeId: string): void {
    this.setToLocalStorage('employeeId', employeeId);
    this.employeeId$.next(employeeId);
  }

  public getRoleFromStore(): Observable<string> {
    return this.role$.asObservable();
  }

  public setRoleForStore(role: string): void {
    this.setToLocalStorage('role', role);
    this.role$.next(role);
  }

  public getFullNameFromStore(): Observable<string> {
    return this.fullName$.asObservable();
  }

  public setFullnameForStore(fullName: string): void {
    this.setToLocalStorage('fullName', fullName);
    this.fullName$.next(fullName);
  }
}

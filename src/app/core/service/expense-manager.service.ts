import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ExpenseManager } from '../../shared/models/expense-manager';
import { PaginatedResult } from '../../shared/models/pagination';

@Injectable({
  providedIn: 'root'
})
export class ExpenseManagerService {

  private api = environment.host;

  constructor(private http: HttpClient) { }

  getPageParams(companyId: number, page?: number, itemsPerPage?: number, term?: string): Observable<PaginatedResult<ExpenseManager[]>>{
    const paginatedResult: PaginatedResult<ExpenseManager[]> = { result: [], pagination: { currentPage: 0, itemsPerPage: 0, totalItems: 0, totalPages: 0 } };

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page.toString());
      params = params.append('pageSize', itemsPerPage.toString());
    }

    if (term != null && term !== '') {
      params = params.append('term', term);
    }

    return this.http.get<ExpenseManager[]>(`${this.api}/company/${companyId}/spending-manager`, { observe: 'response', params }).pipe(
      map((response) => {
        paginatedResult.result = response.body || [];
        if (response.headers.has('Pagination')) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination')!);
        }
        return paginatedResult;
      }));
  }

  getById(companyId: number, id: number): Observable<ExpenseManager>{
    return this.http.get<ExpenseManager>(`${this.api}/company/${companyId}/spending-manager/${id}`)
  }

  create(companyId: number, manager: ExpenseManager): Observable<ExpenseManager>{
    return this.http.post<ExpenseManager>(`${this.api}/company/${companyId}/spending-manager`, manager)
  }

  update(companyId: number, id: number, manager: ExpenseManager): Observable<ExpenseManager>{
    return this.http.put<ExpenseManager>(`${this.api}/company/${companyId}/spending-manager/${id}/update`, manager)
  }

  delete(companyId: number, id: number): Observable<ExpenseManager>{
    return this.http.delete<ExpenseManager>(`${this.api}/company/${companyId}/spending-manager/${id}/delete`)
  }
}

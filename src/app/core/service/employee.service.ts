import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Employee, EmployeeAndAddress } from '../../shared/models/employee';
import { PaginatedResult } from '../../shared/models/pagination';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private api = environment.host;

  constructor(private http: HttpClient) { }

  getPageParams(companyId: number, page?: number, itemsPerPage?: number, term?: string): Observable<PaginatedResult<Employee[]>>{
    const paginatedResult: PaginatedResult<Employee[]> = { result: [], pagination: { currentPage: 0, itemsPerPage: 0, totalItems: 0, totalPages: 0 } };

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page.toString());
      params = params.append('pageSize', itemsPerPage.toString());
    }

    if (term != null && term !== '') {
      params = params.append('term', term);
    }

    return this.http.get<Employee[]>(`${this.api}/company/${companyId}/employee`, { observe: 'response', params }).pipe(
      map((response) => {
        paginatedResult.result = response.body || [];
        if (response.headers.has('Pagination')) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination')!);
        }
        return paginatedResult;
      }));
  }

  getById(companyId: number, id: number): Observable<Employee>{
    return this.http.get<Employee>(`${this.api}/company/${companyId}/employee/${id}`)
  }

  create(companyId: number, employee: EmployeeAndAddress): Observable<EmployeeAndAddress>{
    return this.http.post<EmployeeAndAddress>(`${this.api}/company/${companyId}/employee`, employee)
  }

  update(companyId: number, id: number, employee: EmployeeAndAddress): Observable<EmployeeAndAddress>{
    return this.http.put<EmployeeAndAddress>(`${this.api}/company/${companyId}/employee/${id}/update`, employee)
  }

  delete(companyId: number, id: number): Observable<Employee>{
    return this.http.delete<Employee>(`${this.api}/company/${companyId}/employee/${id}/delete`)
  }
}

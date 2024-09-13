import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { EmployeePermission, EmployeeRole } from '../../shared/models/employee';
import { PaginatedResult } from '../../shared/models/pagination';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  private api = environment.host;

  constructor(private http: HttpClient) { }

  getPageParams(companyId: number, page?: number, itemsPerPage?: number, term?: string): Observable<PaginatedResult<EmployeePermission[]>>{
    const paginatedResult: PaginatedResult<EmployeePermission[]> = { result: [], pagination: { currentPage: 0, itemsPerPage: 0, totalItems: 0, totalPages: 0 } };

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page.toString());
      params = params.append('pageSize', itemsPerPage.toString());
    }

    if (term != null && term !== '') {
      params = params.append('term', term);
    }

    return this.http.get<EmployeePermission[]>(`${this.api}/company/${companyId}/employee/permission`, { observe: 'response', params }).pipe(
      map((response) => {
        paginatedResult.result = response.body || [];
        if (response.headers.has('Pagination')) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination')!);
        }
        return paginatedResult;
      }));
  }

  getById(companyId: number, id: number): Observable<EmployeePermission>{
    return this.http.get<EmployeePermission>(`${this.api}/company/${companyId}/employee/${id}/permission`)
  }

  update(companyId: number, id: number, role: number): Observable<EmployeeRole>{
    return this.http.put<EmployeeRole>(`${this.api}/company/${companyId}/employee/${id}/permission`, role)
  }
}

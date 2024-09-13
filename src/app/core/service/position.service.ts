import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaginatedResult } from '../../shared/models/pagination';
import { Position, PositionDTO } from '../../shared/models/position';

@Injectable({
  providedIn: 'root'
})
export class PositionService {

  private api = environment.host;

  constructor(private http: HttpClient) { }

  getPageParams(companyId: number, page?: number, itemsPerPage?: number, term?: string): Observable<PaginatedResult<Position[]>>{
    const paginatedResult: PaginatedResult<Position[]> = { result: [], pagination: { currentPage: 0, itemsPerPage: 0, totalItems: 0, totalPages: 0 } };

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page.toString());
      params = params.append('pageSize', itemsPerPage.toString());
    }

    if (term != null && term !== '') {
      params = params.append('term', term);
    }

    return this.http.get<Position[]>(`${this.api}/company/${companyId}/position`, { observe: 'response', params }).pipe(
      map((response) => {
        paginatedResult.result = response.body || [];
        if (response.headers.has('Pagination')) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination')!);
        }
        return paginatedResult;
      }));
  }

  getPositionList(companyId: number): Observable<Position[]>{
    return this.http.get<Position[]>(`${this.api}/company/${companyId}/list/position`)
  }

  getById(companyId: number, id: number): Observable<Position>{
    return this.http.get<Position>(`${this.api}/company/${companyId}/position/${id}`)
  }

  create(companyId: number, position: PositionDTO): Observable<PositionDTO>{
    return this.http.post<PositionDTO>(`${this.api}/company/${companyId}/position`, position)
  }

  update(companyId: number, id: number, position: PositionDTO): Observable<PositionDTO>{
    return this.http.put<PositionDTO>(`${this.api}/company/${companyId}/position/${id}/update`, position)
  }

  delete(companyId: number, id: number): Observable<Position>{
    return this.http.delete<Position>(`${this.api}/company/${companyId}/position/${id}/delete`)
  }

}

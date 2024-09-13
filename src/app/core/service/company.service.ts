import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AttachmentDTO } from '../../shared/models/attachment';
import { CompanyProfile } from '../../shared/models/company';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private api = environment.host;

  constructor(private http: HttpClient) { }

  getById(companyId: number): Observable<CompanyProfile>{
    return this.http.get<CompanyProfile>(`${this.api}/company/${companyId}`)
  }

  getAttachment(companyId: number): Observable<AttachmentDTO>{
    return this.http.get<AttachmentDTO>(`${this.api}/company/${companyId}/file`)
  }

  update(companyId: number, company: CompanyProfile): Observable<CompanyProfile>{
    return this.http.put<CompanyProfile>(`${this.api}/company/${companyId}/update`, company)
  }

  sendAttachment(companyId: number, file: File): Observable<AttachmentDTO>{
    const formData = new FormData();
    formData.append('image', file);
    return this.http.put<AttachmentDTO>(`${this.api}/company/${companyId}/file`, formData)
  }

  delete(companyId: number, id: number): Observable<CompanyProfile>{
    return this.http.delete<CompanyProfile>(`${this.api}/company/${companyId}/deactivate-account`)
  }
}

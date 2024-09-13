import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AttachmentDTO } from '../../shared/models/attachment';
import { EmployeeAndAddress, Feedback } from '../../shared/models/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeProfileService {

  private api = environment.host;

  constructor(private http: HttpClient) { }

  getAttachment(id: number): Observable<AttachmentDTO>{
    return this.http.get<AttachmentDTO>(`${this.api}/company/employee-profile/${id}/file`)
  }

  getFeedbackHistory(companyId: number, id: number): Observable<Feedback[]>{
    return this.http.get<Feedback[]>(`${this.api}/company/${companyId}/employee/${id}/feedback`)
  }

  createFeedback(companyId: number, id: number, feedback: Feedback): Observable<Feedback>{
    return this.http.post<Feedback>(`${this.api}/company/${companyId}/employee/${id}/feedback`, feedback)
  }

  update(companyId: number, id: number, employee: EmployeeAndAddress): Observable<EmployeeAndAddress>{
    return this.http.put<EmployeeAndAddress>(`${this.api}/company/${companyId}/employee/${id}/update-profile`, employee)
  }

  sendAttachment(id: number, file: File): Observable<AttachmentDTO>{
    const formData = new FormData();
    formData.append('image', file);
    return this.http.put<AttachmentDTO>(`${this.api}/company/employee-profile/${id}/file`, formData)
  }
}

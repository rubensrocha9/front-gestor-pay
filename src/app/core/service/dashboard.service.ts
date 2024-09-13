import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Dashboard, FeedbackWithAttachmentDTO } from '../../shared/models/dashboard';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private api = environment.host;

  constructor(private http: HttpClient) { }

  dashboard(companyId: number): Observable<Dashboard>{
    return this.http.get<Dashboard>(`${this.api}/company/${companyId}/dashboard`);
  }

  feedback(companyId: number): Observable<FeedbackWithAttachmentDTO>{
    return this.http.get<FeedbackWithAttachmentDTO>(`${this.api}/company/${companyId}/feedback`);
  }
}

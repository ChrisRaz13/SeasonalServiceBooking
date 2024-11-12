import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EmergencyRequest {
  name: string;
  phone: string;
  address: string;
  serviceType: string;
  description?: string;
}

@Injectable({
  providedIn: 'root',
})
export class EmergencyRequestService {
  private apiUrl = 'http://localhost:9080/api/emergency-requests'; // Update with your backend API URL

  constructor(private http: HttpClient) {}

  submitEmergencyRequest(request: EmergencyRequest): Observable<void> {
    return this.http.post<void>(this.apiUrl, request);
  }
}

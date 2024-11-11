import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServiceEntity } from '../models/service.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  private apiUrl = 'http://localhost:9080/api/services';

  constructor(private http: HttpClient) {}

  getServices(): Observable<ServiceEntity[]> {
    return this.http.get<ServiceEntity[]>(this.apiUrl);
  }

  // Other methods if needed
}

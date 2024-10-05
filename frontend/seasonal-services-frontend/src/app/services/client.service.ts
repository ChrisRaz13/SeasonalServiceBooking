import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Client } from '../models/client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private apiUrl = 'http://localhost:9080/api/clients';

  constructor(private http: HttpClient) { }

  getAllClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  getClientById(id: number): Observable<Client> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Client>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  addClient(client: Client): Observable<Client> {
    return this.http.post<Client>(this.apiUrl, client)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateClient(id: number, client: Client): Observable<Client> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Client>(url, client)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteClient(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('A client-side or network error occurred:', error.error.message);
    } else {
      console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
    }
    return throwError('Something bad happened; please try again later.');
  }
}

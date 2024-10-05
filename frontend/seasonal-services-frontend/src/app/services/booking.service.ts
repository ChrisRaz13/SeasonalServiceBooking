import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Booking {
  id?: number;
  clientId: number;
  serviceName: string;
  bookingDate: string;
  bookingTime: string;
}

@Injectable({
  providedIn: 'root' // Provides the service at the root level
})
export class BookingService {

  private apiUrl = 'http://localhost:9080/api/bookings'; // Adjust the URL based on your backend API

  constructor(private http: HttpClient) { }

  // Method to get all bookings
  getAllBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.apiUrl);
  }

  // Method to get a booking by ID
  getBookingById(id: number): Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}/${id}`);
  }

  // Method to add a new booking
  addBooking(booking: Booking): Observable<Booking> {
    return this.http.post<Booking>(this.apiUrl, booking);
  }

  // Method to update an existing booking
  updateBooking(id: number, booking: Booking): Observable<Booking> {
    return this.http.put<Booking>(`${this.apiUrl}/${id}`, booking);
  }

  // Method to delete a booking by ID
  deleteBooking(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}

// booking.model.ts
export interface Booking {
  id: number;              // Unique identifier for the booking
  serviceName: string;     // The name of the service
  bookingDate: string;     // The booking date (could use Date type, but string is fine here)
  bookingTime: string;     // The booking time, if relevant
  clientId: number;        // Reference to the client ID
}

export interface Booking {
  id?: number;
  clientId: number;
  serviceId: number;
  bookingDate: string;
  bookingTime: string;
  status?: string;
  comments?: string;

  serviceName?: string;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
}

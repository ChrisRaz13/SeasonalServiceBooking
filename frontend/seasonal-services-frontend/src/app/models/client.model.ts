export interface Client {
  id?: number; // Use '?' to indicate that this field is optional
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
}

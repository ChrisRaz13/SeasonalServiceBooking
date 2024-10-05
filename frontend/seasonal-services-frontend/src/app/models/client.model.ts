export class Client {
  id: number;  // Remove `?` to make it required
  name: string;
  email: string;
  phoneNumber: string;
  address: string;

  constructor(id: number, name: string, email: string, phoneNumber: string, address: string) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.address = address;
  }
}

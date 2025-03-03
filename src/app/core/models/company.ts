import { Address } from "./address";

export class Company {
  id?: number;
  brandName?: string;
  legalName?: string;
  identificationNumber?: string;
  email?: string;
  phoneNumber?: string;
  enabled?: boolean;
  address?: Address;
}

import { Company } from "./company";

export class Consultant {
  id: number = 0;
  identityId?: string;
  companies?: Array<Company>;
  //birthDate?: string;
  //companyId?: number;
  enabled: boolean = true;
  fullName?: string;
  nickname?: string;
  photoUrl?: string;
  //company?: Company;
  userIdentity?: UserApplication;
}

export class UserApplication {
  id?: string;
  accessFailedCount?: number;
  isLockedOut?: boolean;
  email?: string;
  emailConfirmed?: boolean;
  enabled?: boolean;
  phoneNumber?: string;
  roleName?: string;
  userName?: string;
}

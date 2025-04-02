import { WhatsAppConfig } from "./WhatsAppConfig";

export class Integration {
  id!: number;
  companyid!: number;
  name!: string;
  type!: number; //enumerator or string
  whatsAppConfigId!: number;
  whatsAppConfig?: WhatsAppConfig;
}

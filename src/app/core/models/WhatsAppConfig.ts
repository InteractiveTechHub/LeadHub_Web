import { WhatsAppTemplate } from "./whatsAppTemplate";

export class WhatsAppConfig {
  id!: number;
  accessToken!: string;
  businessAccountId!: string;
  phoneNumberId!: string;
  whatsAppTemplates?: Array<WhatsAppTemplate>;
}

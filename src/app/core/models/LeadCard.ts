import { LeadPhase } from "@core/enums/leadPhase";
import { LeadStatus } from "@core/enums/leadStatus";

export class LeadCard {
  consultantId?: number;
  consultantName?: string;
  companyId!: number;
  createdAt!: Date;
  phase!: LeadPhase;
  identifier!: string;
  lastMessage!: string;
  lastMessageDate!: Date;
  leadId?: number;
  leadName?: string;
  phoneNumber?: string;
  email?: string;
  SaleNote?: string;
  status?: LeadStatus;
  timelineId?: number;
}

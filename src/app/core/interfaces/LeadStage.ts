import { LeadCard } from "@core/models";

export interface LeadStage {
  leadId: number;
  leadName: string;
  phoneNumber: string;
  position: number;
  stageId: number;
  leadCard: LeadCard;
}

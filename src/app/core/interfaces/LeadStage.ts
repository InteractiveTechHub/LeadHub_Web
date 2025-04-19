import { LeadCard } from "@core/models";

export interface LeadStage {
  leadId: number;
  position: number;
  pipelineStageId: number;
  leadCard: LeadCard;
}

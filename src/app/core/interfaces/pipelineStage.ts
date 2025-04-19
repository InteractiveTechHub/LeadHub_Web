import { LeadStage } from "./LeadStage";

export interface PipelineStage {
  id: number;
  title: string;
  position: number;
  pipelineId: number;
  leads: LeadStage[];
}

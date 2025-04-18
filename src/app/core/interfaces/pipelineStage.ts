import { LeadStage } from "./LeadStage";

export interface PipelineStage {
  id: number;
  title: string;
  stageOrder: number;
  pipelineId: number;
  leads: LeadStage[];
}

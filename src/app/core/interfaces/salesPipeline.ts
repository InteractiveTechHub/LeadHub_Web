import { PipelineStage } from "./pipelineStage";

export interface SalesPipeline {
  id: number;
  companyId: number;
  consultantId: number;
  name: string;
  position: number;
  stages: PipelineStage[];
}

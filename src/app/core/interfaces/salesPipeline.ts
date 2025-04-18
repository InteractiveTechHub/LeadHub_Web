import { PipelineStage } from "./pipelineStage";

export interface SalesPipeline {
  id: number;
  name: string;
  stages: PipelineStage[];
}

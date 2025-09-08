import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SalesPipeline } from "@core/interfaces";
import { LeadStage } from "@core/interfaces/LeadStage";
import { FilterRequest } from "@core/requests";
import { ModelResponse } from "@core/responses";
import { SalesPipelineResponse } from "@core/responses/SalesPipelineResponse";
import { environment } from "@environment/environment";
import { Observable } from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class SalesPipelineRepository {
  private baseUrl = `${environment.apiUrl}/${environment.apiVersion}/salespipeline`;

  constructor(private httpClient: HttpClient) { }

  /**
   * Creates a new sales pipeline
   * @param salesPipeline - The sales pipeline data to create
   * @returns Observable with sales pipeline response data
   */
  createSalesPepilineByRequest(salesPipeline: SalesPipeline) : Observable<SalesPipelineResponse> {
    return this.httpClient.post<SalesPipelineResponse>(`${this.baseUrl}`, salesPipeline);
  }

  /**
   * Fetches a sales pipeline by its ID
   * @param id - The ID of the sales pipeline
   * @returns Observable with sales pipeline data
   */
  fetchSalesPepilineById(id: number) : Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/${id}`);
  }

  /**
   * Fetches sales pipelines based on filter criteria
   * @param filterRequest - Filter criteria for sales pipelines
   * @returns Observable with sales pipeline response data
   */
  fetchSalesPepilineByRequest(filterRequest: FilterRequest) : Observable<SalesPipelineResponse> {
    return this.httpClient.post<SalesPipelineResponse>(`${this.baseUrl}/fetch-pipelines`, filterRequest);
  }

  /**
   * Updates lead stages for a specific stage
   * @param leadStage - Array of lead stages to update
   * @param stageId - The ID of the stage (optional)
   * @returns Observable with model response data
   */
  updateLeadStage(leadStage: LeadStage[], stageId: number | null) : Observable<ModelResponse> {
    const url = stageId !== null ? `${this.baseUrl}/leadStage?stageId=${stageId}` : `${this.baseUrl}/leadStage`;

    return this.httpClient.put<ModelResponse>(`${url}`, leadStage);
  }

  /**
   * Updates multiple sales pipelines
   * @param pipelines - Array of sales pipelines to update
   * @returns Observable with model response data
   */
  updateSalesPepilines(pipelines: SalesPipeline[]) : Observable<ModelResponse> {
    return this.httpClient.put<ModelResponse>(`${this.baseUrl}`, pipelines);
  }
}

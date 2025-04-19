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

  createSalesPepilineByRequest(salesPipeline: SalesPipeline) : Observable<SalesPipelineResponse> {
    return this.httpClient.post<SalesPipelineResponse>(`${this.baseUrl}`, salesPipeline);
  }

  fetchSalesPepilineById(id: number) : Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/${id}`);
  }

  fetchSalesPepilineByRequest(filterRequest: FilterRequest) : Observable<SalesPipelineResponse> {
    return this.httpClient.post<SalesPipelineResponse>(`${this.baseUrl}/fetch-pipelines`, filterRequest);
  }

  updateLeadStage(leadStage: LeadStage[], stageId: number | null) : Observable<ModelResponse> {
    const url = stageId !== null ? `${this.baseUrl}/leadStage?stageId=${stageId}` : `${this.baseUrl}/leadStage`;

    return this.httpClient.put<ModelResponse>(`${url}`, leadStage);
  }

  updateSalesPepilines(pipelines: SalesPipeline[]) : Observable<ModelResponse> {
    return this.httpClient.put<ModelResponse>(`${this.baseUrl}`, pipelines);
  }
}

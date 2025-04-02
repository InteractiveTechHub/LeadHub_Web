import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FilterRequest } from "@core/requests";
import { IntegrationResponse } from "@core/responses/integrationResponse";
import { environment } from "@environment/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class WhatsAppRepository {
  private baseUrl = `${environment.apiUrl}/${environment.apiVersion}/whatsapp`;

  constructor(private httpClient: HttpClient) { }

  fetchWhatsAppByRequest(filterRequest: FilterRequest) : Observable<IntegrationResponse> {
    return this.httpClient.post<IntegrationResponse>(`${this.baseUrl}`, filterRequest);
  }
}

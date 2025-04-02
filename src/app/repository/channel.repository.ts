import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FilterRequest } from '@core/requests';
import { IntegrationResponse } from '@core/responses/integrationResponse';
import { environment } from '@environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChannelRepository {
  private baseUrl = `${environment.apiUrl}/${environment.apiVersion}/integration`;

  constructor(private httpClient: HttpClient) { }

  fetchChannelsByRequest(filterRequest: FilterRequest) : Observable<IntegrationResponse> {
    return this.httpClient.post<IntegrationResponse>(`${this.baseUrl}`, filterRequest);
  }
}

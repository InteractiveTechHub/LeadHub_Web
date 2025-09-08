import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Consultant } from '@core/models';
import { FilterRequest } from '@core/requests';
import { ConsultantResponse } from '@core/responses';
import { environment } from '@environment/environment';
import { filter, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsultantRepository {
  private baseUrl = `${environment.apiUrl}/${environment.apiVersion}/consultant`;

  constructor(private httpClient: HttpClient) { }

  /**
   * Creates a new consultant
   * @param consultant - The consultant data to create
   * @returns Observable with the response
   */
  createConsultant(consultant: Consultant) {
    return this.httpClient.post(`${this.baseUrl}`, consultant);
  }

  /**
   * Fetches consultants based on filter criteria
   * @param filterRequest - Filter criteria for consultants
   * @returns Observable with consultant response data
   */
  fetchConsultantByRequest(filterRequest: FilterRequest) : Observable<ConsultantResponse> {
    return this.httpClient.post<ConsultantResponse>(`${this.baseUrl}/fetchall`, filterRequest);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Consultant } from '@core/models';
import { FilterRequest } from '@core/requests';
import { CompanyResponse, ConsultantResponse } from '@core/responses';
import { environment } from '@environment/environment';
import { filter, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsultantService {
  private baseUrl = `${environment.apiUrl}/${environment.apiVersion}/consultant`;

  constructor(private httpClient: HttpClient) { }

  createConsultant(consultant: Consultant) {
    return this.httpClient.post(`${this.baseUrl}`, consultant);
  }

  fetchConsultantByRequest(filterRequest: FilterRequest) : Observable<ConsultantResponse> {
    return this.httpClient.post<ConsultantResponse>(`${this.baseUrl}/fetchall`, filterRequest);
  }
}

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Timeline } from '@core/models';
import { FilterRequest } from '@core/requests';
import { WhatsAppTemplateResponseDto } from '@core/responses';
import { TimelineResponse } from '@core/responses/timelineResponse';
import { environment } from '@environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeadManagerService {
  private baseUrl = `${environment.apiUrl}/${environment.apiVersion}`;

  constructor(private httpClient: HttpClient) { }

  fetchLeadManagerCardsByRequest(filterRequest: FilterRequest) : Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/leadmanager/leadCards`, filterRequest);
  }

  fetchLeadManagerTimelineByRequest(timelineId: number, filterRequest: FilterRequest) : Observable<TimelineResponse> {
    return this.httpClient.post<TimelineResponse>(`${this.baseUrl}/timeline/${timelineId}`, filterRequest);
  }

  fetchTemplatesByLeadId(leadId: number) : Observable<WhatsAppTemplateResponseDto> {
     const params = new HttpParams()
      .set('leadId', leadId);

    return this.httpClient.get<WhatsAppTemplateResponseDto>(`${this.baseUrl}/leadmanager/templates`, { params });
  }

  SendMessageToClient(timeline: Timeline) : Observable<TimelineResponse> {
    return this.httpClient.post<TimelineResponse>(`${this.baseUrl}/timeline/register`, timeline);
  }
}

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LeadCard, Timeline } from '@core/models';
import { FilterRequest, ManagerFilterRequest } from '@core/requests';
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

  closeLead(leadCard: LeadCard) : Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/leadmanager/close-lead`, leadCard);
  }

  fetchLeadManagerCardsByRequest(managerFilter: ManagerFilterRequest) : Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/leadmanager/leadCards`, managerFilter);
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

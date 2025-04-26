import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LeadCard, Timeline } from '@core/models';
import { FilterRequest, ManagerFilterRequest } from '@core/requests';
import { WhatsAppTemplateResponseDto } from '@core/responses';
import { TimelineResponse } from '@core/responses';
import { environment } from '@environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeadManagerRepository {
  private baseUrl = `${environment.apiUrl}/${environment.apiVersion}`;

  constructor(private httpClient: HttpClient) { }

  // These are lead events
  closeLead(leadCard: LeadCard) : Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/leadmanager/close-lead`, leadCard);
  }

  fetchLeadManagerCardsByRequest(managerFilter: ManagerFilterRequest) : Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/leadmanager/leadCards`, managerFilter);
  }

  fetchTemplatesByLeadId(leadId: number) : Observable<WhatsAppTemplateResponseDto> {
     const params = new HttpParams()
      .set('leadId', leadId);

    return this.httpClient.get<WhatsAppTemplateResponseDto>(`${this.baseUrl}/leadmanager/templates`, { params });
  }

  //TODO: These are timeline events
  fetchLeadManagerTimelineByRequest(timelineId: number, filterRequest: FilterRequest) : Observable<TimelineResponse> {
    return this.httpClient.post<TimelineResponse>(`${this.baseUrl}/timeline/${timelineId}`, filterRequest);
  }

  SendMessageToClient(timeline: Timeline) : Observable<TimelineResponse> {
    return this.httpClient.post<TimelineResponse>(`${this.baseUrl}/timeline/sendMessage`, timeline);
  }

  sendFiles(formData: FormData, leadId: number) : Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/timeline/upload/${leadId}`, formData);
  }
}

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

  /**
   * Closes a lead by sending the lead card data
   * @param leadCard - The lead card to close
   * @returns Observable with the response
   */
  closeLead(leadCard: LeadCard) : Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/leadmanager/close-lead`, leadCard);
  }

  /**
   * Fetches lead manager cards based on filter criteria
   * @param managerFilter - Filter criteria for lead cards
   * @returns Observable with lead cards data
   */
  fetchLeadManagerCardsByRequest(managerFilter: ManagerFilterRequest) : Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/leadmanager/leadCards`, managerFilter);
  }

  /**
   * Fetches WhatsApp templates available for a specific lead
   * @param leadId - The ID of the lead
   * @returns Observable with WhatsApp templates data
   */
  fetchTemplatesByLeadId(leadId: number) : Observable<WhatsAppTemplateResponseDto> {
     const params = new HttpParams()
      .set('leadId', leadId);

    return this.httpClient.get<WhatsAppTemplateResponseDto>(`${this.baseUrl}/leadmanager/templates`, { params });
  }

  /**
   * Fetches timeline data for a specific lead with filter criteria
   * @param timelineId - The ID of the timeline
   * @param filterRequest - Filter criteria for timeline data
   * @returns Observable with timeline response data
   */
  fetchLeadManagerTimelineByRequest(timelineId: number, filterRequest: FilterRequest) : Observable<TimelineResponse> {
    return this.httpClient.post<TimelineResponse>(`${this.baseUrl}/timeline/${timelineId}`, filterRequest);
  }

  /**
   * Sends a message to a client through the timeline
   * @param timeline - The timeline object containing message data
   * @returns Observable with the response
   */
  SendMessageToClient(timeline: Timeline) : Observable<TimelineResponse> {
    return this.httpClient.post<TimelineResponse>(`${this.baseUrl}/timeline/sendMessage`, timeline);
  }

  /**
   * Uploads files for a specific lead
   * @param formData - Form data containing the files to upload
   * @param leadId - The ID of the lead
   * @returns Observable with the upload response
   */
  sendFiles(formData: FormData, leadId: number) : Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/timeline/upload/${leadId}`, formData);
  }
}

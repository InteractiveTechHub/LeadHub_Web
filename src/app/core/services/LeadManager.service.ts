import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Timeline } from '@core/models';
import { FilterRequest } from '@core/requests';
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

  SendMessageToClient(timeline: Timeline) : Observable<TimelineResponse> {
    return this.httpClient.post<TimelineResponse>(`${this.baseUrl}/timeline/register`, timeline);
  }
}

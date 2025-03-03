import { Injectable } from '@angular/core';
import { AuthService } from '@authentication/services';
import { LeadCard } from '@core/models';
import { environment } from '@environment/environment';
import { HubConnection, HubConnectionBuilder, HttpTransportType } from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  private hubConnection!: HubConnection;
  private leadSubject = new BehaviorSubject<void | null>(null);
  public lead$ = this.leadSubject.asObservable();

  constructor(private authService: AuthService) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${environment.apiBase}/leadhub`, {
        accessTokenFactory: () => this.authService.getAuthorizationToken() ?? '',
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets
      })
      .withAutomaticReconnect()
      .build();

    this.startConnection();
  }

  private startConnection() {
    this.hubConnection.start()
      .then(() => console.log('SignalR connection established'))
      .catch(err => console.log('Error while starting connection: ' + err));
  }

  public receiveNewLead() {
    // listen message "newLead"
    this.hubConnection.on('newLead', () => {
      this.leadSubject.next();
    });
  }

  public receiveNewMessage() {
    this.hubConnection.on('newMessage', () => {
      this.leadSubject.next();
    });
  }
}

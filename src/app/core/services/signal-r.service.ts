import { Injectable } from '@angular/core';
import { AuthService } from '@authentication/services';
import { LeadCard } from '@core/models';
import { environment } from '@environment/environment';
import { HubConnection, HubConnectionBuilder, HttpTransportType, LogLevel } from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  private hubConnection!: HubConnection;
  private chatMessagesSubject = new BehaviorSubject<void | null>(null);
  private leadSubject = new BehaviorSubject<void | null>(null);

  public chatMessages$ = this.chatMessagesSubject.asObservable();
  public lead$ = this.leadSubject.asObservable();

  constructor(private authService: AuthService) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${environment.apiBase}/leadhub`, {
        accessTokenFactory: () => this.authService.getAuthorizationToken() ?? '',
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets
      })
      .configureLogging(LogLevel.None)
      .withAutomaticReconnect()
      .build();

    this.startConnection();
  }

  private startConnection() {
    this.hubConnection.start()
      .catch(err => console.log('Error while starting connection: ' + err));
  }

  public receiveNewLead() {
    // listen message "newLead"
    this.hubConnection.on('newLead', () => {
      this.leadSubject.next();
    });
  }

  public joinLeadChat(leadId: string) {
    this.hubConnection.invoke('JoinLeadChatGroup', leadId)
      .catch(err => console.error('Erro ao entrar no grupo do lead:', err));

      this.receiveNewMessage();
  }

  public leaveLeadChat(leadId: string) {
    this.hubConnection.invoke('LeaveLeadChatGroup', leadId)
      .catch(err => console.error('Erro ao sair do grupo do lead:', err));
  }

  private receiveNewMessage() {
    this.hubConnection.on('newMessage', () => {
      this.chatMessagesSubject.next();
    });
  }
}

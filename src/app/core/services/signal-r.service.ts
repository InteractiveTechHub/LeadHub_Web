import { Injectable } from '@angular/core';
import { AuthService } from '@authentication/services';
import { environment } from '@environment/environment';
import { HubConnection, HubConnectionBuilder, HttpTransportType, LogLevel, HubConnectionState } from '@microsoft/signalr';
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

  private lastLeadIdentifier: string | null = null;

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
    this.reconnect();
  }

  /**
  * Subscribe to real-time lead events
  */
  public receiveNewLead() {
    this.hubConnection.on('newLead', () => {
      this.leadSubject.next();
    });
  }

  private startConnection() {
    this.hubConnection.start()
      .catch(err => console.log('Error while starting connection: ' + err));
  }

  private reconnect() {
    this.hubConnection.onreconnected(() => {
      // Important: re-subscribe after reconnection
      this.receiveNewMessage();

      // If needed, re-join the group for the last active lead
      if (this.lastLeadIdentifier) {
        this.joinLeadChat(this.lastLeadIdentifier);
      }
    });
  }

  /**
   * Join the chat group to receive real-time messages
   * @param leadIdentifier UUID of the lead to identify the chat
  */
  public joinLeadChat(leadIdentifier: string) {
    this.lastLeadIdentifier = leadIdentifier;

    this.hubConnection.invoke('JoinLeadChatGroup', leadIdentifier)
      .catch(err => console.error('Erro ao entrar no grupo do lead:', err));

    this.receiveNewMessage();
  }

  /**
   * Leave the chat group to stop receiving messages
   * @param leadIdentifier UUID of the lead to identify the chat
   * @param leadId Numerical ID of the lead
   */
  public leaveLeadChat(leadIdentifier: string, leadId: number) {
    this.hubConnection.invoke('LeaveLeadChatGroup', leadIdentifier, leadId)
      .catch(err => console.error('Erro ao sair do grupo do lead:', err));
  }

  /**
   * Subscribe to new messages in real-time
   */
  private receiveNewMessage() {
    this.hubConnection.on('newMessage', () => {
      console.log('estou no signalR Receive New Message')
      this.chatMessagesSubject.next();
    });
  }
}

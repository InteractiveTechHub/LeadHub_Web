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

  /**
   * Receive lead in real time
   */
  public receiveNewLead() {
    this.hubConnection.on('newLead', () => {
      this.leadSubject.next();
    });
  }

  /**
   * Start to listen the chat session for realtime communication
   * @param leadIdentifier lead uuid to refer the chat
   */
  public joinLeadChat(leadIdentifier: string) {
    this.hubConnection.invoke('JoinLeadChatGroup', leadIdentifier)
      .catch(err => console.error('Erro ao entrar no grupo do lead:', err));

    this.receiveNewMessage();
  }

  /**
   * Stop listen the chat session for realtime communication
   * @param leadIdentifier lead uuid to refer the chat
   */
  public leaveLeadChat(leadIdentifier: string) {
    this.hubConnection.invoke('LeaveLeadChatGroup', leadIdentifier)
      .catch(err => console.error('Erro ao sair do grupo do lead:', err));
  }

  /**
   * start to listen the new messages
   */
  private receiveNewMessage() {
    this.hubConnection.on('newMessage', () => {
      this.chatMessagesSubject.next();
    });
  }
}

import { Injectable } from '@angular/core';
import { Timeline } from '@core/models';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatMessageService {
  private messageSubject = new BehaviorSubject<Timeline | null>(null);
  private filesSubject = new BehaviorSubject<any | null>(null);
  private leadCardSubject = new BehaviorSubject<void | null>(null);
  private chatMessageToolBoxSubject = new BehaviorSubject<boolean>(true);

  messages$ = this.messageSubject.asObservable();
  leadCard$ = this.leadCardSubject.asObservable();
  filesTosend$ = this.filesSubject.asObservable();
  chatMessageToolBox$ = this.chatMessageToolBoxSubject.asObservable();

  constructor() { }

  /**
   * Sends a timeline message to subscribers
   * @param timeline - The timeline object containing message data
   */
  sendMessage(timeline: Timeline) {
    this.messageSubject.next(timeline);
  }

  /**
   * Sends files to subscribers for upload
   * @param file - The file object to be sent
   */
  sendFiles(file: any) {
    this.filesSubject.next(file);
  }

  /**
   * Triggers an update event for lead cards
   */
  updateLeadsCard() {
    this.leadCardSubject.next();
  }

  /**
   * Updates the chat message toolbox visibility state
   * @param canSendMessage - Boolean indicating if messages can be sent
   */
  updateChatMessageToolBox(canSendMessage: boolean) {
    this.chatMessageToolBoxSubject.next(canSendMessage);
  }
}

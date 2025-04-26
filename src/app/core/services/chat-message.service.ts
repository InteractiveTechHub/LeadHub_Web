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

  sendMessage(timeline: Timeline) {
    this.messageSubject.next(timeline);
  }

  sendFiles(file: any) {
    this.filesSubject.next(file);
  }

  updateLeadsCard() {
    this.leadCardSubject.next();
  }

  updateChatMessageToolBox(canSendMessage: boolean) {
    this.chatMessageToolBoxSubject.next(canSendMessage);
  }
}

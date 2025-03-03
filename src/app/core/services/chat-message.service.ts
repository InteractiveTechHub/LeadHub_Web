import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatMessageService {
  private messageSubject = new BehaviorSubject<string>('');
  private leadCardSubject = new BehaviorSubject<void | null>(null);
  messages$ = this.messageSubject.asObservable();
  leadCard$ = this.leadCardSubject.asObservable();

  constructor() { }

  sendMessage(message: string) {
    this.messageSubject.next(message);
  }

  updateLeadsCard() {
    this.leadCardSubject.next();
  }
}

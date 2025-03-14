import { DatePipe, NgClass, NgStyle } from '@angular/common';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ScrollingModule, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { isSameDay, parseISO } from 'date-fns';

import { MessageText, Timeline } from '@core/models';
import { FilterRequest } from '@core/requests';
import { LeadManagerService, SignalRService } from '@core/services';
import { PRIME_NG_MODULES } from '@core/utils';
import { ChatMessageService } from '@core/services/chat-message.service';
import { DateFormaterService } from '@core/services/date-formater.service';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss',
  imports: [
    ...PRIME_NG_MODULES,
    NgStyle,
    NgClass,
    ScrollingModule],
  providers: [DateFormaterService],
})
export class TimelineComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('scrollViewport', { static: false }) scrollViewport!: CdkVirtualScrollViewport;

  @Input() leadId!: number;
  @Input() leadIdentifier!: string;

  timelines!: Timeline[];
  isLoadingTimeline = false;

  constructor(
    private chatService: ChatMessageService,
    private dateService: DateFormaterService,
    private datePipe: DatePipe,
    private leadService: LeadManagerService,
    private signalReService: SignalRService) { }

  ngOnDestroy(): void {
    this.signalReService.leaveLeadChat(this.leadIdentifier);
  }

  ngOnInit(): void {
    this.signalReService.chatMessages$.subscribe(() => {
      this.loadMessages();
    });

    this.chatService.messages$.subscribe((message: string) => {
      if (!message) return;

      const timeline = new Timeline();
      timeline.leadId = this.leadId;
      timeline.sender = 2;
      timeline.type = 1;
      timeline.status = 1;
      timeline.messageDate = new Date();

      // apply logic depending of type;
      timeline.message = new MessageText();
      timeline.message!.body = message;

      //update the ui
      this.timelines = [...this.timelines ?? [], timeline];

      this.RegisterTimelineAndSendMessage(timeline);

      this.scrollToBottom();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['leadId'] && this.leadId) {
      if (changes['leadIdentifier'].previousValue) {
        this.signalReService.leaveLeadChat(String(changes['leadIdentifier'].previousValue));
      }

      this.signalReService.joinLeadChat(this.leadIdentifier);

      this.loadMessages();
    }
  }

  extractHour(data: Date) {
    return this.datePipe.transform(data, 'HH:mm');
  }

  onScroll() {
    //TODO: apply pagination
    if (!this.scrollViewport || this.isLoadingTimeline) return;

    const scrollTop = this.scrollViewport.measureScrollOffset();

    // scroll near to the top, call more messages (pagination)
    if (scrollTop < 50) {
      //this.loadMessages();
    }
  }

  private loadMessages() {
    this.isLoadingTimeline = true;

    const filter = new FilterRequest();
    const response = this.leadService.fetchLeadManagerTimelineByRequest(this.leadId, filter)

    response.subscribe(r => {
      if (r.responseData.length) {
        this.timelines = r.responseData;

        this.messageDateDivider(this.timelines!);

        this.scrollToBottom();
      }

      this.isLoadingTimeline = false;
    });
  }

  private messageDateDivider(timelines: Array<Timeline>) {
    let lastDate: Date | null = null;
    timelines?.forEach((msg: Timeline) => {
      const currentDate = typeof msg.messageDate === 'string' ? parseISO(msg.messageDate) : msg.messageDate;

      msg.messageDateDivider = !lastDate || !isSameDay(currentDate, lastDate) ? this.dateService.getDateLabel(currentDate, true) : '';

      lastDate = currentDate;
    });

    return timelines;
  }

  private RegisterTimelineAndSendMessage(timeline: Timeline) {
    const response = this.leadService.SendMessageToClient(timeline);

    response.subscribe(response => {

      // update the message sent by the index
      const index = this.timelines.findIndex(msg => msg.message!.body === timeline.message!.body);

      if (index !== -1) {
        this.timelines[index] = response.model!;
      }

      this.messageDateDivider(this.timelines!);

      this.chatService.updateLeadsCard();
    });
  }

  private scrollToBottom() {
    if (this.scrollViewport) {
      setTimeout(() => {
        this.scrollViewport.scrollTo({
          bottom: 0,
          behavior: 'smooth',
        });
      }, 100);
    }
  }
}


import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { ChatMessageService } from '@core/services/chat-message.service';
import { LeadCard } from '@core/models';
import { FilterRequest } from '@core/requests';
import { LeadManagerService, SignalRService } from '@core/services';
import { PRIME_NG_MODULES } from '@core/utils';

import { TimelineComponent } from "./timeline/timeline.component";
import { ChatInputMessageComponent } from "./chat-input-message/chat-input-message.component";
import { DateFormaterService } from '@core/services/date-formater.service';


@Component({
  selector: 'app-leads-manager',
  imports: [...PRIME_NG_MODULES,
    TimelineComponent,
    ChatInputMessageComponent,
    ScrollingModule],
  providers: [DatePipe, DateFormaterService],
  templateUrl: './leads-manager.component.html',
  styleUrl: './leads-manager.component.scss',
})
export class LeadsManagerComponent implements OnInit {
  leadCards = new Array<LeadCard>();
  filterRequest = new FilterRequest();
  selectedCard?: LeadCard;

  isLoading: boolean = false;

  constructor(public managerService: LeadManagerService,
    private chatService: ChatMessageService,
    private dateService: DateFormaterService,
    private signalReService: SignalRService,
    private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.filterRequest.pageSize = 20;
    this.filterRequest.skip = 0;

    this.signalReService.receiveNewLead();

    this.signalReService.lead$.subscribe(() => {
      this.loadLeadCardList();
    });

    this.chatService.leadCard$.subscribe(() => {
      this.loadLeadCardList();
    });
  }

  DateFormat(data: Date) {
    return this.datePipe.transform(data, 'dd/MM/yyyy HH:mm');
  }

  DateFormatMessage(date: Date) {
   return this.dateService.getDateLabel(date);
  }

  getCardStyles(item: any): { [key: string]: string } {
    const isSelected = item.leadId === this.selectedCard?.leadId;

    return {
      height: '100px',
      border: isSelected ? '2px solid #007bff' : 'none',
      transform: isSelected ? 'scale(1.02)' : 'none',
      backgroundColor: isSelected ? '#e7f0ff' : '#fff',
      boxShadow: isSelected ? '0px 4px 12px rgba(0, 0, 255, 0.3)' : ''
    };
  }

  onScroll(index: any) {
    // TODO: Apply pagination
    /*if (index > this.leadCards.length - 10 && !this.isLoading) {
      this.loadLeadCardList();
    }*/
  }

  selecionarCard(leadCard: LeadCard) {
    this.selectedCard = leadCard;
  }

  private loadLeadCardList() {
    if (this.isLoading) return;
    this.isLoading = true;

    const response = this.managerService.fetchLeadManagerCardsByRequest(this.filterRequest);

    response.subscribe((r: any) => {
      if (r.responseData) {
        this.leadCards = [];
        this.leadCards = [...this.leadCards, ...r.responseData];
      }

      this.isLoading = false;
    });
  }
}

import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { TemplatesPerType } from '@core/Dtos';
import { LeadPhaseMetadata } from '@core/enums';
import { LeadCard } from '@core/models';
import { FilterRequest, ManagerFilterRequest } from '@core/requests';
import { SignalRService, ChatMessageService, DateFormaterService } from '@core/services';
import { PRIME_NG_MODULES } from '@core/utils';

import { LeadDetailsComponent, TimelineComponent, ChatInputMessageComponent } from "./index";
import { MenuItem } from 'primeng/api';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { LeadManagerRepository } from '@repository/index';


@Component({
  selector: 'app-leads-manager',
  imports: [...PRIME_NG_MODULES,
    TimelineComponent,
    ScrollingModule,
    ReactiveFormsModule,
    ChatInputMessageComponent,
    TimelineComponent,
    LeadDetailsComponent],
  providers: [DatePipe, DateFormaterService],
  templateUrl: './leads-manager.component.html',
  styleUrl: './leads-manager.component.scss',
})
export class LeadsManagerComponent implements OnInit {
  leadCards = new Array<LeadCard>();
  filterRequest = new FilterRequest();
  selectedCard?: LeadCard;
  templates!: TemplatesPerType[];

  isLoading: boolean = false;

  filtroControl = new FormControl('');

  leadPhaseMetadata = LeadPhaseMetadata;
  managerFilterRequest = new ManagerFilterRequest();
  sortSelectedText = "Leads mais recentes";

  items: MenuItem[] = [
    {
      label: 'Ordenar por',
      items: [
        {
          label: 'Interação mais recente',
          command: () => {
            this.managerFilterRequest.clearSortFilter();
            this.managerFilterRequest.isInteractionDesc = true;
            this.sortSelectedText = 'Interação mais recente';
            this.loadLeadCardList();
          }
        },
        {
          label: 'Interação mais antiga',
          command: () => {
            this.managerFilterRequest.clearSortFilter();
            this.managerFilterRequest.isInteractionAsc = true;
            this.sortSelectedText = 'Interação mais antiga';
            this.loadLeadCardList();
          }
        },
        {
          label: 'Leads mais recentes',
          command: () => {
            this.managerFilterRequest.clearSortFilter();
            this.managerFilterRequest.isLeadCreatedAtDesc = true;
            this.sortSelectedText = 'Leads mais recentes';
            this.loadLeadCardList();
          }
        },
        {
          label: 'Lead mais antigos',
          command: () => {
            this.managerFilterRequest.clearSortFilter();
            this.managerFilterRequest.isLeadCreatedAtAsc = true;
            this.sortSelectedText = 'Lead mais antigos';
            this.loadLeadCardList();
          }
        }
      ]
    }
  ];

  constructor(
    public managerRepository: LeadManagerRepository,
    private chatService: ChatMessageService,
    private dateService: DateFormaterService,
    private signalReService: SignalRService,
    private datePipe: DatePipe) {}

  /**
   * Initializes the component and sets up subscriptions
   */
  ngOnInit(): void {
    this.filterRequest.pageSize = 20;
    this.filterRequest.skip = 0;

    this.signalReService.receiveNewLead();

    this.signalReService.lead$.subscribe(() => {
      this.loadLeadCardList();
    });

    // TODO: Should update the lead card without call the api
    this.chatService.leadCard$.subscribe(() => {
      this.loadLeadCardList();
    });

    this.filtroControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.managerFilterRequest.globalFilter = value ?? "";
        this.loadLeadCardList();
      });
  }

  /**
   * Formats a date to display format
   * @param data - The date to format
   * @returns Formatted date string
   */
  DateFormat(data: Date) {
    return this.datePipe.transform(data, 'dd/MM/yyyy HH:mm');
  }

  /**
   * Formats a date for message display
   * @param date - The date to format
   * @returns Formatted date label
   */
  DateFormatMessage(date: Date) {
   return this.dateService.getDateLabel(date);
  }

  /**
   * Gets the CSS styles for a lead card based on selection state
   * @param item - The lead card item
   * @returns Object containing CSS styles
   */
  getCardStyles(item: any): { [key: string]: string } {
    const isSelected = item.leadId === this.selectedCard?.leadId;

    return {
      //height: '100px',
      border: isSelected ? '2px solid #007bff' : 'none',
      transform: isSelected ? 'scale(1.02)' : 'none',
      //backgroundColor: isSelected ? '#e7f0ff' : '#fff',
      boxShadow: isSelected ? '0px 4px 12px rgba(0, 0, 255, 0.3)' : ''
    };
  }

  /**
   * Handles scroll events for pagination (currently disabled)
   * @param index - The scroll index
   */
  onScroll(index: any) {
    // TODO: Apply pagination
    /*if (index > this.leadCards.length - 10 && !this.isLoading) {
      this.loadLeadCardList();
    }*/
  }

  /**
   * Selects a lead and loads its templates
   * @param leadCard - The lead card to select
   */
  selectLead(leadCard: LeadCard) {
    const response = this.managerRepository.fetchTemplatesByLeadId(leadCard.leadId!);
    response.subscribe(res => {
      this.templates = res.responseData;
      this.selectedCard = leadCard;
    });
  }

  /**
   * Loads the list of lead cards from the API
   * @private
   */
  private loadLeadCardList() {
    if (this.isLoading) return;
    this.isLoading = true;

    const response = this.managerRepository.fetchLeadManagerCardsByRequest(this.managerFilterRequest);

    response.subscribe((r: any) => {
      if (r.responseData) {
        this.leadCards = [];
        this.leadCards = [...this.leadCards, ...r.responseData];
      }

      this.isLoading = false;
    });
  }
}

import { AfterViewInit, ChangeDetectorRef, Component, signal, ViewChild } from '@angular/core';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg, EventApi, EventClickArg } from '@fullcalendar/core';
import allLocales from '@fullcalendar/core/locales-all';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-calendar',
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements AfterViewInit {
  @ViewChild('calendar') calendarRef!: FullCalendarComponent;

  currentEvents = signal<EventApi[]>([]);
  calendarVisible = signal(true);

  calendarOptions = signal<CalendarOptions>({
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    initialView: 'dayGridMonth',
    locales: allLocales,
    locale: 'pt-br',
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    fixedWeekCount: false,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    eventAdd: () => {},
    eventChange: () => {},
    eventRemove: () => {},
    events: [
      { title: 'Meeting', start: new Date() },
      {
        title: 'Reunião com João',
        start: new Date().toISOString().split('T')[0] + 'T10:00:00',
        end: new Date().toISOString().split('T')[0] + 'T11:00:00'
      },
      {
        title: 'Chamada com Ana',
        start: new Date().toISOString().split('T')[0] + 'T14:00:00',
      },
    ]
  });

  constructor(private changeDetector: ChangeDetectorRef, private translate: TranslateService) {
      this.translate.onLangChange.subscribe(langEvent => {
        this.calendarOptions.update(opts => ({
          ...opts,
          locale: langEvent.lang
        }));
      });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
    this.calendarRef.getApi().render(); // força renderização correta
  }, 0);
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    const title = prompt('Please enter a new title for your event');
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      });
    }
  }

  handleEventClick(clickInfo: EventClickArg) {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove();
    }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents.set(events);
    this.changeDetector.detectChanges(); // workaround for pressionChangedAfterItHasBeenCheckedError
  }
}

// Temporario, só para testar
let eventGuid = 0;
export function createEventId() {
  return String(eventGuid++);
}

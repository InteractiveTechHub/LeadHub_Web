import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { differenceInDays, isSameDay, subDays } from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class DateFormaterService {

  constructor(private datePipe: DatePipe, private translate: TranslateService) {}

  /**
   * Formats a date into a human-readable label based on relative time
   * @param date - The date to format
   * @param isShowToday - Whether to show "Today" label for today's date
   * @returns Formatted date string (time, "Today", "Yesterday", weekday, or full date)
   */
  getDateLabel(date: Date, isShowToday: boolean = false) {
    const today = new Date();
    const messageDate = new Date(date);
    const diffDays = differenceInDays(today, messageDate);

    // shows only hours
    if (isSameDay(today, messageDate) && !isShowToday) {
      return this.datePipe.transform(messageDate, 'HH:mm') ?? '';
    }

    if (isSameDay(today, messageDate) && isShowToday) {
      return this.translate.instant('date.today');
    }

    // is Yesterday
    if (isSameDay(messageDate, subDays(new Date(), 1))) {
      return this.translate.instant('date.yesterday');
    }

    // shows the week name
    if (diffDays < 7) {
      return this.datePipe.transform(messageDate, 'EEEE') ?? '';
    }

    // shows only the date
    return this.datePipe.transform(messageDate, 'dd/MM/yyyy') ?? '';
  }
}

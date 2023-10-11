import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { Constants } from '@app/constant/app-constants';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(
    private datePipe: DatePipe
  ) { }

  /**
   * Gets the date of birth
   * @param timestamp
   * @returns
   */
  getDob(timestamp: number): string {
    if (timestamp && timestamp < new Date().getTime()) {
      const date = this.datePipe.transform(timestamp, Constants.DATE_TIME_FORMATS.format_2)
      return date || Constants.NOT_AVAILABLE;;
    }
    return Constants.NOT_AVAILABLE;
  }


}

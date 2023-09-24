import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingsService {

  constructor() { }

  getSlotInfo(slotID: string): Observable<any> {
    return of([]).pipe(delay(3000));
  }

  getBookings(): Observable<any> {
    return of([]).pipe(delay(3000));
  }
}

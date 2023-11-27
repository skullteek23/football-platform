import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorageProperties } from '@app/constant/constants';
import { IUser } from '@app/models/user.model';
import { PaymentService } from '@app/services/payment.service';
import { SessionStorageService } from '@app/services/session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class MatchBookingService {

  constructor(
    private sessionStorage: SessionStorageService,
    private router: Router,
    private paymentService: PaymentService
  ) { }

  /**
   * Continues to the next step
   */
  continue(data: any): void {
    this.sessionStorage.set(SessionStorageProperties.USER_GROUND_SELECTION, data);
    if (data.slotId && data.facilityId) {
      this.router.navigate(['/m', 'book-match', 'pay']);
    } else {
      console.log('Invalid selection data!');
    }
  }

  /**
   * Called after payment capture
   */
  onPayment() {
    return this.paymentService.book()
  }
}

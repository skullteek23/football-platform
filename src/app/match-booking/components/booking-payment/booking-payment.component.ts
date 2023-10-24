import { Component, OnInit } from '@angular/core';
import { MatchBookingService } from '@app/match-booking/services/match-booking.service';

@Component({
  selector: 'app-booking-payment',
  templateUrl: './booking-payment.component.html',
  styleUrls: ['./booking-payment.component.scss']
})
export class BookingPaymentComponent implements OnInit {

  isLoaderShown = false;

  constructor(
    private matchBookingService: MatchBookingService,
  ) { }

  ngOnInit(): void {
    this.matchBookingService._loaderStatus().subscribe(response => this.isLoaderShown = response);
  }

  /**
   * Continue with success/failure
   */
  continue(status: boolean) {
    if (status) {
      this.matchBookingService.onPayment();
    }
  }
}

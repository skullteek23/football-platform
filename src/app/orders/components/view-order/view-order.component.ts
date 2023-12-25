import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BottomSheetService } from '@app/utils/services/bottom-sheet.service';
import { CancelBookingComponent, ICancellationData } from '../cancel-booking/cancel-booking.component';
import { MatBottomSheetConfig } from '@angular/material/bottom-sheet';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.component.html',
  styleUrls: ['./view-order.component.scss']
})
export class ViewOrderComponent implements OnInit, OnDestroy {

  orderID!: string;
  subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bottomSheetService: BottomSheetService,
  ) { }

  ngOnInit(): void {
    this.subscription.add(
      this.route.params.subscribe(params => {
        if (params && params.hasOwnProperty('oid') && params['oid']) {
          this.orderID = params['oid'];
        } else {
          console.log('error');
          this.router.navigate(['/error']);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }



}

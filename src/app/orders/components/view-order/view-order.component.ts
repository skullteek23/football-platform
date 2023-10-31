import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BottomSheetService } from '@app/services/bottom-sheet.service';
import { CancelBookingComponent } from '../cancel-booking/cancel-booking.component';
import { MatBottomSheetConfig } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.component.html',
  styleUrls: ['./view-order.component.scss']
})
export class ViewOrderComponent implements OnInit {

  orderID!: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bottomSheetService: BottomSheetService,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params && params.hasOwnProperty('oid') && params['oid']) {
        this.orderID = params['oid'];
      } else {
        this.router.navigate(['/error']);
      }
    });
  }

  /**
   * Open cancel dialog
   */
  openCancelDialog() {
    const config = new MatBottomSheetConfig();
    config.data = this.orderID;
    config.disableClose = true;
    config.hasBackdrop = true;
    config.backdropClass = 'sheet-backdrop';
    config.panelClass = 'sheet-custom';
    this.bottomSheetService.openSheet(CancelBookingComponent, config).afterDismissed().subscribe((result) => {
      window.location.reload();
    });
  }

}

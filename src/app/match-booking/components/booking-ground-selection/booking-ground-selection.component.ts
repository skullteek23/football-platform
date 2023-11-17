import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/authentication/auth.service';
import { MatchBookingService } from '@app/match-booking/services/match-booking.service';
import { UserSlotSelectionInfo } from '@app/shared-modules/ground-selection/models/ground-selection.model';
import { GroundSelectionService } from '@app/shared-modules/ground-selection/services/ground-selection.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-booking-ground-selection',
  templateUrl: './booking-ground-selection.component.html',
  styleUrls: ['./booking-ground-selection.component.scss']
})
export class BookingGroundSelectionComponent implements OnInit {

  pos: any;
  subscriptions = new Subscription();

  constructor(
    private authService: AuthService,
    private groundSelectionService: GroundSelectionService,
    private matchBookingService: MatchBookingService
  ) { }

  ngOnInit(): void {
    this.getUserRole();
    this.subscriptions.add(this.groundSelectionService._continueStepChange.subscribe((data: UserSlotSelectionInfo) => {
      if (data && data.slotId && data.facilityId) {
        this.matchBookingService.continue(data);
      }
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /**
   * Gets the user role
   */
  getUserRole() {
    this.authService.getRole()
      .then(role => this.pos = role)
      .catch(role => this.pos = null);
  }
}

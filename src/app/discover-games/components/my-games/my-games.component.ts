import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@app/authentication/auth.service';
import { DiscoverGameSlot } from '@app/discover-games/models/discover-game.model';
import { DiscoverGamesService } from '@app/discover-games/services/discover-games.service';
import { GroundService } from '@app/utils/services/ground.service';
import { OrderService } from '@app/utils/services/order.service';
import { SnackbarService } from '@app/utils/services/snackbar.service';
import { UserService } from '@app/utils/services/user.service';
import { forkJoin } from 'rxjs';
import { Booking, Ground, GroundFacility, GroundSlot, Player } from '@ballzo-ui/core';
import { HomeMessages } from '@app/utils/constant/common-messages';

@Component({
  selector: 'app-my-games',
  templateUrl: './my-games.component.html',
  styleUrls: ['./my-games.component.scss']
})
export class MyGamesComponent implements OnInit {

  readonly messages = HomeMessages;

  data = new DiscoverGameSlot();
  isLoaderShown = false;
  ground = new Ground();
  facility = new GroundFacility();
  playersList: Player[] = [];
  bookingsList: Booking[] = [];
  user: any;
  selectedSlot!: GroundSlot;
  selectedSlotId = '';

  constructor(
    private authService: AuthService,
    private groundService: GroundService,
    private discoverGamesService: DiscoverGamesService,
    private snackbarService: SnackbarService,
    private userService: UserService,
    private orderService: OrderService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.showLoader();
    this.authService._user().subscribe((user) => {
      this.user = user;
      const qParams = this.route.snapshot.queryParams;
      this.selectedSlotId = qParams['slot'];
      this.initPageDetails();
    });
  }

  /**
   * Initializes page details
   */
  initPageDetails() {
    if (this.selectedSlotId) {
      this.groundService.getFacilitySlot(this.selectedSlotId).subscribe({
        next: (response) => {
          this.selectedSlot = response;
          this.selectedSlot.id = this.selectedSlotId;
          this.getDetails();
        },
        error: (error) => {
          this.data = new DiscoverGameSlot();
          this.snackbarService.displayError(error);
          this.hideLoader();
        }
      })
    }
  }

  /**
   * Gets the details
  */
  getDetails() {
    forkJoin([
      this.groundService.getGround(this.selectedSlot.groundId),
      this.groundService.getFacility(this.selectedSlot.facilityId),
      this.orderService.getBookingBySlotId(this.selectedSlotId),
      this.userService.getUsers()
    ])
      .subscribe({
        next: (response) => {
          if (!response[0] || !response[1] || !response[2] || !response[3]) {
            return;
          }

          if (response[2]?.length !== 0 && response[2].findIndex((booking: Booking) => booking?.uid === this.user?.uid) === -1) {
            this.router.navigate(['/games', 'discover'], { queryParams: { slot: this.selectedSlotId } });
          }

          this.ground = response[0];

          this.data = new DiscoverGameSlot();
          this.data.timestamp = this.selectedSlot.timestamp;
          this.data.slotId = this.selectedSlot.id;
          this.data.availableSpots = this.selectedSlot.availableSpot;
          this.data.price = this.selectedSlot.price;
          this.data.facilityId = this.selectedSlot.facilityId;
          this.data.groundId = this.selectedSlot.groundId;
          this.data.facilityName = response[1].name;
          this.data.groundName = response[0].name;
          const list = this.discoverGamesService.createPlayerList(response[2], response[3], this.selectedSlot.allowedCount, this.selectedSlotId);
          if (list.length > 1) {
            this.data.teamOneList = list.slice(0, list.length / 2);
            this.data.teamTwoList = list.slice(list.length / 2);
          }
          this.hideLoader();
        },
        error: (error) => {
          this.data = new DiscoverGameSlot();
          this.hideLoader();
          this.snackbarService.displayError(error);
        }
      })
  }

  /**
 * Opens the ground info bottom sheet
 */
  openGround() {
    let ground = new Ground();
    ground = this.ground;
    ground.id = this.selectedSlot.groundId;
    this.discoverGamesService.openGround(ground);
  }

  /**
   * Shows the loader
   */
  showLoader() {
    this.isLoaderShown = true;
  }

  /**
   * Hides the loader
   */
  hideLoader() {
    this.isLoaderShown = false;
  }
}

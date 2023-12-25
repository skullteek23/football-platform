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
import { Booking, Constants, Ground, GroundFacility, Player } from '@ballzo-ui/core';
import { HomeMessages } from '@app/utils/constant/common-messages';

@Component({
  selector: 'app-my-games',
  templateUrl: './my-games.component.html',
  styleUrls: ['./my-games.component.scss', '../discover-more/discover-more.component.scss']
})
export class MyGamesComponent implements OnInit {

  readonly messages = HomeMessages;

  data: DiscoverGameSlot[] = [];
  selectedIndex = 0;
  isLoaderShown = false;
  groundsList: Ground[] = [];
  facilitiesList: GroundFacility[] = [];
  playersList: Player[] = [];
  bookingsList: Booking[] = [];
  user: any;

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
      this.initPageDetails();
    });
  }

  /**
   * Initializes page details
   */
  initPageDetails() {
    const startTime = new Date().getTime();
    const endTime = startTime + Constants.ONE_DAY_IN_MILLISECONDS;
    forkJoin([
      this.groundService.getSlotsByRange(0, endTime),
      this.groundService.getGrounds(),
      this.groundService.getAllFacilities(),
      this.userService.getUsers(),
      this.orderService.getBookingByUserId(this.user?.uid)
    ])
      .subscribe({
        next: (response) => {
          this.groundsList = response[1] || [];
          this.facilitiesList = response[2] || [];
          this.playersList = response[3] || [];
          this.bookingsList = response[4];
          const allSlots = this.discoverGamesService.parseData(response);
          this.data = allSlots.filter((slot) => this.bookingsList.find((booking) => booking.slotId === slot.slotId));
          this.selectedIndex = this.selectData();
          this.hideLoader();
        },
        error: (error) => {
          this.data = this.discoverGamesService.parseData([]);
          this.snackbarService.displayError(error);
          this.hideLoader();
        }
      })
  }

  /**
 * Selects the data from route params
 * @returns
 */
  selectData() {
    const qParams = this.route.snapshot.queryParams;
    if (qParams && this.data?.length) {
      const index = this.data.findIndex(data => data.slotId === qParams['slot']);
      return index > -1 ? index : 0;
    }
    return 0;
  }

  /**
 * Opens the ground info bottom sheet
 */
  openGround() {
    const ground = this.groundsList.find(ground => ground.id === this.data[this.selectedIndex].groundId);
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

  /**
   * Triggered on click of previous button
   */
  prev() {
    if (this.selectedIndex > 0) {
      this.selectedIndex--;
      this.navigateToDiscover();
    }
  }

  /**
   * Triggered on click of next button
  */
  next() {
    if (this.selectedIndex < this.data.length - 1) {
      this.selectedIndex++;
      this.navigateToDiscover();
    }
  }

  /**
   * Navigates to bookings page
   */
  navigateToDiscover() {
    this.router.navigate(['/games', 'bookings'], { queryParams: { slot: this.data[this.selectedIndex].slotId } });
  }
}

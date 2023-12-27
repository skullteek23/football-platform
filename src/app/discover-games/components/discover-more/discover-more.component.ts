import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/authentication/auth.service';
import { DiscoverGameSlot } from '@app/discover-games/models/discover-game.model';
import { DiscoverGamesService } from '@app/discover-games/services/discover-games.service';
import { GroundService } from '@app/utils/services/ground.service';
import { OrderService } from '@app/utils/services/order.service';
import { SnackbarService } from '@app/utils/services/snackbar.service';
import { UserService } from '@app/utils/services/user.service';
import { forkJoin } from 'rxjs';
import { Booking, Constants, Ground, GroundFacility, Player } from '@ballzo-ui/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeMessages } from '@app/utils/constant/common-messages';

@Component({
  selector: 'app-discover-more',
  templateUrl: './discover-more.component.html',
  styleUrls: ['./discover-more.component.scss']
})
export class DiscoverMoreComponent implements OnInit {

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
    this.initPageDetails();
    this.authService._user().subscribe((user) => {
      this.user = user;
    });
  }

  /**
   * Initializes page details
   */
  initPageDetails() {
    const startTime = new Date().getTime();
    const endTime = startTime + Constants.THREE_DAYS_IN_MILLISECONDS;
    this.selectedIndex = 0;
    forkJoin([
      this.groundService.getSlotsByRange(startTime, endTime),
      this.groundService.getGrounds(),
      this.groundService.getAllFacilities(),
      this.userService.getUsers(),
      this.orderService.getBookingsByRange(startTime, endTime)
    ])
      .subscribe({
        next: (response) => {
          this.groundsList = response[1] || [];
          this.facilitiesList = response[2] || [];
          this.playersList = response[3] || [];
          this.bookingsList = response[4];

          this.data = this.discoverGamesService.parseData(response);
          this.selectedIndex = this.selectData();
          this.hideLoader();
        },
        error: (error) => {
          this.data = this.discoverGamesService.parseData([]);
          this.selectedIndex = 0;
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
   * Joins the game as a player
   * @returns
   */
  joinGame() {
    const selectedData = this.data[this.selectedIndex];
    this.discoverGamesService.joinAsPlayer(selectedData);
  }

  /**
   * Joins the game as a team
   */
  joinGameAsTeam() {
    const selectedData = this.data[this.selectedIndex];
    this.discoverGamesService.joinAsTeam(selectedData);
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
   * Navigates to discover page
   */
  navigateToDiscover() {
    this.router.navigate(['/games', 'discover'], { queryParams: { slot: this.data[this.selectedIndex].slotId } });
  }

}

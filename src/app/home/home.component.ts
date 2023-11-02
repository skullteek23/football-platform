import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/authentication/auth.service';
import { Constants } from '@app/constant/app-constants';
import { HomeMessages } from '@app/constant/app-messages';
import {
  HomeConstants,
  ACTIONS_MENU_NEW_USER,
  ACTIONS_MENU_EXISTING_USER,
} from '@app/home/constants/home.constants';
import { OrderService } from '@app/services/order.service';
import { ButtonConfig } from '@app/shared-modules/buttons/models/button.model';
import {
  IconSelectionData,
  IconSelectionDataItem,
} from '@app/shared-modules/icon-selection-menu/models/icon-selection.model';
import { InteractiveCardData } from '@app/shared-modules/interactive-card/models/interactive-card.model';
import { Subscription, combineLatest } from 'rxjs';
import { HomeService } from './services/home.service';
import { GroundService } from '@app/services/ground.service';
import { SnackbarService } from '@app/services/snackbar.service';
import { GroundSlot } from '@app/models/ground.model';
import { getFirestoreErrorMsg } from '@app/utils/api-error-handling-utility';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  readonly messages = HomeMessages;

  isUserLogged = false;
  userBookings: any[] = [];
  name: string = HomeConstants.salutation;
  data = new IconSelectionData();
  buttonDetails = new ButtonConfig();
  isPageInitialized = false;
  subscriptions = new Subscription();
  isLoaderShown = false;
  uid: string = '';
  contentList: InteractiveCardData[] = [];
  isBookingsInitialized = false;
  photoUrl: string = '';
  slots: GroundSlot[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private orderService: OrderService,
    private homeService: HomeService,
    private groundService: GroundService,
    private snackbarService: SnackbarService
  ) { }

  ngOnInit(): void {
    this.checkUserLogin();
    this.buttonDetails.icon = 'sports_soccer';
    this.buttonDetails.label = Constants.GET_STARTED;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngAfterViewInit(): void {
    const contextWindow = document.getElementById('primary-content-render');
    contextWindow?.scrollTo(0, 0);
  }

  /**
   * Returns whether user is logged in or not.
   */
  checkUserLogin() {
    this.subscriptions.add(
      this.authService._user().subscribe({
        next: (response) => {
          if (response?.displayName) {
            this.name = response?.displayName;
          }
          if (response?.photoURL) {
            this.photoUrl = response.photoURL
          }
          this.isUserLogged = response ? true : false;
          this.data.items = JSON.parse(JSON.stringify(ACTIONS_MENU_NEW_USER));
          if (response) {
            this.uid = response.uid;
            this.data.extraItems = JSON.parse(
              JSON.stringify(ACTIONS_MENU_EXISTING_USER)
            );
            this.getBookings();
          } else {
            this.data.extraItems = [];
            this.isBookingsInitialized = true;
            this.userBookings = [];
            this.contentList = [];
          }
          this.isPageInitialized = true;
        },
      })
    );
  }

  /**
   * Triggers when any menu option is selected
   * @param selection
   */
  onSelectOption(selection: IconSelectionDataItem) {
    if (selection?.externalLink) {
      window.open(selection.externalLink.trim(), '_blank');
    } else {
      this.navigateTo(selection.route);
    }
  }

  /**
   * Function to navigate to a route for showing loader during navigation
   * @param route
   */
  navigateTo(route: string) {
    this.isPageInitialized = false;
    this.router.navigate([route]).then(() => {
      this.isPageInitialized = true;
    });
  }

  /**
   * Refreshes user bookings by making APi call again
   */
  refreshContent() {
    this.getBookings();
    this.snackbarService.displayCustomMsg(this.messages.success.refreshPage);
  }

  /**
   * Gets the bookings of the user
   */
  getBookings() {
    this.isBookingsInitialized = false;
    combineLatest([
      this.orderService.getBookingByUserId(this.uid),
      this.groundService.getGrounds(),
      this.groundService.getUpcomingSlots()
    ]).subscribe({
      next: response => {
        if (response?.length === 3 && response[0] && response[1] && response[2] && this.isUserLogged) {
          const bookings = response[0];
          const grounds = response[1];
          this.slots = response[2];
          this.userBookings = bookings || [];
          this.contentList = this.homeService.parseBookingData(bookings, grounds, this.slots);
        }
        this.isBookingsInitialized = true;
      },
      error: (err) => {
        this.isBookingsInitialized = true;
        this.snackbarService.displayError(err);
      }
    })
  }

  /**
   * Triggered when user clicks on any booking
   * @param item
   */
  openList(item: InteractiveCardData) {
    // Saving slot id in the ID field of the card data
    if (item.id) {
      this.router.navigate(['/m', 'players-list', item.id]);
    } else {
      console.log('Invalid selection!')
    }
  }

  /**
   * Open signup popup bottom sheet
   */
  getStarted() {
    this.authService.openSignup();
  }
}

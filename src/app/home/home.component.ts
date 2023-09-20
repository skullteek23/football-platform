import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/authentication/auth.service';
import { GlobalConstants } from '@app/constant/app-constants';
import { HomeMessages } from '@app/constant/app-messages';
import {
  HomeConstants,
  ACTIONS_MENU_NEW_USER,
  ACTIONS_MENU_EXISTING_USER,
} from '@app/home/constants/home.constants';
import { ButtonConfig } from '@app/shared-modules/buttons/models/button.model';
import {
  IconSelectionData,
  IconSelectionDataItem,
} from '@app/shared-modules/icon-selection-menu/models/icon-selection.model';
import { Subscription } from 'rxjs';

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

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.checkUserLogin();
    this.buttonDetails.icon = 'sports_soccer';
    this.buttonDetails.label = GlobalConstants.GET_STARTED;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngAfterViewInit(): void {
    window.scrollTo(0, 0);
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
          this.isUserLogged = response ? true : false;
          this.data.items = JSON.parse(JSON.stringify(ACTIONS_MENU_NEW_USER));
          if (response) {
            this.data.extraItems = JSON.parse(
              JSON.stringify(ACTIONS_MENU_EXISTING_USER)
            );
          } else {
            this.data.extraItems = [];
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
      this.router.navigate([selection.route]);
    }
  }

  /**
   * Refreshes user bookings by making APi call again
   */
  refreshContent() {
    // APi call to refresh content
  }

  /**
   * Open signup popup bottom sheet
   */
  getStarted() {
    this.authService.openSignup();
  }
}

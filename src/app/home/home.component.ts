import { Component, OnInit } from '@angular/core';
import {
  ACTIONS_MENU_EXISTING_USER,
  ACTIONS_MENU_NEW_USER,
  HomeConstants,
} from './constants/home.constants';
import { AuthService } from '@app/authentication/auth.service';
import {
  IconSelectionData,
  IconSelectionDataItem,
} from '@app/shared-modules/icon-selection-menu/models/icon-selection.model';
import { Router } from '@angular/router';
import { HomeMessages } from '@app/constant/app-messages';
import { ButtonConfig } from '@app/shared-modules/buttons/models/button.model';
import { GlobalConstants } from '@app/constant/app-constants';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  readonly messages = HomeMessages;

  isUserLogged = false;
  userBookings: any[] = [];
  name: string = '';
  data = new IconSelectionData();
  buttonDetails = new ButtonConfig();

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.checkUserLogin();
    this.name = this.authService.getDisplayName();
    this.buttonDetails.icon = 'sports_soccer';
    this.buttonDetails.label = GlobalConstants.GET_STARTED;
  }

  /**
   * Returns whether user is logged in or not.
   */
  checkUserLogin() {
    this.authService._user().subscribe({
      next: (response) => {
        this.isUserLogged = response ? true : false;
        this.data.items = JSON.parse(JSON.stringify(ACTIONS_MENU_NEW_USER));
        if (response) {
          this.data.extraItems = JSON.parse(
            JSON.stringify(ACTIONS_MENU_EXISTING_USER)
          );
        } else {
          this.data.extraItems = [];
        }
      },
    });
  }

  /**
   * Triggers when any menu option is selected
   * @param selection
   */
  onSelectOption(selection: IconSelectionDataItem) {
    console.log(selection);
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

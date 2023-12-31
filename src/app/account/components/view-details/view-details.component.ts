import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '@app/account/services/account.service';
import { AuthService } from '@app/authentication/auth.service';
import { Constants, Player } from '@ballzo-ui/core';
import { AccountMessages } from '@app/utils/constant/common-messages';
import { IUser } from '@app/utils/models/user.model';
import { PlayerStats, Position } from '@ballzo-ui/core';
import { BottomSheetService } from '@app/utils/services/bottom-sheet.service';
import { ShowConfirmationService } from '@app/utils/services/show-confirmation.service';
import { SnackbarService } from '@app/utils/services/snackbar.service';
import { UserService } from '@app/utils/services/user.service';
import {
  ButtonConfig,
  ButtonTheme,
} from '@app/shared-modules/buttons/models/button.model';
import { ChangeNumberComponent } from '@app/shared-modules/change-number/change-number.component';
import { DetailsContainerData } from '@app/shared-modules/details-container/models/details-container.model';
import { isEnumKey } from '@ballzo-ui/core';
import { getCloudFnErrorMsg } from '@app/utils/main-utilities/api-error-handling-utility';

@Component({
  selector: 'app-view-details',
  templateUrl: './view-details.component.html',
  styleUrls: ['./view-details.component.scss'],
})
export class ViewDetailsComponent implements OnInit {
  readonly ButtonTheme = ButtonTheme;
  readonly messages = AccountMessages;

  isPageInitialized = false;
  logoutBtn = new ButtonConfig();
  prevOrdersBtn = new ButtonConfig();
  becomeManagerBtn = new ButtonConfig();
  user: IUser = null;
  personalDetailsData = new DetailsContainerData();
  role: Position = Position.striker;
  playerStats = new PlayerStats();
  disableManagerBtn = true;
  player = new Player();

  constructor(
    private authService: AuthService,
    private router: Router,
    private showConfirmationService: ShowConfirmationService,
    private snackbarService: SnackbarService,
    private bottomSheetService: BottomSheetService,
    private userService: UserService,
    private accountService: AccountService,
  ) { }

  ngOnInit(): void {
    this.authService._user().subscribe(async user => {
      if (user?.uid) {
        this.user = user;
        this.personalDetailsData.title = 'Personal Details';
        this.personalDetailsData.actionIcon = 'edit';
        this.personalDetailsData.detailData = [];
        this.getUserDetails(user.uid);
        this.getUserStats(user.uid);
        this.setBtnDetails();
        // this.getUserRole();
      }
    })
  }

  /**
   * Get the user details
   * @param uid
  */
  getUserDetails(uid: string) {
    this.isPageInitialized = false;
    this.userService.getUser(uid).subscribe(response => {
      if (response) {
        this.player = response;
        this.personalDetailsData.detailData.push({ icon: 'cake', label: this.accountService.getDob(response.dob) });
        this.personalDetailsData.detailData.push({ icon: 'place', label: response._location });
        this.personalDetailsData.detailData.push({ icon: 'email', label: this.user?.email || Constants.NOT_AVAILABLE });
      }
      this.isPageInitialized = true;
    })
  }

  /**
   * Get the user stats
   * @param uid
   */
  getUserStats(uid: string) {
    this.userService.getUserStats(uid).subscribe(response => {
      if (response) {
        this.playerStats = response;
      }
    })
  }

  /**
   * Get the user role
   */
  getUserRole() {
    this.authService.getCustomClaims(this.user)
      .then(value => {
        const role = this.authService.parseRole(value);
        if (role && isEnumKey(role, Position) && role === Position.manager) {
          this.disableManagerBtn = true;
        } else {
          this.disableManagerBtn = false;
        }
        this.isPageInitialized = true;
      })
      .catch(error => {
        if (error) {
          console.log(error);
        }
        this.isPageInitialized = true;
      })
  }

  /**
   * Set the button details
  */
  setBtnDetails() {
    this.logoutBtn.label = 'Logout';
    this.logoutBtn.icon = 'logout';

    this.becomeManagerBtn.icon = 'change_circle';
    this.becomeManagerBtn.label = 'Become a Manager';

    this.prevOrdersBtn.label = 'View Previous Orders';
    this.prevOrdersBtn.icon = 'list_alt';
  }

  /**
   * Logout the user
   */
  logout(): void {
    const result = this.showConfirmationService.openNativeConfirm(this.messages.confirmation.logout);
    if (result) {
      this.authService.logout();
    }
  }

  /**
   * Change the role of the user
   */
  changeRole() {
    const result = this.showConfirmationService.openNativeConfirm(this.messages.confirmation.becomeManager);
    if (result) {
      this.authService.setUserRole(Position.manager)
        .then(() => {
          this.snackbarService.displayCustomMsg(this.messages.success.roleChange);
          this.getUserRole();
        })
        .catch(error => {
          this.snackbarService.displayError(getCloudFnErrorMsg(error));
        });
    }
  }

  /**
   * Navigate to orders page
   */
  goToOrders() {
    this.router.navigate(['user', 'orders']);
  }

  /**
   * Change the phone number
   */
  changePhoneNumber() {
    this.bottomSheetService.openSheet(ChangeNumberComponent);
  }

  /**
   * Edit the details
   */
  editDetails() {
    this.router.navigate(['user', 'account', 'edit'])
  }
}

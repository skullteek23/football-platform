import { Component, OnInit } from '@angular/core';
import { MatBottomSheetConfig } from '@angular/material/bottom-sheet';
import { Ground } from '@ballzo-ui/core';
import { BottomSheetService } from '@app/utils/services/bottom-sheet.service';
import { ButtonConfig, ButtonTheme } from '@app/shared-modules/buttons/models/button.model';
import { InteractiveCardData } from '@app/shared-modules/interactive-card/models/interactive-card.model';
import { GroundInfoComponent } from '../shared-modules/ground-info/ground-info.component';
import { GroundService } from '@app/utils/services/ground.service';
import { GroundsNearMeService } from './services/grounds-near-me.service';
import { UserService } from '@app/utils/services/user.service';
import { AuthService } from '@app/authentication/auth.service';
import { Router } from '@angular/router';
import { SnackbarService } from '@app/utils/services/snackbar.service';
import { GroundSelectionMessages } from '@app/utils/constant/common-messages';
import { Constants } from '@ballzo-ui/core';
import { SupportService } from '@app/support/services/support.service';

@Component({
  selector: 'app-grounds-near-me',
  templateUrl: './grounds-near-me.component.html',
  styleUrls: ['./grounds-near-me.component.scss']
})
export class GroundsNearMeComponent implements OnInit {

  readonly ButtonTheme = ButtonTheme;
  readonly SHIMMER_ARRAY = Constants.PLACEHOLDER_ARRAY;
  readonly messages = GroundSelectionMessages;

  addGroundBtnDetails = new ButtonConfig();
  groundsList: Ground[] = [];
  cardData: InteractiveCardData[] = [];
  isLoaderShown = false;

  constructor(
    private sheetService: BottomSheetService,
    private groundService: GroundService,
    private groundNearMeService: GroundsNearMeService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private snackbarService: SnackbarService,
    private supportService: SupportService

  ) { }

  ngOnInit(): void {
    this.addGroundBtnDetails.label = 'Own a Ground? Get in touch!';
    this.addGroundBtnDetails.icon = '';

    this.getGrounds();
  }

  /**
   * Gets the grounds
   */
  getGrounds() {
    this.showLoader();
    this.groundService.getGrounds().subscribe({
      next: (response) => {
        this.setData(response);
      },
      error: this.handleError.bind(this)
    })
    // this.authService._user().subscribe(user => {
    //   if (user?.uid) {
    //     this.userService.getUser(user.uid).subscribe({
    //       next: async (player) => {
    //         if (player?.locationCity) {
    //           this.groundService.getGroundsByState(player.locationState).subscribe({
    //             next: (response) => {
    //               this.setData(response);
    //             },
    //             error: this.handleError.bind(this)
    //           })
    //         } else {
    //           this.groundService.getGrounds().subscribe({
    //             next: (response) => {
    //               this.setData(response);
    //             },
    //             error: this.handleError.bind(this)
    //           })
    //         }
    //       },
    //       error: this.handleError.bind(this)
    //     })
    //   } else {
    //     this.hideLoader();
    //     this.router.navigate(['/error']);
    //   }
    // })
  }

  /**
   * Handles the error
  */
  handleError(err: any) {
    this.snackbarService.displayError(err);
    this.setData([]);
  }

  /**
   * Sets the data
   * @param data
   */
  setData(data: Ground[]) {
    this.groundsList = data;
    this.cardData = this.groundNearMeService.getCardData(data);
    this.hideLoader();
  }

  /**
   * Opens the admin app in a new tab
   */
  openAdminApp() {
    const value = {
      subject: 'Ground Request',
      description: 'I would like to add my ground to Ballzo',
    }
    this.authService._user().subscribe(user => {
      if (user?.uid) {
        this.showLoader();
        this.supportService.submitRequest(value, user.uid, this.supportService.getReferenceId())
          .then(() => {
            this.hideLoader();
            this.snackbarService.displayCustomMsg('Your request has been submitted. We will get back to you soon.');
          })
          .catch((err) => {
            this.hideLoader();
            this.snackbarService.displayError(err);
          });
      }
    })
    // window.open(environment.urls.admin, '_blank');
  }

  /**
   * Opens the ground info bottom sheet
   * @param selection
   */
  openGround(selection: InteractiveCardData) {
    const ground = this.groundsList.find(ground => ground.id === selection.id);
    if (ground) {
      const config = new MatBottomSheetConfig();
      config.disableClose = false;
      config.hasBackdrop = true;
      config.backdropClass = 'sheet-backdrop';
      config.panelClass = 'sheet-custom-ground-info';
      config.data = ground;
      this.sheetService.openSheet(GroundInfoComponent, config);
    }
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

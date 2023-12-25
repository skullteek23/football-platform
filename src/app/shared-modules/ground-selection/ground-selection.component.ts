import { Component, Input, OnInit } from '@angular/core';
import { InteractiveCardData } from '../interactive-card/models/interactive-card.model';
import { SelectedGroundInfo, UserSlotSelectionInfo } from './models/ground-selection.model';
import { GroundSelectionService } from './services/ground-selection.service';
import { SessionStorageService } from '@app/utils/services/session-storage.service';
import { Constants } from '@ballzo-ui/core';
import { ButtonConfig } from '../buttons/models/button.model';
import { GroundService } from '@app/utils/services/ground.service';
import { Ground } from '@ballzo-ui/core';
import { SnackbarService } from '@app/utils/services/snackbar.service';
import { GroundSelectionMessages } from '@app/utils/constant/common-messages';
import { Position } from '@ballzo-ui/core';
import { isEnumKey } from '@ballzo-ui/core';
import { SessionStorageProperties } from '@app/utils/constant/constants';

@Component({
  selector: 'app-ground-selection',
  templateUrl: './ground-selection.component.html',
  styleUrls: ['./ground-selection.component.scss'],
})
export class GroundSelectionComponent implements OnInit {

  @Input() set position(value: any) {
    if (value !== undefined && value !== null) {
      this.userPosition = value;
      if (this.userPosition && isEnumKey(this.userPosition, Position)) {
        this.showSpotCount = this.userPosition === Position.manager;
      }
      this.payBtnDetails.label = 'Confirm Slot';
      this.getGrounds();
    }
  }

  readonly SHIMMER_ARRAY = Constants.PLACEHOLDER_ARRAY;
  readonly messages = GroundSelectionMessages;

  groundsList: InteractiveCardData[] = [];
  userPosition = Position.manager;
  selectionData!: SelectedGroundInfo;
  isGroundSelected = false;
  payBtnDetails = new ButtonConfig();
  selectedGroundID!: string;
  groundListInit = false;
  isSelectionInit = true;
  showSpotCount = false;

  constructor(
    private sessionStorageService: SessionStorageService,
    private groundSelectionService: GroundSelectionService,
    private groundService: GroundService,
    private snackbarService: SnackbarService
  ) { }

  ngOnInit(): void { }

  /**
   * Gets the grounds
   */
  getGrounds() {
    this.groundService.getGrounds().subscribe({
      next: (response: Ground[]) => {
        this.groundsList = this.groundSelectionService.parseGroundResponse(response);
        const groundSelectionData: UserSlotSelectionInfo = this.sessionStorageService.get(SessionStorageProperties.USER_GROUND_SELECTION);
        // if (groundSelectionData?.groundId && groundSelectionData?.facilityId) {
        //   this.selectedGroundID = groundSelectionData.groundId;
        //   const ground = this.groundsList.find((ground) => ground.id === this.selectedGroundID);
        //   if (ground) {
        //     this.selectGround(ground);
        //   }
        // }
        this.groundListInit = true;
      },
      error: (error) => {
        this.groundListInit = true;
        this.snackbarService.displayError(error);
      }
    });
  }

  /**
   * Selects the ground
   * @param selection
   */
  selectGround(selection: InteractiveCardData) {
    if (selection?.id) {
      this.isGroundSelected = true;
      this.selectedGroundID = selection.id;
      this.groundSelectionService.updateGround(this.selectedGroundID);
      this.getFacilities(selection);
    }
  }

  /**
   * Gets the facilities
   * @param selection
   */
  getFacilities(selection: InteractiveCardData) {
    this.isSelectionInit = false;
    this.groundService.getFacilities(this.selectedGroundID).subscribe({
      next: (response) => {
        if (response) {
          this.selectionData = this.groundSelectionService.parseGroundFacilitySlots(response, selection);
        }
        this.isSelectionInit = true;
        const contextWindow = document.getElementById('main-container-app');
        if (contextWindow) {
          contextWindow.scrollTo(0, 0);
        }
      },
      error: (error) => {
        this.snackbarService.displayError(error);
        this.isSelectionInit = true;
      }
    });
  }

  /**
   * Triggered when the panel is closed
   */
  closePanel() {
    this.isGroundSelected = false;
    this.selectedGroundID = '';
    this.groundSelectionService.resetGroundSelection();
  }

  /**
   * Called user wants to proceed with the payment
   */
  continueWithPay() {
    if (this.isSlotSelected) {
      this.groundSelectionService.continue();
    }
  }

  /**
   * Returns true if the slot is selected
   */
  get isSlotSelected(): boolean {
    return this.groundSelectionService.isSlotSelected;
  }
}

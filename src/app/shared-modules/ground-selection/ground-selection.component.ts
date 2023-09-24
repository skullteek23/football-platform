import { Component, OnInit } from '@angular/core';
import { InteractiveCardData } from '../interactive-card/models/interactive-card.model';
import { AnimationsList } from '@app/services/animation.service';
import { SelectedGroundInfo, UserSlotSelectionInfo } from './models/ground-selection.model';
import { GroundSelectionService } from './services/ground-selection.service';
import { SessionStorageService } from '@app/services/session-storage.service';
import { Position, SessionStorageProperties } from '@app/constant/app-constants';
import { ButtonConfig } from '../buttons/models/button.model';

@Component({
  selector: 'app-ground-selection',
  templateUrl: './ground-selection.component.html',
  styleUrls: ['./ground-selection.component.scss'],
  animations: [AnimationsList.fadeAppearSideways],
})
export class GroundSelectionComponent implements OnInit {
  grounds: InteractiveCardData[] = [];
  selectionData!: SelectedGroundInfo;
  selectedGround!: InteractiveCardData;
  isGroundSelected = false;
  userPosition = Position.manager;
  payBtnDetails = new ButtonConfig();
  constructor(
    private sessionStorageService: SessionStorageService,
    private groundSelectionService: GroundSelectionService
  ) { }

  ngOnInit(): void {
    this.userPosition = this.sessionStorageService.get(SessionStorageProperties.USER_POSITION_SELECTION);
    const groundSelectionData: UserSlotSelectionInfo = this.sessionStorageService.get(SessionStorageProperties.USER_GROUND_SELECTION);
    if (groundSelectionData?.ground && groundSelectionData?.facility) {
      // this.selectedGround =
    }
    this.grounds = this.groundSelectionService.getGrounds();
    this.payBtnDetails.label = 'Pay & Book';
  }

  /**
   * Selects the ground
   * @param selection
   */
  selectGround(selection: InteractiveCardData) {
    if (selection?.id) {
      this.isGroundSelected = true;
      this.selectedGround = selection;
      this.selectionData = this.groundSelectionService.createGroundSelectionData(selection);
      this.groundSelectionService.updateGround(this.selectedGround.title);
      window.scrollTo(0, 0);
    }
  }

  /**
   * Triggered when the panel is closed
   */
  closePanel() {
    this.isGroundSelected = false;
    this.selectedGround = new InteractiveCardData();
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
   * Gets the show spot count
   */
  get showSpotCount(): boolean {
    return this.userPosition === Position.manager;
  }

  /**
   * Returns true if the slot is selected
   */
  get isSlotSelected(): boolean {
    return this.groundSelectionService.isSlotSelected;
  }
}

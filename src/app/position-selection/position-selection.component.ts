import { Component, OnInit } from '@angular/core';
import { AnimationsList } from '@app/services/animation.service';
import { ButtonConfig } from '@app/shared-modules/buttons/models/button.model';
import { PositionSelectionMessages } from '@app/constant/common-messages';
import { Router } from '@angular/router';
import { SessionStorageService } from '@app/services/session-storage.service';
import { SessionStorageProperties } from '@app/constant/constants';
import { PositionData, findIndexByValue, getValueByIndex, isEnumKey } from '@ballzo-ui/core';
import { Position } from '@ballzo-ui/core';
import { POSITION_SELECTION_DATA } from './constants/position-constants';

@Component({
  selector: 'app-position-selection',
  templateUrl: './position-selection.component.html',
  styleUrls: ['./position-selection.component.scss'],
  animations: [AnimationsList.sliderSidewayAnimation, AnimationsList.sliderSidewayVoid],
})
export class PositionSelectionComponent implements OnInit {
  readonly positionMap = PositionData;
  readonly PositionEnum = Position;

  selectBtnDetails!: ButtonConfig;
  data = POSITION_SELECTION_DATA;
  selectedAsset = '';
  index = 0
  tip = PositionSelectionMessages.tip.player;

  constructor(
    private router: Router,
    private sessionStorage: SessionStorageService
  ) { }

  ngOnInit(): void {
    const prevSelection = this.sessionStorage.get(SessionStorageProperties.USER_POSITION_SELECTION);
    if (String(prevSelection) && isEnumKey(prevSelection, Position)) {
      const index = findIndexByValue(prevSelection, Position);
      if (index || index === 0) {
        this.index = index;
        this.selectedAsset = this.data[this.index];
        this.setTip();
      }
    } else {
      this.selectedAsset = this.data[1];
      this.index = 1;
    }
    this.selectBtnDetails = new ButtonConfig();
    this.selectBtnDetails.label = 'Select';
  }


  /**
   * Navigates to the ground selection page
   */
  selectPos() {
    if (this.index >= 0 && this.index <= 4) {
      const value = getValueByIndex(Position, this.index);
      this.sessionStorage.set(SessionStorageProperties.USER_POSITION_SELECTION, value);
      this.navigateToNext();
    }
  }

  /**
   * Navigates to the next page
   */
  navigateToNext() {
    this.router.navigate(['/m', 'onboarding', 'select-ground']);
  }

  /**
 * Sets the tip based on the position
 */
  setTip() {
    if (this.index === 0) {
      this.tip = PositionSelectionMessages.tip.manager;
    } else {
      this.tip = PositionSelectionMessages.tip.player;
    }
  }

  /**
 * Sets previous image as selected
 */
  previousImage() {
    if (!this.imagesCount || this.index <= 0) {
      return;
    }
    this.selectedAsset = '';
    setTimeout(() => {
      this.index--;
      this.selectedAsset = this.data[this.index];
      this.setTip();
    });
  }

  /**
   * Sets next image as selected
   */
  nextImage() {
    if (!this.imagesCount || this.index > this.imagesCount - 1) {
      return;
    }

    this.selectedAsset = '';
    setTimeout(() => {
      this.index++;
      this.selectedAsset = this.data[this.index];
      this.setTip();
    });
  }


  /**
   * Returns number of images
   */
  get imagesCount() {
    return 5;
  }
}

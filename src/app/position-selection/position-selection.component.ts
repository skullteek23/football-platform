import { Component, OnInit } from '@angular/core';
import { AnimationsList } from '@app/services/animation.service';
import { PositionData } from './constants/postion-selection.constant';
import { ButtonConfig } from '@app/shared-modules/buttons/models/button.model';
import { PositionSelectionMessages } from '@ballzo-ui/core/common';
import { Router } from '@angular/router';
import { SessionStorageService } from '@app/services/session-storage.service';
import { SessionStorageProperties } from '@ballzo-ui/core/common';
import { findIndexByValue, getValueByIndex, isEnumKey } from '@app/utils/objects-utility';
import { Position } from '@ballzo-ui/core/user';

@Component({
  selector: 'app-position-selection',
  templateUrl: './position-selection.component.html',
  styleUrls: ['./position-selection.component.scss'],
  animations: [AnimationsList.sliderSidewayAnimation],
})
export class PositionSelectionComponent implements OnInit {
  readonly positionMap = PositionData;
  readonly PositionEnum = Position;

  positionFlag: number = 1;
  selectBtnDetails!: ButtonConfig;
  tip = PositionSelectionMessages.tip.player;

  constructor(
    private router: Router,
    private sessionStorage: SessionStorageService
  ) { }

  ngOnInit(): void {
    const prevSelection = this.sessionStorage.get(SessionStorageProperties.USER_POSITION_SELECTION);
    if (String(prevSelection) && isEnumKey(prevSelection, Position)) {
      const index = findIndexByValue(prevSelection, Position);
      if (index && index === 0) {
        this.positionFlag = index;
        this.setTip();
      }
    }
    this.selectBtnDetails = new ButtonConfig();
    this.selectBtnDetails.label = 'Select';
  }

  /**
   * Increments the position by 1
   */
  next() {
    if (this.positionFlag >= 4) {
      return;
    }
    this.positionFlag = (this.positionFlag + 1 + 5) % 5;
    this.setTip();
  }

  /**
   * Decrements the position by 1
   */
  prev() {
    if (this.positionFlag <= 0) {
      return;
    }
    this.positionFlag = (this.positionFlag - 1 + 5) % 5;
    this.setTip();
  }

  /**
   * Sets the tip based on the position
   */
  setTip() {
    if (this.positionFlag === 0) {
      this.tip = PositionSelectionMessages.tip.manager;
    } else {
      this.tip = PositionSelectionMessages.tip.player;
    }
  }

  /**
   * Navigates to the ground selection page
   */
  selectPos() {
    if (this.positionFlag >= 0 && this.positionFlag <= 4) {
      const value = getValueByIndex(Position, this.positionFlag);
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
}

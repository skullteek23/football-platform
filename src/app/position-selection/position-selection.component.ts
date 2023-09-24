import { Component, OnInit } from '@angular/core';
import { AnimationsList } from '@app/services/animation.service';
import { PositionData } from './constants/postion-selection.constant';
import { ButtonConfig } from '@app/shared-modules/buttons/models/button.model';
import { PositionSelectionMessages } from '@app/constant/app-messages';
import { Router } from '@angular/router';
import { SessionStorageService } from '@app/services/session-storage.service';
import { Position, SessionStorageProperties } from '@app/constant/app-constants';
import { isEnumKey } from '@app/utils/objects-utility';

@Component({
  selector: 'app-position-selection',
  templateUrl: './position-selection.component.html',
  styleUrls: ['./position-selection.component.scss'],
  animations: [AnimationsList.sliderSidewayAnimation],
})
export class PositionSelectionComponent implements OnInit {
  readonly positionMap = PositionData;

  position = Position.striker;
  selectBtnDetails!: ButtonConfig;
  tip = PositionSelectionMessages.tip.player;

  constructor(
    private router: Router,
    private sessionStorage: SessionStorageService
  ) { }

  ngOnInit(): void {
    const prevSelection = this.sessionStorage.get(SessionStorageProperties.USER_POSITION_SELECTION);
    if (String(prevSelection) && isEnumKey(prevSelection, Position)) {
      this.position = Number(Position[prevSelection]);
      this.setTip();
    }
    this.selectBtnDetails = new ButtonConfig();
    this.selectBtnDetails.label = 'Select';
  }

  /**
   * Increments the position by 1
   */
  next() {
    if (this.position >= Position.goalkeeper) {
      return;
    }
    this.position = (this.position + 1 + 5) % 5;
    this.setTip();
  }

  /**
   * Decrements the position by 1
   */
  prev() {
    if (this.position <= Position.manager) {
      return;
    }
    this.position = (this.position - 1 + 5) % 5;
    this.setTip();
  }

  /**
   * Sets the tip based on the position
   */
  setTip() {
    if (this.position === 0) {
      this.tip = PositionSelectionMessages.tip.manager;
    } else {
      this.tip = PositionSelectionMessages.tip.player;
    }
  }

  /**
   * Navigates to the ground selection page
   */
  selectPos() {
    if (this.position >= 0 && this.position <= 4 && isEnumKey(this.position, Position)) {
      this.sessionStorage.set(SessionStorageProperties.USER_POSITION_SELECTION, Position[this.position]);
      this.navigateToNext();
    }
  }

  /**
   * Navigates to the next page
   */
  navigateToNext() {
    this.router.navigate(['/main', 'onboarding', 'select-ground']);
  }
}

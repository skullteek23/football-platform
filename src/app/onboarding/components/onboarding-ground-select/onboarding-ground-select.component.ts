import { Component, OnDestroy, OnInit } from '@angular/core';
import { SessionStorageProperties } from '@app/constant/constants';
import { OnboardingService } from '@app/onboarding/services/onboarding.service';
import { SessionStorageService } from '@app/services/session-storage.service';
import { UserSlotSelectionInfo } from '@app/shared-modules/ground-selection/models/ground-selection.model';
import { GroundSelectionService } from '@app/shared-modules/ground-selection/services/ground-selection.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-onboarding-ground-select',
  templateUrl: './onboarding-ground-select.component.html',
  styleUrls: ['./onboarding-ground-select.component.scss']
})
export class OnboardingGroundSelectComponent implements OnInit, OnDestroy {

  pos: any;
  subscriptions = new Subscription();

  constructor(
    private sessionStorageService: SessionStorageService,
    private groundSelectionService: GroundSelectionService,
    private onboardingService: OnboardingService
  ) { }

  ngOnInit(): void {
    this.pos = this.sessionStorageService.get(SessionStorageProperties.USER_POSITION_SELECTION);

    this.subscriptions.add(this.groundSelectionService._continueStepChange.subscribe((data: UserSlotSelectionInfo) => {
      if (data && data.slotId && data.facilityId) {
        this.onboardingService.continue(data);
      }
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}

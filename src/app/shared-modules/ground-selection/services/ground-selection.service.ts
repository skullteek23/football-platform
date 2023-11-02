import { Injectable } from '@angular/core';
import { InteractiveCardData } from '@app/shared-modules/interactive-card/models/interactive-card.model';
import { SelectedGroundInfo, TabLabel, UserSlotSelectionInfo } from '../models/ground-selection.model';
import { SessionStorageService } from '@app/services/session-storage.service';
import { Constants, SessionStorageProperties } from '@ballzo-ui/core/common';
import { Ground, GroundFacility, GroundPrice } from '@ballzo-ui/core/ground';
import { ArraySorting } from '@app/utils/array-sorting-utility';
import { DatePipe } from '@angular/common';
import { GroundService } from '@app/services/ground.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroundSelectionService {

  private userSelectionData: UserSlotSelectionInfo = new UserSlotSelectionInfo();
  private continueStepChange = new Subject<UserSlotSelectionInfo>();

  constructor(
    private sessionStorage: SessionStorageService,
    private datePipe: DatePipe,
    private groundService: GroundService
  ) { }

  /**
   * Parses the ground response
   * @param response
   * @returns
   */
  parseGroundResponse(response: Ground[]): InteractiveCardData[] {
    const grounds: InteractiveCardData[] = [];
    if (response && response.length) {
      response.forEach((ground: Ground) => {
        const grData = new InteractiveCardData();
        grData.id = ground.id;
        grData.title = ground.name.trim();
        grData.subtitle = ground.city;
        grData.descriptionHtml = this.groundService.getLeastPrice(ground.price);
        grData.actionBtn.label = 'Select';
        grData.actionBtn.isSelectable = true;
        grData.imgSrc = ground.imgLink;
        grounds.push(grData);
      })
    }
    return grounds.sort(ArraySorting.sortObjectByKey('title'));
  }

  /**
   * Parses the ground facility response
   * @param facilityList
   * @param selection
   * @returns
   */
  parseGroundFacilitySlots(facilityList: GroundFacility[], selection: InteractiveCardData): SelectedGroundInfo {
    const sortedFacilityList = facilityList.sort(ArraySorting.sortObjectByKey('name'));
    const today = new Date();
    const tomorrow = new Date();
    const dayAfter = new Date();
    tomorrow.setDate(today.getDate() + 1);
    dayAfter.setDate(today.getDate() + 2);

    const data = new SelectedGroundInfo();
    data.title = selection.title;
    data.subtitle = selection.subtitle;
    data.tabs = [
      { label: TabLabel.today, subLabel: '', },
      { label: TabLabel.tomorrow, subLabel: '', },
      { label: TabLabel.dayAfter, subLabel: '', },
    ];
    data.facilities = JSON.parse(JSON.stringify(sortedFacilityList));

    return data;
  }

  /**
   * Updates the ground selection
   * @param updatedValue
   */
  updateGround(updatedValue: string) {
    this.userSelectionData.groundId = updatedValue;
  }

  /**
   * Updates the spot count
   * @param updatedValue
   */
  updateSpotCount(updatedValue: number) {
    this.userSelectionData.spots = updatedValue;
  }

  /**
   * Updates the facility
   * @param facility
   */
  updateFacility(facility: string) {
    this.userSelectionData.facilityId = facility;
  }

  /**
   * Updates the slot selection
   * @param slot
   */
  updateSlotSelection(slot: string) {
    this.userSelectionData.slotId = slot;
  }

  /**
   * Resets the user selection
   */
  resetGroundSelection() {
    this.userSelectionData = new UserSlotSelectionInfo();
  }

  /**
   * Resets the facility selection
   */
  resetFacilitySelection() {
    this.userSelectionData.facilityId = '';
  }

  /**
   * Resets the slot selection
   */
  resetSlotSelection() {
    this.userSelectionData.slotId = '';
  }

  /**
   * Returns true if the slot is selected
   */
  get isSlotSelected(): boolean {
    return this.userSelectionData.slotId !== '' && this.userSelectionData.facilityId !== '';
  }

  /**
   * Returns observable for continue step change
   */
  get _continueStepChange() {
    return this.continueStepChange.asObservable();
  }

  /**
   * Gets the tab date
   * @param date
   * @returns
   */
  getTabDate(date: any): string {
    return this.datePipe.transform(new Date(date).getTime(), Constants.DATE_TIME_FORMATS.format_1) || '';
  }

  /**
   * Continues to the next step
   */
  continue(): void {
    this.sessionStorage.set(SessionStorageProperties.USER_GROUND_SELECTION, this.userSelectionData);
    if (this.userSelectionData.slotId && this.userSelectionData.facilityId) {
      this.continueStepChange.next(this.userSelectionData);
      this.resetGroundSelection();
    } else {
      console.log('Invalid selection data!');
    }
  }
}

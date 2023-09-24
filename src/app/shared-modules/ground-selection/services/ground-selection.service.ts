import { Injectable } from '@angular/core';
import { InteractiveCardData } from '@app/shared-modules/interactive-card/models/interactive-card.model';
import { SelectedGroundInfo, TabLabel, UserSlotSelectionInfo } from '../models/ground-selection.model';
import { Router } from '@angular/router';
import { SessionStorageService } from '@app/services/session-storage.service';
import { SessionStorageProperties } from '@app/constant/app-constants';

@Injectable({
  providedIn: 'root',
})
export class GroundSelectionService {

  private userSelectionData: UserSlotSelectionInfo = new UserSlotSelectionInfo();

  constructor(
    private router: Router,
    private sessionStorage: SessionStorageService
  ) { }

  /**
   * Creates the ground selection data
   * @param selection
   * @returns
   */
  createGroundSelectionData(selection: InteractiveCardData): SelectedGroundInfo {
    const data = new SelectedGroundInfo();
    data.title = selection.title;
    data.subtitle = selection.subtitle;
    data.tabs = [
      { label: TabLabel.today, subLabel: '8 Tue', },
      { label: TabLabel.tomorrow, subLabel: '9 Wed', },
      { label: TabLabel.dayAfter, subLabel: '10 Thu', },
    ]
    data.facilities = [
      { name: '7v7 A', slotHrs: ['12 AM', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM', '10 AM',] },
      { name: '7v7 B', slotHrs: ['12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM'] },
      { name: '10v10 B', slotHrs: ['7 PM', '8 PM', '9 PM',] },
    ];
    data.spotData = { min: 0, max: 1 };
    return data;
  }

  /**
   * Fetches the grounds from the API
   * @returns
   */
  getGrounds() {
    // API call
    const grounds: InteractiveCardData[] = [];
    for (let i = 1; i <= 14; i++) {
      const data = new InteractiveCardData();
      data.id = i.toString();
      data.title = 'Gallant Play Arena ' + i;
      data.subtitle = 'Vaishali, Ghaziabad';
      data.descriptionHtml = '₹110 onwards<br> (per person)';
      data.actionBtn.label = 'Select';
      data.actionBtn.isSelectable = true;
      data.imgSrc =
        'https://cdn.pixabay.com/photo/2015/03/17/02/01/cubes-677092_1280.png';
      grounds.push(data);
    }
    return grounds;
  }

  /**
   * Updates the ground selection
   * @param updatedValue
   */
  updateGround(updatedValue: string) {
    this.userSelectionData.ground = updatedValue;
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
    this.userSelectionData.facility = facility;
  }

  /**
   * Updates the slot selection
   * @param slot
   */
  updateSlotSelection(slot: string) {
    this.userSelectionData.slot = slot;
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
    this.userSelectionData.facility = '';
  }

  /**
   * Resets the slot selection
   */
  resetSlotSelection() {
    this.userSelectionData.slot = '';
  }

  /**
   * Returns true if the slot is selected
   */
  get isSlotSelected(): boolean {
    return this.userSelectionData.slot !== '' && this.userSelectionData.facility !== '';
  }

  /**
   * Continues to the next step
   */
  continue() {
    this.sessionStorage.set(SessionStorageProperties.USER_GROUND_SELECTION, this.userSelectionData);
    this.resetGroundSelection();
    this.router.navigate(['/main', 'payment']);
  }
}

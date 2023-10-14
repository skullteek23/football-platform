import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectedGroundInfo, UserSlotSelectionInfo } from '../../models/ground-selection.model';
import { GroundSelectionService } from '../../services/ground-selection.service';
import { GroundFacility, GroundSlot } from '@app/models/ground.model';
import { IListOption } from '@app/models/common.model';
import { GroundService } from '@app/services/ground.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { common } from '@environments/environment.common';
import { DateParseUtility } from '@app/utils/date-parse-utility';
import { SnackbarService } from '@app/services/snackbar.service';
import { GroundSelectionMessages } from '@app/constant/app-messages';
import { SessionStorageService } from '@app/services/session-storage.service';
import { SessionStorageProperties } from '@app/constant/app-constants';

@Component({
  selector: 'app-current-selection',
  templateUrl: './current-selection.component.html',
  styleUrls: ['./current-selection.component.scss'],
})
export class CurrentSelectionComponent implements OnInit {
  @Input() set data(value: SelectedGroundInfo) {
    if (!value || !value.facilities?.length) {
      console.log('No Facilities Found!');
      return;
    }
    this.initValue(value);
  }
  @Input() showSpotCount = false;
  @Input() isFocused = true;
  @Output() panelClosed = new EventEmitter<boolean>();

  readonly messages = GroundSelectionMessages;

  _data: SelectedGroundInfo = new SelectedGroundInfo();
  spotCount = 1;
  facilityList: GroundFacility[] = [];
  slots: GroundSlot[] = [];
  slotsViewList: IListOption[] = [];
  namesList: IListOption[] = [];
  selectedFacility!: IListOption;
  selectedSlot!: GroundSlot;
  selectedIndex: number = 0;
  formatter: any;

  constructor(
    private groundSelectionService: GroundSelectionService,
    private groundService: GroundService,
    private snackbarService: SnackbarService,
    private sessionStorageService: SessionStorageService
  ) {
    this.formatter = common.attributeFormatter.tabDay;
  }

  ngOnInit(): void {
  }

  /**
   * Initializes the value of selection
   * @param value
   */
  initValue(value: SelectedGroundInfo) {
    this._data = JSON.parse(JSON.stringify(value));
    this.facilityList = value.facilities;
    this.namesList = value.facilities.map((facility) => ({ viewValue: facility.name, value: facility.id }));
    this.loadSavedData();
    this.groundSelectionService.resetSlotSelection();;
    this.initSpotCount();
  }

  /**
   * Loads the saved data from storage
   */
  loadSavedData() {
    const groundSelectionData: UserSlotSelectionInfo = this.sessionStorageService.get(SessionStorageProperties.USER_GROUND_SELECTION);
    if (groundSelectionData?.facilityId) {
      const facility = this.facilityList.find(facility => facility.id === groundSelectionData.facilityId);
      if (facility) {
        const selection: IListOption = { viewValue: facility.name, value: facility.id };
        this.selectFacility(selection);
      }
    }
  }

  /**
   * Closes the panel
   */
  close() {
    this.panelClosed.emit(true);
  }

  /**
   * Adds the spot count
   */
  addSpotCount() {
    if (this.spotCount >= this.selectedSlot.availableSpot) {
      return;
    }
    this.spotCount++;
    this.groundSelectionService.updateSpotCount(this.spotCount);
  }

  /**
   * Subtracts the spot count
  */
  subtractSpotCount() {
    if (this.spotCount <= 1) {
      return;
    }
    this.spotCount--;
    this.groundSelectionService.updateSpotCount(this.spotCount);
  }

  /**
   * Triggered when the tab is changed
   */
  tabChange() {
    this.slotsViewList = [];
    this.groundSelectionService.resetSlotSelection();
    this.groundSelectionService.resetFacilitySelection();
    this.selectFacility(new IListOption());
  }

  /**
   * Selects the facility
   * @param selectedFacility
   */
  selectFacility(selection: IListOption) {
    if (selection.value && this.selectedFacility?.value !== selection?.value) {
      this.selectedFacility = selection;
      this.getSlots();
    } else {
      this.selectedFacility = new IListOption();
      this.setSlots([]);
    }
  }

  /**
   * Gets the slots
   */
  getSlots() {
    this.groundService.getFacilitySlots(this.selectedFacility.value, this.selectedIndex).subscribe({
      next: (response: GroundSlot[]) => {
        if (response?.length) {
          this.setSlots(response);
        } else {
          this.snackbarService.displayError(this.messages.error.noSlots);
        }
        this.groundSelectionService.updateFacility(this.selectedFacility.value);
        this.groundSelectionService.resetSlotSelection();
      },
      error: (error) => {
        this.setSlots([]);
        this.snackbarService.displayError(error);
        this.groundSelectionService.updateFacility(this.selectedFacility.value);
        this.groundSelectionService.resetSlotSelection();
      }
    });
  }

  /**
   * Sets the slots
   * @param response
   */
  setSlots(response: GroundSlot[]) {
    this.slots = response;
    this.slotsViewList = response.map(slot => ({ value: slot.id, viewValue: DateParseUtility.formatTimestampTo12Hour(slot.timestamp) }));;
  }

  /**
   * Called when the slot is selected
   * @param slot
   */
  selectSlot(slot: IListOption) {
    if (slot) {
      const selectedSlot = this.slots.find(slotItem => slotItem.id === slot.value);
      if (selectedSlot) {
        this.spotCount = 1;
        this.groundSelectionService.updateSlotSelection(slot.value);
        this.selectedSlot = selectedSlot;
        this.initSpotCount();
      }
    }
  }

  /**
   * Initializes the spot count
  */
  initSpotCount() {
    this.spotCount = 1
    this.groundSelectionService.updateSpotCount(this.spotCount);
  }
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectedGroundInfo, TurfData } from '../../models/ground-selection.model';
import { GroundSelectionService } from '../../services/ground-selection.service';

@Component({
  selector: 'app-current-selection',
  templateUrl: './current-selection.component.html',
  styleUrls: ['./current-selection.component.scss'],
})
export class CurrentSelectionComponent implements OnInit {
  @Input() set data(value: SelectedGroundInfo) {
    if (value.facilities.length === 0) {
      console.log('No Facilities Found!');
      return;
    }
    this._data = JSON.parse(JSON.stringify(value));
    this.facilityNames = value.facilities.map((facility) => facility.name);
    this.groundSelectionService.resetSlotSelection();
  }
  @Input() showSpotCount = false;
  @Input() isFocused = true;
  @Output() panelClosed = new EventEmitter<boolean>();

  _data: SelectedGroundInfo = new SelectedGroundInfo();
  selectedFacilitySlots: string[] = [];
  spotCount = 0;
  facilityNames: string[] = [];
  facility = new TurfData

  constructor(
    private groundSelectionService: GroundSelectionService
  ) { }

  ngOnInit(): void { }

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
    this.spotCount++;
    this.groundSelectionService.updateSpotCount(this.spotCount);
  }

  /**
   * Subtracts the spot count
  */
  subtractSpotCount() {
    this.spotCount--;
    this.groundSelectionService.updateSpotCount(this.spotCount);
  }

  /**
   * Selects the facility
   * @param selectedFacility
   */
  selectFacility(selectedFacility: string) {
    if (selectedFacility) {
      const facility = this._data.facilities.find((facility) => facility.name.toLowerCase() === selectedFacility.toLowerCase());
      if (facility) {
        this.facility = facility;
        this.selectedFacilitySlots = facility?.slotHrs || [];
        this.groundSelectionService.updateFacility(selectedFacility);
        this.groundSelectionService.resetSlotSelection();
      } else {
        console.log('Facility not found!');
      }
    }
  }

  /**
   * Called when the slot is selected
   * @param slot
   */
  selectSlot(slot: string) {
    if (slot) {
      this.groundSelectionService.updateSlotSelection(slot);
    }
  }

  /**
   * Called when tab is changed
   */
  tabChange() {
    if (this.isFocused) {
      this.groundSelectionService.resetFacilitySelection();
    }
  }
}

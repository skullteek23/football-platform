import { GroundFacility, TabLabel } from '@ballzo-ui/core';

export class SelectedGroundInfo {
  title: string = 'Title';
  subtitle: string = 'Subtitle';
  tabs: TabData[] = [];
  facilities: GroundFacility[] = [];
}

export class UserSlotSelectionInfo {
  slot: string = '';
  ground: string = '';
  facility: string = '';
  spots: number = 0;
  amount: number = 0;
}

export class TabData {
  label: TabLabel = TabLabel.today;
  subLabel: string = 'Sub';
}

export class SpotData {
  min: number = 0;
  max: number = 20;
}

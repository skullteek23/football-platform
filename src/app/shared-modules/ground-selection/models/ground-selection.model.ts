import { GroundFacility } from '@ballzo-ui/core/ground';

export class SelectedGroundInfo {
  title: string = 'Title';
  subtitle: string = 'Subtitle';
  tabs: TabData[] = [];
  facilities: GroundFacility[] = [];
}

export class UserSlotSelectionInfo {
  groundId: string = '';
  facilityId: string = '';
  slotId: string = '';
  spots: number = 1;
}

export class TabData {
  label: TabLabel = TabLabel.today;
  subLabel: string = 'Sub';
}

export enum TabLabel {
  today = 0,
  tomorrow = 1,
  dayAfter = 2,
}

export class SpotData {
  min: number = 0;
  max: number = 20;
}

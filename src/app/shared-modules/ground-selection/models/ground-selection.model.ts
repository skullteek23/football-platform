export class SelectedGroundInfo {
  title: string = 'Title';
  subtitle: string = 'Subtitle';
  tabs: TabData[] = [];
  facilities: TurfData[] = [];
  spotData: SpotData = new SpotData();
}

export class UserSlotSelectionInfo {
  ground: string = '';
  facility: string = '';
  slot: string = '';
  spots: number = 1;
}

export class TabData {
  label: TabLabel = TabLabel.today;
  subLabel: string = 'Sub';
}

export class TurfData {
  name: string = '';
  slotHrs: string[] = [];
}

export enum TabLabel {
  today = 'Today',
  tomorrow = 'Tomorrow',
  dayAfter = 'Day After',
}

export enum DayTimes {
  morning = 'Morning',
  afternoon = 'Afternoon',
  evening = 'Evening',
}

export class SpotData {
  min: number = 0;
  max: number = 20;
}

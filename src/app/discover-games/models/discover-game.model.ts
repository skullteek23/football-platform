import { DateParseUtility, TabLabel } from "@ballzo-ui/core";

export class DiscoverGameSlot {
  groundId: string = '';
  facilityId: string = '';
  slotId: string = '';
  groundName: string = '';
  facilityName: string = '';
  timestamp: number = new Date().getTime();
  teamOneList: string[] = ['', '', '', '', '', '', ''];
  teamTwoList: string[] = ['', '', '', '', '', '', ''];
  availableSpots: number = 0;
  price = 0;

  get _totalSpots(): number {
    return this.teamOneList.length + this.teamTwoList.length;
  }

  get _filledSpots(): number {
    return this._totalSpots - this.availableSpots;
  }

  get _day(): TabLabel {
    return DateParseUtility.getTimeRelative(this.timestamp);
  }
}

import { Constants } from "@app/constant/app-constants";
import { ContactInfo } from "./contact.model";

export class Ground {
  id: string = '';
  name: string = '';
  addressLine: string = '';
  imgLinks: string[] = [];
  mapLink: string = '';
  city: string = '';
  state: string = '';
  zip!: number;
  price: GroundPrice = new GroundPrice();
  status: GroundStatus = GroundStatus.pending;

  get imgLink(): string {
    return this.imgLinks?.length ? this.imgLinks[0] : Constants.DEFAULT_IMG;
  }
}

export class GroundAdditionalInfo {
  description: string = '';
  rules: string = '';
  website: string = '';
  contactInfo = new ContactInfo();
}

export class GroundFacility {
  id: string = '';
  name: string = '';
  groundId: string = '';
  maxPlayers: number = Constants.DEFAULT_FACILITY_MAX_PLAYER_LIMIT;
  status: FacilityStatus = FacilityStatus.notAvailable;
}

export class GroundSlot {
  id: string = '';
  timestamp: number = new Date().getTime();
  groundId: string = '';
  facilityId: string = '';
  allowedCount: number = Constants.DEFAULT_FACILITY_ALLOWED_PLAYER_LIMIT;
  participantCount: number = 0;
  status: SlotStatus = SlotStatus.notAvailable;
  price = Constants.DEFAULT_SLOT_PRICE;

  addParticipant(update: number): void {
    const newCount = this.participantCount + Number(update);
    if (newCount <= this.allowedCount) {
      this.participantCount = newCount;
    }
  }

  updateStatus(): void {
    if (this.participantCount >= this.allowedCount) {
      this.status = SlotStatus.booked;
    }
  }

  getTimeOfDay(): string {
    const date = new Date(this.timestamp);
    const hour = date.getHours();

    if (hour >= 5 && hour < 12) {
      return Constants.DAY_TIMES.morning;
    } else if (hour >= 12 && hour < 17) {
      return Constants.DAY_TIMES.afternoon;
    } else if (hour >= 17 && hour < 21) {
      return Constants.DAY_TIMES.evening;
    } else {
      return Constants.DAY_TIMES.night;
    }
  }

  get availableSpot(): number {
    return this.allowedCount - this.participantCount;
  }

  get isFull(): boolean {
    return this.participantCount >= this.allowedCount;
  }

  get isCancelled(): boolean {
    return this.status === SlotStatus.cancelled;
  }

  get isRecent(): boolean {
    return this.timestamp > (new Date().getTime() - Constants.ONE_HOUR_IN_MILLISECONDS);
  }
}

export class GroundPrice {
  weekdays: number = 0;
  weekends: number = 0;
}

export enum GroundStatus {
  pending = 0,
  approved = 1,
  rejected = 2,
}

export enum FacilityStatus {
  notAvailable = 0,
  available = 1
}

export enum SlotStatus {
  notAvailable = 0,
  available = 1,
  booked = 2,
  cancelled = 3
}

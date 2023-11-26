import { Injectable } from '@angular/core';
import { Ground, GroundSlot, SlotStatus } from '@ballzo-ui/core';
import { Booking } from '@ballzo-ui/core';
import { InteractiveCardData } from '@app/shared-modules/interactive-card/models/interactive-card.model';
import { HomeConstants } from '../constants/home.constants';
import { BackgroundCSS } from '@ballzo-ui/core';
import { DatePipe } from '@angular/common';
import { Constants } from '@ballzo-ui/core';
import { ColorsUtility } from '@app/utils/colors-utility';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(
    private datePipe: DatePipe
  ) { }

  /**
   * Parses the booking data
   * @param bookings
   * @param grounds
   * @param slots
   * @returns
   */
  parseBookingData(bookings: Booking[], grounds: Ground[], slots: GroundSlot[]): InteractiveCardData[] {
    if (!bookings || bookings.length === 0 || !grounds || grounds.length === 0 || !slots || slots.length === 0) {
      return [];
    }
    const data: InteractiveCardData[] = [];
    bookings.forEach(booking => {
      const ground = grounds.find(ground => ground.id === booking.groundId);
      const slot = slots.find(slot => slot.id === booking.slotId);
      if (ground && slot) {
        const cardData = new InteractiveCardData();
        cardData.title = ground.name;
        cardData.subtitle = '';
        cardData.descriptionHtml = `Match Starts <br/>${this.datePipe.transform(slot.timestamp, Constants.DATE_TIME_FORMATS.format_4)}`;
        cardData.imgSrc = ground.imgLink;
        cardData.id = booking.slotId;
        cardData.actionBtn.label = HomeConstants.confirmed
        cardData.actionBtn.isSelectable = true;
        cardData.actionBtn.type = 'custom';
        cardData.actionBtn.customStyle = this.getDynamicStyle(slot);
        if (slot.isCancelled) {
          cardData.actionBtn.customContent = HomeConstants.CANCELLED;
        } else if (slot.isFull) {
          cardData.actionBtn.customContent = HomeConstants.GAME_ON;
        } else if (slot.isOngoing) {
          cardData.actionBtn.customContent = HomeConstants.ONGOING;
        } else if (slot.isFinished) {
          cardData.actionBtn.customContent = HomeConstants.FINISHED;
        } else {
          cardData.actionBtn.customContent = `${HomeConstants.confirmed} ${slot.participantCount}/${slot.allowedCount}`;
        }
        data.push(cardData);
      }
    })
    return data;
  }

  /**
   * Gets the dynamic style for the slot
   * @param slot
   * @returns
   */
  getDynamicStyle(slot: GroundSlot): object {
    let bgStyle = new BackgroundCSS();
    if (slot) {
      const final = slot.allowedCount;
      const current = slot.participantCount;
      const currentPercentage = (current / final) * 100;

      if (slot.status === SlotStatus.cancelled) {
        bgStyle.background = ColorsUtility.red;
        bgStyle.color = 'white';
      } else if (currentPercentage >= 100) {
        bgStyle.background = ColorsUtility.green;
      } else if (slot.isOngoing) {
        bgStyle.background = ColorsUtility.red;
        bgStyle.color = 'white';
      } else if (slot.isFinished) {
        bgStyle.background = ColorsUtility.grey_bg;
      } else {
        bgStyle.background = ColorsUtility.getFillingGradient(ColorsUtility.yellow, ColorsUtility.white, currentPercentage);
      }
    }

    return bgStyle;
  }
}

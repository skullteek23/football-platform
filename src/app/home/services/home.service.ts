import { Injectable } from '@angular/core';
import { Ground } from '@app/models/ground.model';
import { Booking } from '@app/models/order.model';
import { InteractiveCardData } from '@app/shared-modules/interactive-card/models/interactive-card.model';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor() { }

  parseBookingData(bookings: Booking[], grounds: Ground[]): InteractiveCardData[] {
    if (!bookings || bookings.length === 0 || !grounds || grounds.length === 0) {
      return [];
    }
    const data: InteractiveCardData[] = [];
    bookings.forEach(booking => {
      const ground = grounds.find(ground => ground.id === booking.groundId);
      if (ground) {
        const cardData = new InteractiveCardData();
        cardData.title = ground.name;
        cardData.subtitle = ground.city;
        cardData.descriptionHtml = 'descr';
        cardData.imgSrc = ground.imgLink;
        cardData.id = booking.slotId;
        cardData.actionBtn.label = 'Confirmed';
        cardData.actionBtn.isSelectable = true;
        data.push(cardData);
      }
    })
    return data;
  }
}

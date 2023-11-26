import { Injectable } from '@angular/core';
import { Ground, GroundFacility } from '@ballzo-ui/core';
import { GroundService } from '@app/services/ground.service';
import { InteractiveCardData } from '@app/shared-modules/interactive-card/models/interactive-card.model';

@Injectable({
  providedIn: 'root'
})
export class GroundsNearMeService {

  constructor(
    private groundService: GroundService
  ) { }

  /**
   * Get the card data
   * @param data
   * @returns
   */
  getCardData(data: Ground[]): InteractiveCardData[] {
    if (!data || data.length === 0) {
      return [];
    }

    const cardDataList: InteractiveCardData[] = [];
    data.forEach(ground => {
      const cardData = new InteractiveCardData();
      cardData.id = ground.id;
      cardData.title = ground.name.trim();
      cardData.descriptionHtml = `${this.groundService.getLeastPrice(ground.price)}`;
      cardData.subtitle = ground.city;
      cardData.actionBtn.label = 'Learn more';
      cardData.actionBtn.isSelectable = true;
      cardData.imgSrc = ground.imgLink;
      cardDataList.push(cardData);
    })
    return cardDataList;
  }

  /**
   * Parses the facility data
   */
  parseFacilityData(response: GroundFacility[]): string[] {
    if (!response || response.length === 0) {
      return [];
    }
    return response.map(facility => facility.name);
  }
}

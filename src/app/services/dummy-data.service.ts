import { Injectable } from '@angular/core';
import { CoreApiService } from './core-api.service';
import { convertObjectToFirestoreData } from '@app/utils/objects-utility';
import { FacilityStatus, Ground, GroundFacility, GroundSlot, GroundStatus, SlotStatus } from '@app/models/ground.model';

@Injectable({
  providedIn: 'root'
})
export class DummyDataService {

  constructor(
    private apiService: CoreApiService
  ) {
    // this.addData();
  }

  addData() {
    const collection = 'slots';
    // const data = convertObjectToFirestoreData(this.buildGroundData());
    // const data = convertObjectToFirestoreData(this.buildFacilityData());
    const data = convertObjectToFirestoreData(this.buildSlotData());
    this.apiService.addDocument(collection, data);
  }

  buildGroundData() {
    const data = new Ground();
    data.name = 'Ground Axa';
    data.addressLine = 'Address Line 3';
    data.city = 'Delhi';
    data.price.weekdays = 100;
    data.price.weekends = 200;
    data.zip = 123456;
    data.status = GroundStatus.approved;
    data.imgLink = 'https://picsum.photos/200/300';
    return data;
  }

  buildFacilityData() {
    const data = new GroundFacility();
    data.groundId = 'BUSm4jeSbdxBtpUJFewb';
    data.name = '7v7 Astro Turf';
    data.maxPlayers = 14;
    data.status = FacilityStatus.available;
    return data;
  }

  buildSlotData() {
    const data = new GroundSlot();
    data.facilityId = 'xl4sZoQ7O3oJu9wqrbr6';
    data.groundId = 'BUSm4jeSbdxBtpUJFewb';
    data.timestamp = new Date('September 30, 2023 16:00:00').getTime();
    data.status = SlotStatus.available;
    data.allowedCount = 14;
    data.price = 200;
    return data;
  }

}

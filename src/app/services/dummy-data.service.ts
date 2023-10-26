import { Injectable } from '@angular/core';
import { CoreApiService } from './core-api.service';
import { convertObjectToFirestoreData } from '@app/utils/objects-utility';
import { FacilityStatus, Ground, GroundFacility, GroundSlot, GroundStatus, SlotStatus } from '@app/models/ground.model';
import { TransactionType, WalletTransaction } from '@app/models/order.model';

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
    // const data = convertObjectToFirestoreData(this.buildTransactionData());
    this.apiService.addDocument(collection, data);
  }

  buildGroundData() {
    const data = new Ground();
    data.name = 'KR Mangalam World School';
    data.addressLine = 'Plot No 11, Sector 6, 209, Emerald Court 2 Rd, near Arogya Hospital, Sector 7, Vaishali Extension, Ramprastha Greens, Vaishali, Ghaziabad, Uttar Pradesh 201012';
    data.city = 'Ghaziabad';
    data.state = 'Uttar Pradesh';
    data.mapLink = '';
    data.price.weekdays = 150;
    data.price.weekends = 170;
    data.zip = 201012;
    data.status = GroundStatus.approved;
    data.imgLinks = ['https://lh3.googleusercontent.com/p/AF1QipNvZ6tq2SsRuZnf-vlgwDN7gnnsCf3PY_vV7TXD=s1360-w1360-h1020'];
    return data;
  }

  buildFacilityData() {
    const data = new GroundFacility();
    data.groundId = 'p7f86mlu0MR3a1pOysRy';
    data.name = '5v5 Rooftop';
    data.maxPlayers = 10;
    data.status = FacilityStatus.notAvailable;
    return data;
  }

  buildSlotData() {
    const data = new GroundSlot();
    data.facilityId = 'QoBl7khNFBRXJDbqUWuB';
    data.groundId = 'p7f86mlu0MR3a1pOysRy';
    data.timestamp = new Date('26 October, 2023 21:00:00').getTime();
    data.status = SlotStatus.available;
    data.allowedCount = 14;
    data.price = 150;
    return data;
  }

  buildTransactionData() {
    const data = new WalletTransaction();
    data.amount = 2500;
    data.transactionFor = 'ground booking';
    data.type = TransactionType.debit;
    data.uid = 'Z3bCRLp4mtSvHO0othLHerlU8EE3';
    data.orderId = 'ODKYQAAW01MN';
    return data;
  }

}

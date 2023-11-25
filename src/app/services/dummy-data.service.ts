import { Injectable } from '@angular/core';
import { CoreApiService } from './core-api.service';
import { convertObjectToFirestoreData, getRandomString } from '@ballzo-ui/core/utils';
import { FacilityStatus, Ground, GroundAdditionalInfo, GroundFacility, GroundSlot, GroundStatus, SlotStatus } from '@ballzo-ui/core/ground';
import { WalletTransaction } from '@app/models/order.model';
import { TransactionType } from '@ballzo-ui/core/transaction';

@Injectable({
  providedIn: 'root'
})
export class DummyDataService {

  constructor(
    private apiService: CoreApiService
  ) {
    // this.addData();
    // this.addGround();
    // this.addSlot();
  }

  addGround() {
    const id = getRandomString(28);
    const facility1Id = getRandomString(28);
    const facility2Id = getRandomString(28);

    const data = {
      groundId: id,
      name: 'Test Ground',
      addressLine: 'Test Address',
      city: 'Test City',
      state: 'Test State',
      mapLink: 'Test Map Link',
      price: 150,
      zip: 201012,
      status: GroundStatus.approved,
      imgLinks: ['https://lh3.googleusercontent.com/p/AF1QipNvZ6tq2SsRuZnf-vlgwDN7gnnsCf3PY_vV7TXD=s1360-w1360-h1020'],
      contactInfo: {
        email: 'test email',
        name: 'test name',
        phone: 'test phone'
      },
      description: 'test description',
      rules: 'test rules',
      website: 'test website',
      facilities: [
        {
          id: facility1Id,
          name: '7v7 A',
          status: FacilityStatus.available,
          price: 150,
          maxPlayers: 14,
          slots: [
            { facilityId: facility1Id, time: new Date('25 November, 2023 20:00:00').getTime() },
            { facilityId: facility1Id, time: new Date('25 November, 2023 21:00:00').getTime() },
            { facilityId: facility1Id, time: new Date('25 November, 2023 22:00:00').getTime() },
            { facilityId: facility1Id, time: new Date('26 November, 2023 20:00:00').getTime() },
            { facilityId: facility1Id, time: new Date('26 November, 2023 21:00:00').getTime() },
            { facilityId: facility1Id, time: new Date('26 November, 2023 22:00:00').getTime() },
            { facilityId: facility1Id, time: new Date('27 November, 2023 20:00:00').getTime() },
            { facilityId: facility1Id, time: new Date('27 November, 2023 21:00:00').getTime() },
            { facilityId: facility1Id, time: new Date('27 November, 2023 22:00:00').getTime() },
          ],
        },
        {
          id: facility2Id,
          name: '7v7 B',
          maxPlayers: 14,
          status: 'available',
          price: 150,
          slots: []
        },
      ],
    };

    this.apiService.callHttpFunction('createGround', data)
      .then((res) => {
        console.log(res);
        console.log('ground added')
      })
      .catch((err) => {
        console.log(err)
        console.log('ground add error')
      });
  }

  addSlot() {
    const groundId = 'p7f86mlu0MR3a1pOysRy';
    const facilityId = 'abcd7khNFBRXJDbqUWuB';
    const facility = {
      price: 150,
      maxPlayers: 14,
      slots: [
        { facilityId, time: new Date('26 November, 2023 20:00:00').getTime() },
        { facilityId, time: new Date('26 November, 2023 21:00:00').getTime() },
        { facilityId, time: new Date('26 November, 2023 22:00:00').getTime() },
      ],
    }
    const data = {
      facility,
      groundId
    }
    this.apiService.callHttpFunction('addNewSlot', data)
      .then((res) => {
        console.log(res);
        console.log('slot added');
      })
      .catch((err) => {
        console.log(err)
        console.log('slot add error');
      });
  }

  addData() {
    const collection = 'slots';
    // const data = convertObjectToFirestoreData(this.buildGroundData());
    // const data = convertObjectToFirestoreData(this.buildFacilityData());
    const data = convertObjectToFirestoreData(this.buildSlotData());
    // const data = convertObjectToFirestoreData(this.buildTransactionData());
    // const data = convertObjectToFirestoreData(this.buildGroundAdditionalData());
    this.apiService.addDocument(collection, data);
    // this.apiService.addDocument(collection, data, 'p7f86mlu0MR3a1pOysRy');
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

  buildGroundAdditionalData() {
    const data = new GroundAdditionalInfo();
    data.contactInfo.email = 'admin@ballzo.in';
    data.contactInfo.name = 'Nitish Kumar';
    data.contactInfo.phone = '9999999999';
    data.description = 'The Millennium Soccer Ground is a 100m x 64m natural grass field located at 123 Sports Avenue, featuring floodlights, an electronic scoreboard, and a seating capacity of 500. Open from 8 AM to 11 PM, it offers';
    data.rules = '';
    data.website = 'www.gallantplay.com';
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
    data.timestamp = new Date('26 November, 2023 20:00:00').getTime();
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

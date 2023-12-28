import { Injectable } from '@angular/core';
import { CoreApiService } from './core-api.service';
import { Observable, map, tap } from 'rxjs';
import { TabLabel, convertFirestoreData, convertFirestoreDataArray } from '@ballzo-ui/core';
import { FacilityStatus, Ground, GroundAdditionalInfo, GroundFacility, GroundPrice, GroundSlot, GroundStatus, SlotStatus } from '@ballzo-ui/core';
import { UserSlotSelectionInfo } from '@app/shared-modules/ground-selection/models/ground-selection.model';
import { DateParseUtility } from '@ballzo-ui/core';
import { Constants } from '@ballzo-ui/core';
import { cloudFunctionNames } from '@app/utils/constant/api-constants';

@Injectable({
  providedIn: 'root'
})
export class GroundService {

  constructor(
    private apiService: CoreApiService
  ) { }

  /**
   * Gets the grounds
   * @returns
   */
  getGrounds(): Observable<Ground[]> {
    return this.apiService.getCollectionWithIds('grounds')
      .pipe(
        map(response => convertFirestoreDataArray(response, Ground)),
        map(response => this.filterAvailableGrounds(response)),
      );
  }

  /**
   * Gets the grounds by state
   * @returns
   */
  getGroundsByState(state: string): Observable<Ground[]> {
    const query = [];
    query.push(this.apiService.getWhereQuery('state', '==', state));
    return this.apiService.queryCollectionSnapshot('grounds', query)
      .pipe(
        map(response => convertFirestoreDataArray(response, Ground)),
        map(response => this.filterAvailableGrounds(response)),
      );
  }

  /**
   * Gets the ground facilities
   * @param groundId
   * @returns
   */
  getFacilities(groundId: string): Observable<GroundFacility[]> {
    const query = [];
    query.push(this.apiService.getWhereQuery('groundId', '==', groundId));
    return this.apiService.queryCollectionSnapshot('facilities', query)
      .pipe(
        map(response => convertFirestoreDataArray(response, GroundFacility)),
        map(response => this.filterAvailableFacilities(response)),
      );
  }

  /**
   * Gets all facilities
   * @returns
   */
  getAllFacilities(): Observable<GroundFacility[]> {
    return this.apiService.getCollectionWithIds('facilities')
      .pipe(
        map(response => convertFirestoreDataArray(response, GroundFacility)),
      );
  }

  /**
   * Gets the ground slots per facility per day
   * @param facilityId
   * @param day
   * @returns
   */
  getFacilitySlots(facilityId: string, day: TabLabel): Observable<GroundSlot[]> {
    const query = [];
    const { max, min } = DateParseUtility.getMaxRange(day);
    query.push(this.apiService.getWhereQuery('facilityId', '==', facilityId));
    query.push(this.apiService.getWhereQuery('timestamp', '>=', min));
    query.push(this.apiService.getWhereQuery('timestamp', '<=', max));
    return this.apiService.queryCollectionSnapshot('slots', query)
      .pipe(
        map(response => convertFirestoreDataArray(response, GroundSlot)),
        // To be useful when booking a slot
        map(response => this.filterAvailableSlots(response)),
      );
  }

  /**
   * Returns the slots for the next three days
   * @returns
  */
  getSlotsByRange(startTime: number = 0, endTime: number = new Date().getTime() + Constants.THREE_DAYS_IN_MILLISECONDS): Observable<GroundSlot[]> {
    const query = [];
    query.push(this.apiService.getWhereQuery('timestamp', '>=', startTime));
    query.push(this.apiService.getWhereQuery('timestamp', '<=', endTime));
    return this.apiService.queryCollectionSnapshot('slots', query)
      .pipe(
        map(response => convertFirestoreDataArray(response, GroundSlot)),
        map(response => this.filterValidSlots(response)),
        // To be useful when viewing already booked slots
        // All slots such as cancelled, booked, available will be shown
      );
  }

  /**
   * Gets the a particular slot by Id
   * @param slotId
   * @returns
   */
  getFacilitySlot(slotId: string): Observable<GroundSlot> {
    return this.apiService.getDocument('slots', slotId)
      .pipe(
        map(response => convertFirestoreData(response, GroundSlot)),
      );
  }

  /**
   * Gets the a particular ground by id
   * @param groundId
   * @returns
   */
  getGround(groundId: string): Observable<Ground> {
    return this.apiService.getDocument('grounds', groundId)
      .pipe(
        map(response => convertFirestoreData(response, Ground)),
      );
  }

  /**
   * Gets the a particular ground additional info by id
   * @param groundId
   * @returns
   */
  getGroundInfo(groundId: string): Observable<GroundAdditionalInfo> {
    return this.apiService.getDocument('ground-additional-info', groundId)
      .pipe(
        map(response => convertFirestoreData(response, GroundAdditionalInfo)),
      );
  }

  /**
   * Gets the a particular facility by id
   * @param facilityId
   * @returns
   */
  getFacility(facilityId: string): Observable<GroundFacility> {
    return this.apiService.getDocument('facilities', facilityId)
      .pipe(
        map(response => convertFirestoreData(response, GroundFacility)),
      );
  }

  /**
   * Temporarily locks the slot
   * @param slotId
   */
  // lockSlot(slotId: string): Promise<any> {
  //   const data: Partial<GroundSlot> = {};
  //   data.lockedAt = new Date().getTime();
  //   return this.apiService.updateDocument('slots', { ...data }, slotId);
  // }

  /**
   * Updates any field in the slot
   * @param slotId
   * @param data
   * @returns
   */
  updateSlot(slotId: string, data: Partial<GroundSlot>): Promise<any> {
    return this.apiService.updateDocument('slots', { ...data }, slotId);
  }

  /**
   * Filters available grounds
   * @param response
   * @returns
   */
  filterAvailableGrounds(response: Ground[]): Ground[] {
    return response.filter(ground => ground.status === GroundStatus.approved);
  }

  /**
   * Filters available facilities
   * @param response
   * @returns
   */
  filterAvailableFacilities(response: GroundFacility[]): GroundFacility[] {
    return response.filter(facility => facility.status === FacilityStatus.available);
  }

  /**
   * Filters available slots and removes the locked slots
   * @param response
   * @returns
   */
  filterAvailableSlots(response: GroundSlot[]): GroundSlot[] {
    return response.filter(slot =>
      (slot.status === SlotStatus.available) &&
      (slot.participantCount < slot.allowedCount)
      // (!slot.hasOwnProperty('lockedAt') || ((slot.lockedAt + Constants.SEVEN_MINUTES_IN_MILLISECONDS) < new Date().getTime()))
    );
  }

  /**
   * Filters all slots that are available or booked
   * @param response
   * @returns
   */
  filterValidSlots(response: GroundSlot[]): GroundSlot[] {
    return response.filter(slot =>
      (slot.status === SlotStatus.available) ||
      (slot.status === SlotStatus.booked) ||
      (slot.status === SlotStatus.cancelled)
    );
  }

  /**
 * Gets the least price
 * @param price
 * @returns
 */
  getLeastPrice(price: GroundPrice): string {
    if (price.single > price.bulk) {
      return Constants.RUPEE_SYMBOL + price.bulk + ' onwards <br> (per person)';
    } else {
      return Constants.RUPEE_SYMBOL + price.single + ' onwards <br> (per person)';
    }
  }

  /**
   * Books a slot
   * @param {UserSlotSelectionInfo} data
   * @returns {Promise<any>}
   */
  bookSlot(data: UserSlotSelectionInfo, orderID: string): Promise<any> {
    if (data.facility && data.ground && data.slot) {
      return this.apiService.callHttpFunction(cloudFunctionNames.createBooking, {
        facilityId: data.facility,
        groundId: data.ground,
        slotId: data.slot,
        spots: data.spots,
        orderID
      });
    }
    return Promise.reject(null);
  }

}

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/authentication/auth.service';
import { SessionStorageProperties } from '@app/constant/app-constants';
import { PaymentMessages } from '@app/constant/app-messages';
import { GroundSlot, SlotStatus } from '@app/models/ground.model';
import { Booking, Order } from '@app/models/order.model';
import { Player, Position } from '@app/models/user.model';
import { GroundService } from '@app/services/ground.service';
import { OrderService } from '@app/services/order.service';
import { SessionStorageService } from '@app/services/session-storage.service';
import { SnackbarService } from '@app/services/snackbar.service';
import { UserService } from '@app/services/user.service';
import { UserSlotSelectionInfo } from '@app/shared-modules/ground-selection/models/ground-selection.model';
import { getFirestoreErrorMsg, getCloudFnErrorMsg } from '@app/utils/api-error-handling-utility';
import { isEnumKey } from '@app/utils/objects-utility';
import { getRandomString } from '@app/utils/string-utility';
import { Subject, lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private loaderStatus = new Subject<boolean>();

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private sessionStorageService: SessionStorageService,
    private groundService: GroundService,
    private snackbarService: SnackbarService,
    private router: Router,
    private userService: UserService,
  ) { }

  continue(): void {
    this.authService._user().subscribe(async user => {
      if (user?.uid) {
        this.showLoader();
        const ground: UserSlotSelectionInfo = this.sessionStorageService.get(SessionStorageProperties.USER_GROUND_SELECTION);
        const role = this.sessionStorageService.get(SessionStorageProperties.USER_POSITION_SELECTION);

        if (!role || !ground) {
          console.log('Invalid saved data!');
          return false;
        }

        // Checking if slot has space for new bookings or not
        const slotInfo = await lastValueFrom(this.groundService.getFacilitySlot(ground.slotId));
        if (slotInfo && slotInfo.allowedCount && slotInfo.allowedCount <= slotInfo.participantCount) {
          this.snackbarService.displayError(PaymentMessages.error.slotFull);
          return false;
        }

        const order = new Order();
        const booking = new Booking();
        const updatedSlot = new GroundSlot();
        const userDetails = new Player();

        const oid = getRandomString(10);
        const allPromises = [];

        order.amount = order.getTotalSlotAmount(ground.spots, slotInfo.price);
        order.ref = {};
        order.uid = user.uid;

        booking.uid = user.uid;
        booking.orderId = oid;
        booking.facilityId = ground.facilityId;
        booking.groundId = ground.groundId;
        booking.slotId = ground.slotId;
        booking.spots = ground.spots;

        updatedSlot.groundId = slotInfo.groundId;
        updatedSlot.facilityId = slotInfo.facilityId;
        updatedSlot.timestamp = slotInfo.timestamp;
        updatedSlot.price = slotInfo.price;
        updatedSlot.status = slotInfo.status;
        updatedSlot.allowedCount = slotInfo.allowedCount;
        updatedSlot.participantCount = slotInfo.participantCount;
        if (updatedSlot.addParticipant) {
          updatedSlot.addParticipant(ground.spots);
        }
        if (updatedSlot.updateStatus) {
          updatedSlot.updateStatus();
        }

        if (user.displayName) {
          userDetails.name = user.displayName;
        }
        if (String(role) && isEnumKey(role, Position)) {
          userDetails.position = role;
        }

        try {
          await this.authService.setUserRole(role);
        } catch (error) {
          this.snackbarService.displayError(getCloudFnErrorMsg(error));
        }

        allPromises.push(this.orderService.saveOrder(order, oid));
        allPromises.push(this.orderService.addBooking(booking));
        allPromises.push(this.userService.addUserDetails(userDetails, user.uid));
        allPromises.push(this.groundService.updateSlot(ground.slotId, updatedSlot));

        Promise.all(allPromises)
          .then(() => {
            this.hideLoader();
            this.sessionStorageService.remove(SessionStorageProperties.USER_GROUND_SELECTION);
            this.sessionStorageService.remove(SessionStorageProperties.USER_POSITION_SELECTION);
            this.snackbarService.displayCustomMsg(PaymentMessages.success);
            this.router.navigate(['/main', 'payment', 'success'], { queryParams: { oid } });
          })
          .catch(error => {
            this.hideLoader();
            this.router.navigate(['/main', 'payment', 'failure']);
            this.snackbarService.displayError(getFirestoreErrorMsg(error));
          });
      }
      return false;
    });
  }

  fail() {
    this.showLoader();
    this.authService._user().subscribe(user => {
      if (user?.uid) {
        const role = this.sessionStorageService.get(SessionStorageProperties.USER_POSITION_SELECTION);
        this.authService.updateUserProfile(role)
          .then(() => {
            this.sessionStorageService.remove(SessionStorageProperties.USER_GROUND_SELECTION);
            this.sessionStorageService.remove(SessionStorageProperties.USER_POSITION_SELECTION);
            this.snackbarService.displayCustomMsg(PaymentMessages.success);
            this.hideLoader();
            this.router.navigate(['/main', 'payment', 'failure']);
          })
          .catch(error => {
            this.hideLoader();
            this.router.navigate(['/main', 'payment', 'failure']);
            this.snackbarService.displayError(getFirestoreErrorMsg(error));
          })
      }
    });
  }

  _loaderStatus() {
    return this.loaderStatus.asObservable();
  }

  /**
   * Show loader
   */
  showLoader() {
    this.loaderStatus.next(true);
  }

  /**
   * Hide loader
   */
  hideLoader() {
    this.loaderStatus.next(false);
  }
}

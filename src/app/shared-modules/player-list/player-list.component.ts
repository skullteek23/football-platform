import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlayerListItem } from './models/player-list.model';
import { Observable, Subscription, combineLatest, } from 'rxjs';
import { SnackbarService } from '@app/utils/services/snackbar.service';
import { PlayerListService } from './services/player-list.service';
import { GroundService } from '@app/utils/services/ground.service';
import { Ground, GroundFacility, GroundSlot } from '@ballzo-ui/core';
import { Constants } from '@ballzo-ui/core';

@Component({
  selector: 'app-player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.scss']
})
export class PlayerListComponent implements OnInit, OnDestroy {

  readonly timeFormat = Constants.DATE_TIME_FORMATS.format_3;
  readonly dateFormat = Constants.DATE_TIME_FORMATS.format_5;

  slotID: string = '';
  slot!: GroundSlot;
  ground!: Ground;
  facility!: GroundFacility;
  playersListWhite: PlayerListItem[] = [];
  playersListBlack: PlayerListItem[] = [];
  isPageInit = false;
  dayTime: string = '';
  subscriptions = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private snackService: SnackbarService,
    private playerListService: PlayerListService,
    private groundService: GroundService
  ) { }

  ngOnInit(): void {
    this.subscriptions.add(
      this.route.params.subscribe(params => {
        if (params?.hasOwnProperty('slotid')) {
          this.slotID = params['slotid'];
          this.getSlotInfo();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /**
   * Gets the slot info
   */
  getSlotInfo() {
    this.groundService.getFacilitySlot(this.slotID).subscribe(data => {
      if (data) {
        this.slot = data;
        this.dayTime = this.slot.getTimeOfDay();
        combineLatest([
          this.playerListService.getPlayers(),
          this.playerListService.getBookings(this.slotID),
          this.getGroundInfo(),
          this.getFacility(),
        ]).subscribe({
          next: (response) => {
            this.playersListWhite = [];
            this.playersListBlack = [];
            if (response?.length === 4 && response[0]?.length && response[1]?.length && response[2] && response[3]) {
              const users = response[0];
              const bookings = response[1];
              this.ground = response[2];
              this.facility = response[3]
              const list = this.playerListService.parseResponse(bookings, users, this.facility.maxPlayers);
              list.forEach((item: PlayerListItem, index: number) => {
                if (index < (this.facility.maxPlayers / 2)) {
                  this.playersListBlack.push(item);
                } else {
                  this.playersListWhite.push(item);
                }
              });
            }
            this.isPageInit = true;
          },
          error: (error) => {
            console.log(error)
            this.isPageInit = true;
            this.snackService.displayError(error);
            this.playersListWhite = [];
            this.playersListBlack = [];
          },
        })
      }
    })
  }

  /**
   * Opens the maps
   */
  openMaps() {
    if (this.ground.mapLink) {
      window.open(this.ground.mapLink, '_blank');
    }
  }

  /**
   * Gets the ground info
   */
  getGroundInfo(): Observable<Ground> {
    return this.groundService.getGround(this.slot.groundId)
  }

  /**
   * Gets the facility info
   * @returns
   */
  getFacility(): Observable<GroundFacility> {
    return this.groundService.getFacility(this.slot.facilityId);
  }

}

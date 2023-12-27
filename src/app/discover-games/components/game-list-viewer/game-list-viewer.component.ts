import { Component, Input, OnInit, Output } from '@angular/core';
import { DiscoverGameSlot } from '@app/discover-games/models/discover-game.model';
import { ButtonTheme, ButtonConfig } from '@app/shared-modules/buttons/models/button.model';
import { common } from '@environments/environment.common';
import { Constants } from '@ballzo-ui/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-game-list-viewer',
  templateUrl: './game-list-viewer.component.html',
  styleUrls: ['./game-list-viewer.component.scss']
})
export class GameListViewerComponent implements OnInit {

  readonly buttonTheme = ButtonTheme;
  readonly CUSTOM_DATE_FORMAT_3 = Constants.DATE_TIME_FORMATS.format_3;
  readonly CUSTOM_DATE_FORMAT_6 = Constants.DATE_TIME_FORMATS.format_6;

  @Input() data = new DiscoverGameSlot();
  @Input() isSelfBookings = false;
  @Output() groundOpen = new Subject<void>();
  @Output() playerJoinRequest = new Subject<void>();
  @Output() teamJoinRequest = new Subject<void>();

  joinBtnDetails = new ButtonConfig();
  viewGroundBtnDetails = new ButtonConfig();
  joinAsTeamBtnDetails = new ButtonConfig();
  formatter: any = common.attributeFormatter.tabDay;

  constructor() { }

  ngOnInit(): void {
    this.initBtnDetails();
  }

  /**
   * Initializes button details
   */
  initBtnDetails() {
    this.joinBtnDetails.label = `Join as Player`;
    this.joinBtnDetails.icon = 'sports_soccer';

    this.joinAsTeamBtnDetails.label = `Join as Team`;
    this.joinAsTeamBtnDetails.icon = 'groups';

    this.viewGroundBtnDetails.label = 'View Ground';
    this.viewGroundBtnDetails.icon = 'grass';
  }

  /**
 * Opens the ground info bottom sheet
 * @param selection
 */
  openGround() {
    this.groundOpen.next();
  }

  /**
   * Joins the game as a player
   */
  joinGame() {
    if (this.isSelfBookings) {
      return;
    }
    this.playerJoinRequest.next();

  }

  /**
   * Joins the game as a team
   */
  joinGameAsTeam() {
    if (this.isSelfBookings) {
      return;
    }
    this.teamJoinRequest.next();
  }
}

import { Component, Input, OnInit, Output } from '@angular/core';
import { DiscoverGameSlot } from '@app/discover-games/models/discover-game.model';
import { ButtonTheme, ButtonConfig } from '@app/shared-modules/buttons/models/button.model';
import { common } from '@environments/environment.common';
import { Constants } from '@ballzo-ui/core';
import { Subject } from 'rxjs';
import { Player } from '@ballzo-ui/core';
import { DiscoverGamesService } from '@app/discover-games/services/discover-games.service';

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
  @Input() showRules = false;
  @Output() groundOpen = new Subject<void>();
  @Output() playerJoinRequest = new Subject<void>();
  @Output() teamJoinRequest = new Subject<void>();
  @Output() playersList = new Subject<void>();

  joinBtnDetails = new ButtonConfig();
  viewGroundBtnDetails = new ButtonConfig();
  joinAsTeamBtnDetails = new ButtonConfig();
  shareBtnDetails = new ButtonConfig();
  formatter: any = common.attributeFormatter.tabDay;

  constructor(
    private discoverGamesService: DiscoverGamesService
  ) { }

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

    this.shareBtnDetails.label = "Share";
    this.shareBtnDetails.icon = "share";
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

  /**
   * Opens the share icons bottom sheet
   */
  shareBtn() {
    this.discoverGamesService.shareBtn();
  }

  /**
   * Opens the players list info bottom sheet
  */
  openPlayersList() {
    this.playersList.next();

  }
  /**
   * Returns true if the game is finished
   */
  get isGameFinished() {
    return this.data?._day < 0;
  }
}

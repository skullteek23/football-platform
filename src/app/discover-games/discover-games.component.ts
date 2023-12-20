import { Component, OnInit } from '@angular/core';
import { ButtonTheme, ButtonConfig } from '@app/shared-modules/buttons/models/button.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-discover-games',
  templateUrl: './discover-games.component.html',
  styleUrls: ['./discover-games.component.scss']
})
export class DiscoverGamesComponent implements OnInit {


  whiteCardNames = ['person1', 'person2', 'Person3', 'Person4', 'Person5', 'Person6', 'Person7'];
  blackCardNames = ['person1', 'person2', 'Person3', 'Person4', 'Person5', 'Person6', 'Person7'];

  readonly buttonTheme = ButtonTheme;

  joinGameBtn = new ButtonConfig();
  groundBtn = new ButtonConfig();
  joinTeamBtn = new ButtonConfig();


  constructor() {

  }


  ngOnInit(): void {
    this.btnDetails();
  }

  btnDetails() {
    this.joinGameBtn.label = 'Join Game @99';
    this.joinGameBtn.icon = 'sports-soccer';

    this.joinTeamBtn.label = 'Join with Team @899';
    this.joinTeamBtn.icon = 'sports-soccer';

    this.groundBtn.label = 'View Ground';
    this.groundBtn.icon = 'grass';
  }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingsService } from '@app/services/bookings.service';
import { PlayerListItem } from './models/player-list.model';

@Component({
  selector: 'app-player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.scss']
})
export class PlayerListComponent implements OnInit {

  slotID: string = '';
  playersListWhite: PlayerListItem[] = [
    { name: 'Player 1', position: 'Goalkeeper', uid: '1' },
    { name: 'Player 2', position: 'Defender', uid: '2' },
    { name: 'Player 3', position: 'Defender', uid: '3' },
    { name: 'Player 4', position: 'Defender', uid: '4' },
    { name: 'Player 5', position: 'Defender', uid: '5' },
    { name: 'Player 6', position: 'Midfielder', uid: '6' },
    { name: 'Player 7', position: 'Midfielder', uid: '7' },
  ];
  playersListBlack: PlayerListItem[] = [
    { name: 'Player 1', position: 'Goalkeeper', uid: '1' },
    { name: 'Player 2', position: 'Defender', uid: '2' },
    { name: 'Player 3', position: 'Defender', uid: '3' },
    { name: 'Player 4', position: 'Defender', uid: '4' },
    { name: 'Player 5', position: 'Defender', uid: '5' },
    { name: 'Player 6', position: 'Midfielder', uid: '6' },
    { name: 'Player 7', position: 'Midfielder', uid: '7' },
  ];

  constructor(
    private route: ActivatedRoute,
    private bookingsService: BookingsService
  ) {
    this.route.params.subscribe(params => {
      if (params?.hasOwnProperty('slotid')) {
        this.slotID = params['slotid'];
        this.getSlotInfo();
      }
    });
  }

  ngOnInit(): void {
  }

  getSlotInfo() {
    // this.bookingsService.getSlotInfo(this.slotID).subscribe((data) => {
    //   // this.bookingsService.
    // });
  }
}

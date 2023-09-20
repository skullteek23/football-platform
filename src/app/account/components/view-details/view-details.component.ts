import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/authentication/auth.service';
import {
  ButtonConfig,
  ButtonTheme,
} from '@app/shared-modules/buttons/models/button.model';

@Component({
  selector: 'app-view-details',
  templateUrl: './view-details.component.html',
  styleUrls: ['./view-details.component.scss'],
})
export class ViewDetailsComponent implements OnInit {
  readonly ButtonTheme = ButtonTheme;

  logoutBtn: ButtonConfig;

  constructor(private authService: AuthService) {
    this.logoutBtn = new ButtonConfig();
    this.logoutBtn.label = 'Logout';
    this.logoutBtn.icon = 'logout';
  }

  ngOnInit(): void {}

  logout(): void {
    this.authService.logout();
  }
}

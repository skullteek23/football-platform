import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '@app/authentication/auth.service';
import { ShowConfirmationService } from '@app/services/show-confirmation.service';
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

  constructor(
    private authService: AuthService,
    private _dialog: MatDialog,
    private showConfirmationService: ShowConfirmationService
  ) {
    this.logoutBtn = new ButtonConfig();
    this.logoutBtn.label = 'Logout';
    this.logoutBtn.icon = 'logout';
  }

  ngOnInit(): void {}

  logout(): void {
    const result = this.showConfirmationService.openNativeConfirm(
      'Are you sure you want to logout?'
    );
    if (result) {
      this.authService.logout();
    }
  }
}

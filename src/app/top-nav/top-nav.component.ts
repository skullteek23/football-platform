import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/authentication/auth.service';
import { UserService } from '@app/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss'],
})
export class TopNavComponent implements OnInit {
  readonly groupLink = environment.urls.whatsAppGroup;

  isUserLogged = false;
  userBalance: number = 0;
  isHeaderInitialized = false;

  /**
   * Constructor method
   */
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) { }

  /**
   * Lifecycle method
   */
  ngOnInit(): void {
    this.checkUserLogin();
  }

  /**
   * Returns whether user is logged in or not
   */
  checkUserLogin() {
    this.authService._user().subscribe({
      next: (resp) => {
        if (resp?.uid) {
          this.getUserBalance(resp.uid);
        }
        this.isHeaderInitialized = true;
        this.isUserLogged = resp ? true : false;
      },
    });
  }

  /**
   * Triggers when login chip is clicked
   */
  openLogin() {
    this.authService.openLogin();
  }

  /**
   * Gets user balance for wallet money
   */
  getUserBalance(uid: string) {
    this.userService.subscribeUserWalletBalance(uid).subscribe({
      next: response => {
        if (response.hasOwnProperty('amount')) {
          this.userBalance = Number(response?.amount);
        }
      }
    })
    // API call to get user balance in number format;
  }

  /**
   * Opens whatsapp group link for joining
   */
  redirectToWhatsapp(): void {
    window.open(this.groupLink, '_blank');
  }
}

import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/authentication/auth.service';
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

  /**
   * Constructor method
   */
  constructor(private authService: AuthService) {}

  /**
   * Lifecycle method
   */
  ngOnInit(): void {
    this.checkUserLogin();
    this.getUserBalance();
  }

  /**
   * Returns whether user is logged in or not
   */
  checkUserLogin() {
    this.authService._user().subscribe({
      next: (resp) => {
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
  getUserBalance() {
    // API call to get user balance in number format;
  }

  /**
   * Opens whatsapp group link for joining
   */
  redirectToWhatsapp(): void {
    window.open(this.groupLink, '_blank');
  }
}
